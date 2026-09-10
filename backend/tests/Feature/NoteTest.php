<?php

namespace Tests\Feature;

use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NoteTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_note(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/notes', [
                'title' => 'Test Note',
                'content' => 'This is a test note.',
            ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath('note.title', 'Test Note')
            ->assertJsonPath(
                'note.content',
                'This is a test note.'
            );

        $this->assertDatabaseHas('notes', [
            'user_id' => $user->id,
            'title' => 'Test Note',
        ]);
    }

    public function test_authenticated_user_can_list_their_notes(): void
    {
        $user = User::factory()->create();

        Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'First Note',
        ]);

        Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Second Note',
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->getJson('/api/notes');

        $response
            ->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_user_only_sees_their_own_notes(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'My Note',
        ]);

        Note::factory()->create([
            'user_id' => $otherUser->id,
            'title' => 'Other User Note',
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->getJson('/api/notes');

        $response
            ->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath(
                'data.0.title',
                'My Note'
            );
    }

    public function test_authenticated_user_can_view_a_note(): void
    {
        $user = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'My Note',
            'content' => 'Note content',
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->getJson("/api/notes/{$note->id}");

        $response
            ->assertStatus(200)
            ->assertJsonPath('note.id', $note->id)
            ->assertJsonPath('note.title', 'My Note');
    }

    public function test_user_cannot_view_another_users_note(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->getJson("/api/notes/{$note->id}");

        $response->assertStatus(404);
    }

    public function test_authenticated_user_can_update_their_note(): void
    {
        $user = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Old Title',
            'content' => 'Old Content',
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->putJson("/api/notes/{$note->id}", [
                'title' => 'Updated Title',
                'content' => 'Updated Content',
            ]);

        $response
            ->assertStatus(200)
            ->assertJsonPath(
                'note.title',
                'Updated Title'
            )
            ->assertJsonPath(
                'note.content',
                'Updated Content'
            );

        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_user_cannot_update_another_users_note(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $otherUser->id,
            'title' => 'Original Title',
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->putJson("/api/notes/{$note->id}", [
                'title' => 'Hacked Title',
                'content' => 'Hacked Content',
            ]);

        $response->assertStatus(404);

        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'title' => 'Original Title',
        ]);
    }

    public function test_authenticated_user_can_delete_their_note(): void
    {
        $user = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->deleteJson("/api/notes/{$note->id}");

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => 'Note deleted successfully.',
            ]);

        $this->assertDatabaseMissing('notes', [
            'id' => $note->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_note(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->deleteJson("/api/notes/{$note->id}");

        $response->assertStatus(404);

        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
        ]);
    }

    public function test_note_creation_requires_title_and_content(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/notes', []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'title',
                'content',
            ]);
    }

    public function test_unauthenticated_user_cannot_access_notes(): void
    {
        $response = $this->getJson('/api/notes');

        $response->assertStatus(401);
    }

    public function test_notes_are_paginated(): void
    {
        $user = User::factory()->create();

        Note::factory()
            ->count(12)
            ->create([
                'user_id' => $user->id,
            ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->getJson('/api/notes?page=1&limit=10');

        $response
            ->assertStatus(200)
            ->assertJsonPath('per_page', 10)
            ->assertJsonPath('current_page', 1)
            ->assertJsonPath('last_page', 2);
    }
}
