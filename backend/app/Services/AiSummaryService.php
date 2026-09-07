<?php

namespace App\Services;

use App\Models\AiProviderKey;
use App\Models\Note;
use App\Services\AI\AiProviderManager;
use RuntimeException;

class AiSummaryService
{
    public function __construct(
        private readonly AiProviderManager $providerManager
    ) {
    }

    public function generate(Note $note, AiProviderKey $providerKey): string
    {
        $provider = $this->providerManager
            ->driver($providerKey->provider);

        $prompt = <<<PROMPT
Summarize the following note clearly and concisely.

Requirements:
- Preserve the important information.
- Do not add information that is not present in the note.
- Keep the summary easy to read.
- Return only the summary.

Title:
{$note->title}

Content:
{$note->content}
PROMPT;

        $summary = $provider->generateText(
            $providerKey->api_key,
            $providerKey->model,
            $prompt
        );

        if ($summary === '') {
            throw new RuntimeException(
                'The AI provider returned an empty summary.'
            );
        }

        return $summary;
    }
}