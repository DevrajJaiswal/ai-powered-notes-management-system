<?php

namespace App\Services\AI;

use InvalidArgumentException;

class AiProviderManager
{
    public function driver(string $provider): AiProviderInterface
    {
        return match ($provider) {
            'openai' => app(OpenAiProvider::class),
            'gemini' => app(GeminiProvider::class),
            'groq' => app(GroqProvider::class),
            default => throw new InvalidArgumentException(
                "Unsupported AI provider: {$provider}"
            ),
        };
    }
}