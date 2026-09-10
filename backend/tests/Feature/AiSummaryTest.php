<?php

namespace Tests\Feature;

use App\Models\AiProviderKey;
use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiSummaryTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_generate_note_summary(): void
    {
        Http::fake([
            'https://api.openai.com/*' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => 'This is the generated note summary.',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $user = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $user->id,
            'title' => 'Laravel Learning',
            'content' => 'Learn Laravel authentication and API development.',
        ]);

        AiProviderKey::create([
            'user_id' => $user->id,
            'provider' => 'openai',
            'model' => 'gpt-5.6-luna',
            'api_key' => 'test-openai-key-12345',
            'is_active' => true,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson("/api/notes/{$note->id}/summary");

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => 'Note summary generated successfully.',
                'note_id' => $note->id,
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'summary' => 'This is the generated note summary.',
            ]);

        Http::assertSent(function ($request) {
            return $request->url() ===
                'https://api.openai.com/v1/chat/completions';
        });
    }

    public function test_summary_uses_active_provider(): void
    {
        Http::fake([
            '*' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => 'Summary from active provider.',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $user = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $user->id,
        ]);

        AiProviderKey::create([
            'user_id' => $user->id,
            'provider' => 'openai',
            'model' => 'gpt-5.6-luna',
            'api_key' => 'test-openai-key-12345',
            'is_active' => false,
        ]);

        AiProviderKey::create([
            'user_id' => $user->id,
            'provider' => 'groq',
            'model' => 'openai/gpt-oss-20b',
            'api_key' => 'test-groq-key-12345',
            'is_active' => true,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson("/api/notes/{$note->id}/summary");

        $response
            ->assertStatus(200)
            ->assertJsonPath('provider', 'groq')
            ->assertJsonPath('model', 'openai/gpt-oss-20b')
            ->assertJsonPath(
                'summary',
                'Summary from active provider.'
            );
    }

    public function test_user_cannot_generate_summary_for_another_users_note(): void
    {
        Http::fake([
            '*' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => 'Should not be generated.',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        AiProviderKey::create([
            'user_id' => $user->id,
            'provider' => 'openai',
            'model' => 'gpt-5.6-luna',
            'api_key' => 'test-openai-key-12345',
            'is_active' => true,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson("/api/notes/{$note->id}/summary");

        $response->assertStatus(404);

        Http::assertNothingSent();
    }

    public function test_summary_requires_active_ai_provider(): void
    {
        Http::fake();

        $user = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson("/api/notes/{$note->id}/summary");

        $response
            ->assertStatus(422)
            ->assertJson([
                'message' => 'No active AI provider configured.',
            ]);

        Http::assertNothingSent();
    }

    public function test_unauthenticated_user_cannot_generate_summary(): void
    {
        $note = Note::factory()->create();

        $response = $this
            ->postJson("/api/notes/{$note->id}/summary");

        $response->assertStatus(401);
    }

    public function test_ai_provider_failure_returns_bad_gateway(): void
    {
        Http::fake([
            '*' => Http::response([
                'error' => [
                    'message' => 'Provider failure',
                ],
            ], 500),
        ]);

        $user = User::factory()->create();

        $note = Note::factory()->create([
            'user_id' => $user->id,
        ]);

        AiProviderKey::create([
            'user_id' => $user->id,
            'provider' => 'openai',
            'model' => 'gpt-5.6-luna',
            'api_key' => 'test-openai-key-12345',
            'is_active' => true,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson("/api/notes/{$note->id}/summary");

        $response
            ->assertStatus(502)
            ->assertJson([
                'message' => 'Unable to generate note summary.',
            ]);
    }
}
