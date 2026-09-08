<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Services\AiSummaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class NoteAiController extends Controller
{
    public function __construct(
        private readonly AiSummaryService $summaryService
    ) {
    }

    /**
     * Generate an AI summary for a note.
     */
    public function summary(Request $request, int $id): JsonResponse
    {
        $note = $request->user()
            ->notes()
            ->findOrFail($id);

        $providerKey = $request->user()
            ->aiProviderKeys()
            ->where('is_active', true)
            ->first();

        if (!$providerKey) {
            return response()->json([
                'message' => 'No active AI provider configured.',
            ], 422);
        }

        try {
            $summary = $this->summaryService->generate(
                $note,
                $providerKey
            );

            return response()->json([
                'message' => 'Note summary generated successfully.',
                'note_id' => $note->id,
                'provider' => $providerKey->provider,
                'model' => $providerKey->model,
                'summary' => $summary,
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Unable to generate note summary.',
            ], 502);
        }
    }
}