<?php

namespace App\Services\AI;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiProvider implements AiProviderInterface
{
    private const BASE_URL = 'https://api.openai.com/v1';

    private function client(string $apiKey): PendingRequest
    {
        return Http::withToken($apiKey)
            ->acceptJson()
            ->timeout(30);
    }

    public function validateCredentials(string $apiKey, string $model): bool
    {
        $response = $this->client($apiKey)
            ->get(self::BASE_URL . '/models/' . urlencode($model));

        return $response->successful();
    }

    public function getModels(string $apiKey): array
    {
        $response = $this->client($apiKey)
            ->get(self::BASE_URL . '/models');

        if (!$response->successful()) {
            throw new RuntimeException(
                'Unable to retrieve OpenAI models.'
            );
        }

        return collect($response->json('data', []))
            ->map(fn (array $model) => [
                'id' => $model['id'] ?? null,
                'owned_by' => $model['owned_by'] ?? null,
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
        $response = $this->client($apiKey)
            ->post(self::BASE_URL . '/chat/completions', [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);

        if (!$response->successful()) {
            throw new RuntimeException(
                'OpenAI text generation failed with HTTP status ' .
                $response->status() . '.'
            );
        }

        $content = $response->json('choices.0.message.content');

        if (!is_string($content) || $content === '') {
            throw new RuntimeException(
                'OpenAI returned an empty response.'
            );
        }

        return $content;
    }
}