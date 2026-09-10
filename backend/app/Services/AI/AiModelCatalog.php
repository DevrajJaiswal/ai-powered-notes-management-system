<?php

namespace App\Services\AI;

class AiModelCatalog
{

    private const MODELS = [
        'openai' => [
            [
                'id' => 'gpt-5.6-luna',
                'name' => 'GPT-5.6 Luna',
                'description' => 'Cost-efficient option for everyday note summaries.',
            ],
            [
                'id' => 'gpt-5.6-terra',
                'name' => 'GPT-5.6 Terra',
                'description' => 'Balanced option for quality and cost.',
            ],
            [
                'id' => 'gpt-5.6-sol',
                'name' => 'GPT-5.6 Sol',
                'description' => 'Advanced option for complex reasoning and analysis.',
            ],
        ],

        'gemini' => [
            [
                'id' => 'gemini-2.5-flash',
                'name' => 'Gemini 2.5 Flash',
                'description' => 'Fast and cost-effective for everyday tasks.',
            ],
            [
                'id' => 'gemini-2.5-flash-lite',
                'name' => 'Gemini 2.5 Flash-Lite',
                'description' => 'Lightweight and budget-friendly.',
            ],
            [
                'id' => 'gemini-2.5-pro',
                'name' => 'Gemini 2.5 Pro',
                'description' => 'Advanced model for complex reasoning.',
            ],
            [
                'id' => 'gemini-3.5-flash',
                'name' => 'Gemini 3.5 Flash',
                'description' => 'Fast general-purpose model for high-throughput tasks.',
            ],
            [
                'id' => 'gemini-3.5-flash-lite',
                'name' => 'Gemini 3.5 Flash-Lite',
                'description' => 'Fast and cost-effective option for lightweight tasks.',
            ],
        ],

        'groq' => [
            [
                'id' => 'openai/gpt-oss-20b',
                'name' => 'GPT-OSS 20B',
                'description' => 'Very fast and cost-efficient open-weight model.',
            ],
            [
                'id' => 'openai/gpt-oss-120b',
                'name' => 'GPT-OSS 120B',
                'description' => 'Higher-capability open-weight model.',
            ],
            [
                'id' => 'llama-3.1-8b-instant',
                'name' => 'Llama 3.1 8B Instant',
                'description' => 'Extremely fast model for lightweight tasks.',
            ],
            [
                'id' => 'llama-3.3-70b-versatile',
                'name' => 'Llama 3.3 70B Versatile',
                'description' => 'Higher-capability model for general-purpose tasks.',
            ],
        ],
    ];



    public static function all(string $provider): array
    {
        return self::MODELS[$provider] ?? [];
    }

    public static function ids(string $provider): array
    {
        return collect(self::all($provider))
            ->pluck('id')
            ->all();
    }

    public static function contains(
        string $provider,
        string $model
    ): bool {
        return in_array(
            $model,
            self::ids($provider),
            true
        );
    }
}