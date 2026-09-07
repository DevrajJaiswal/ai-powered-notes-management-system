<?php

namespace App\Services\AI;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiProvider implements AiProviderInterface
{
    private const BASE_URL =
        'https://generativelanguage.googleapis.com/v1beta';

    private function client(string $apiKey): PendingRequest
    {
        return Http::withHeaders([
            'x-goog-api-key' => $apiKey,
        ])
            ->acceptJson()
            ->timeout(30);
    }

    public function validateCredentials(string $apiKey, string $model): bool
    {
        $model = str_starts_with($model, 'models/')
            ? $model
            : 'models/' . $model;

        $response = $this->client($apiKey)
            ->get(self::BASE_URL . '/' . $model);

        if (!$response->successful()) {
            return false;
        }

        $supportedActions = $response->json('supportedGenerationMethods', []);

        return in_array('generateContent', $supportedActions, true);
    }

    public function getModels(string $apiKey): array
    {
        $response = $this->client($apiKey)
            ->get(self::BASE_URL . '/models', [
                'pageSize' => 100,
            ]);

        if (!$response->successful()) {
            throw new RuntimeException(
                'Unable to retrieve Gemini models.'
            );
        }

        return collect($response->json('models', []))
            ->filter(function (array $model) {
                return in_array(
                    'generateContent',
                    $model['supportedGenerationMethods'] ?? [],
                    true
                );
            })
            ->map(fn (array $model) => [
                'id' => $model['name'] ?? null,
                'display_name' => $model['displayName'] ?? null,
            ])
            ->filter(fn (array $model) => !empty($model['id']))
            ->values()
            ->all();
    }

    public function generateText(
        string $apiKey,
        string $model,
        string $prompt
    ): string {
        $model = str_starts_with($model, 'models/')
            ? $model
            : 'models/' . $model;

        $response = $this->client($apiKey)
            ->post(
                self::BASE_URL . '/' . $model . ':generateContent',
                [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => $prompt,
                                ],
                            ],
                        ],
                    ],
                ]
            );

        if (!$response->successful()) {
            throw new RuntimeException(
                'Gemini text generation failed.'
            );
        }

        $content = $response->json(
            'candidates.0.content.parts.0.text'
        );

        if (!is_string($content) || $content === '') {
            throw new RuntimeException(
                'Gemini returned an empty response.'
            );
        }

        return $content;
    }
}