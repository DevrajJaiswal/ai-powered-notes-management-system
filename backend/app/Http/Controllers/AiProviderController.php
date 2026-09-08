<?php

namespace App\Http\Controllers;

use App\Models\AiProviderKey;
use App\Services\AI\AiProviderManager;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Throwable;

class AiProviderController extends Controller
{
    public function __construct(
        private readonly AiProviderManager $providerManager
    ) {
    }

/**
 * Get models available for an AI provider using the supplied API key.
 */
    public function models(Request $request, int $id): JsonResponse
    {
        $providerKey = $request->user()
            ->aiProviderKeys()
            ->findOrFail($id);

        try {
            $provider = $this->providerManager
                ->driver($providerKey->provider);

            return response()->json([
                'provider' => $providerKey->provider,
                'model' => $providerKey->model,
                'models' => $provider->getModels($providerKey->api_key),
            ]);
        } catch (ConnectionException) {
            throw ValidationException::withMessages([
                'provider' => [
                    'Unable to connect to the AI provider.',
                ],
            ]);
        } catch (Throwable $exception) {
            throw ValidationException::withMessages([
                'provider' => [
                    'Unable to retrieve models from the AI provider.',
                ],
            ]);
        }
    }

    /**
     * Create a new AI provider configuration.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider' => [
                'required',
                'string',
                Rule::in(['openai', 'gemini', 'groq']),
            ],
            'model' => ['required', 'string', 'max:100'],
            'api_key' => ['required', 'string', 'min:10'],
        ]);

        $exists = $request->user()
            ->aiProviderKeys()
            ->where('provider', $validated['provider'])
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'provider' => [
                    'This provider is already configured. Use the update endpoint to edit it.',
                ],
            ]);
        }

        try {
            $provider = $this->providerManager
                ->driver($validated['provider']);

            $isValid = $provider->validateCredentials(
                $validated['api_key'],
                $validated['model']
            );

            if (!$isValid) {
                throw ValidationException::withMessages([
                    'api_key' => [
                        'The API key or selected model could not be validated.',
                    ],
                ]);
            }
        } catch (ConnectionException) {
            throw ValidationException::withMessages([
                'api_key' => [
                    'Unable to connect to the AI provider. Please try again.',
                ],
            ]);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable) {
            throw ValidationException::withMessages([
                'api_key' => [
                    'Unable to validate the AI provider configuration.',
                ],
            ]);
        }

        $isFirstProvider = ! $request->user()
            ->aiProviderKeys()
            ->exists();

        $providerKey = $request->user()
            ->aiProviderKeys()
            ->create([
                ...$validated,
                'is_active' => $isFirstProvider,
            ]);

        return response()->json([
            'message' => 'AI provider configuration created successfully.',
            'provider' => $providerKey->provider,
            'model' => $providerKey->model,
            'configured' => true,
        ], 201);
    }

    /**
     * Get all configured AI providers.
     */
    public function index(Request $request): JsonResponse
    {
        $providers = $request->user()
            ->aiProviderKeys()
            ->get([
                'id',
                'provider',
                'model',
                'is_active',
                'created_at',
                'updated_at',
            ]);

        return response()->json([
            'providers' => $providers,
        ]);
    }

    /**
     * Update an existing AI provider configuration.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $providerKey = $request->user()
            ->aiProviderKeys()
            ->findOrFail($id);

        $validated = $request->validate([
            'provider' => [
                'required',
                'string',
                Rule::in(['openai', 'gemini', 'groq']),
            ],
            'model' => ['required', 'string', 'max:100'],
            'api_key' => ['required', 'string', 'min:10'],
        ]);

        $duplicate = $request->user()
            ->aiProviderKeys()
            ->where('provider', $validated['provider'])
            ->where('id', '!=', $providerKey->id)
            ->exists();

        if ($duplicate) {
            throw ValidationException::withMessages([
                'provider' => [
                    'This provider is already configured.',
                ],
            ]);
        }

        try {
            $provider = $this->providerManager
                ->driver($validated['provider']);

            $isValid = $provider->validateCredentials(
                $validated['api_key'],
                $validated['model']
            );

            if (!$isValid) {
                throw ValidationException::withMessages([
                    'api_key' => [
                        'The API key or selected model could not be validated.',
                    ],
                ]);
            }
        } catch (ConnectionException) {
            throw ValidationException::withMessages([
                'api_key' => [
                    'Unable to connect to the AI provider. Please try again.',
                ],
            ]);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable) {
            throw ValidationException::withMessages([
                'api_key' => [
                    'Unable to validate the AI provider configuration.',
                ],
            ]);
        }

        $providerKey->update($validated);

        return response()->json([
            'message' => 'AI provider configuration updated successfully.',
            'provider' => $providerKey->provider,
            'model' => $providerKey->model,
            'configured' => true,
        ]);
    }

    /**
     * Delete an AI provider configuration.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $providerKey = $request->user()
            ->aiProviderKeys()
            ->findOrFail($id);

        $providerKey->delete();

        return response()->json([
            'message' => 'AI provider configuration deleted successfully.',
        ]);
    }

    public function activate(Request $request, int $id): JsonResponse
    {
        $providerKey = $request->user()
            ->aiProviderKeys()
            ->findOrFail($id);

        DB::transaction(function () use ($request, $providerKey) {
            $request->user()
                ->aiProviderKeys()
                ->update(['is_active' => false]);

            $providerKey->update([
                'is_active' => true,
            ]);
        });

        return response()->json([
            'message' => 'AI provider activated successfully.',
            'provider' => $providerKey->provider,
            'model' => $providerKey->model,
            'is_active' => true,
        ]);
    }
}