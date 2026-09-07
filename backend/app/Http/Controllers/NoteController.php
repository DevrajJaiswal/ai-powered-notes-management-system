<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Get all notes belonging to the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $limit = min($request->integer('limit', 10), 100);

        $notes = $request->user()
            ->notes()
            ->latest()
            ->paginate($limit);

        return response()->json($notes);
    }

    /**
     * Create a new note.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $note = $request->user()->notes()->create($validated);

        return response()->json([
            'message' => 'Note created successfully.',
            'note' => $note,
        ], 201);
    }

    /**
     * Get a single note belonging to the authenticated user.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $note = $request->user()
            ->notes()
            ->findOrFail($id);

        return response()->json([
            'note' => $note,
        ]);
    }

    /**
     * Update a note belonging to the authenticated user.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $note = $request->user()
            ->notes()
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
        ]);

        $note->update($validated);

        return response()->json([
            'message' => 'Note updated successfully.',
            'note' => $note->fresh(),
        ]);
    }

    /**
     * Delete a note belonging to the authenticated user.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $note = $request->user()
            ->notes()
            ->findOrFail($id);

        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully.',
        ]);
    }
}