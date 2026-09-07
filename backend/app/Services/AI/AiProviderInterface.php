<?php

namespace App\Services\AI;

interface AiProviderInterface
{
    public function validateCredentials(
        string $apiKey,
        string $model
    ): bool;

    public function getModels(string $apiKey): array;

    public function generateText(
        string $apiKey,
        string $model,
        string $prompt
    ): string;
}