<?php

namespace Tests\Feature;

use App\Models\AiProviderKey;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiProviderTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_add_ai_provider(): void
    {
        Http::fake([
            '*' => Http::response([
                'id' => 'gpt-5.6-luna',
            ], 200),
        ]);

        $user = User::factory()->create();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'test-openai-key-12345',
            ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'message' => 'AI provider configuration created successfully.',
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'configured' => true,
            ])
            ->assertJsonMissing([
                'api_key' => 'test-openai-key-12345',
            ]);

        $this->assertDatabaseHas('ai_provider_keys', [
            'user_id' => $user->id,
            'provider' => 'openai',
            'model' => 'gpt-5.6-luna',
            'is_active' => true,
        ]);
    }

    public function test_ai_provider_api_key_is_encrypted(): void
    {
        Http::fake([
            '*' => Http::response([
                'id' => 'gpt-5.6-luna',
            ], 200),
        ]);

        $user = User::factory()->create();

        $plainTextKey = 'test-openai-key-12345';

        $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => $plainTextKey,
            ])
            ->assertStatus(201);

        $storedKey = DB::table('ai_provider_keys')
            ->where('user_id', $user->id)
            ->value('api_key');

        $this->assertNotSame($plainTextKey, $storedKey);

        $providerKey = AiProviderKey::where(
            'user_id',
            $user->id
        )->first();

        $this->assertSame(
            $plainTextKey,
            $providerKey->api_key
        );
    }

    public function test_first_provider_is_active(): void
    {
        Http::fake([
            '*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();

        $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'test-openai-key-12345',
            ])
            ->assertStatus(201);

        $provider = AiProviderKey::where(
            'user_id',
            $user->id
        )->first();

        $this->assertTrue($provider->is_active);
    }

    public function test_duplicate_provider_is_rejected(): void
    {
        Http::fake([
            '*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();

        $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'test-openai-key-12345',
            ])
            ->assertStatus(201);

        $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'another-openai-key-12345',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('provider');
    }

    public function test_unsupported_model_is_rejected(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'unsupported-model',
                'api_key' => 'test-openai-key-12345',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors('model');

        Http::assertNothingSent();
    }

    public function test_unauthenticated_user_cannot_access_ai_providers(): void
    {
        $response = $this->getJson('/api/ai/providers');

        $response->assertStatus(401);
    }

    public function test_user_cannot_access_another_users_provider(): void
    {
        Http::fake([
            '*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $this
            ->actingAs($otherUser, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'test-openai-key-12345',
            ])
            ->assertStatus(201);

        $provider = AiProviderKey::where(
            'user_id',
            $otherUser->id
        )->first();

        $this
            ->actingAs($user, 'sanctum')
            ->putJson("/api/ai/providers/{$provider->id}", [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'hacked-key-12345',
            ])
            ->assertStatus(404);

        $this
            ->actingAs($user, 'sanctum')
            ->deleteJson("/api/ai/providers/{$provider->id}")
            ->assertStatus(404);
    }

    public function test_authenticated_user_can_update_provider(): void
    {
        Http::fake([
            '*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();

        $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'old-openai-key-12345',
            ])
            ->assertStatus(201);

        $provider = AiProviderKey::where(
            'user_id',
            $user->id
        )->first();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->putJson("/api/ai/providers/{$provider->id}", [
                'provider' => 'openai',
                'model' => 'gpt-5.6-sol',
                'api_key' => 'new-openai-key-12345',
            ]);

        $response
            ->assertStatus(200)
            ->assertJson([
                'provider' => 'openai',
                'model' => 'gpt-5.6-sol',
                'configured' => true,
            ]);

        $provider->refresh();

        $this->assertSame(
            'gpt-5.6-sol',
            $provider->model
        );

        $this->assertSame(
            'new-openai-key-12345',
            $provider->api_key
        );
    }

    public function test_user_can_switch_active_provider(): void
    {
        Http::fake([
            '*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();

        $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'test-openai-key-12345',
            ])
            ->assertStatus(201);

        $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'groq',
                'model' => 'openai/gpt-oss-20b',
                'api_key' => 'test-groq-key-12345',
            ])
            ->assertStatus(201);

        $providers = AiProviderKey::where(
            'user_id',
            $user->id
        )->get();

        $openAi = $providers->firstWhere(
            'provider',
            'openai'
        );

        $groq = $providers->firstWhere(
            'provider',
            'groq'
        );

        $this
            ->actingAs($user, 'sanctum')
            ->patchJson("/api/ai/providers/{$groq->id}/activate")
            ->assertStatus(200)
            ->assertJson([
                'provider' => 'groq',
                'is_active' => true,
            ]);

        $openAi->refresh();
        $groq->refresh();

        $this->assertFalse($openAi->is_active);
        $this->assertTrue($groq->is_active);
    }

    public function test_authenticated_user_can_delete_provider(): void
    {
        Http::fake([
            '*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();

        $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/ai/providers', [
                'provider' => 'openai',
                'model' => 'gpt-5.6-luna',
                'api_key' => 'test-openai-key-12345',
            ])
            ->assertStatus(201);

        $provider = AiProviderKey::where(
            'user_id',
            $user->id
        )->first();

        $this
            ->actingAs($user, 'sanctum')
            ->deleteJson("/api/ai/providers/{$provider->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('ai_provider_keys', [
            'id' => $provider->id,
        ]);
    }

    public function test_ai_provider_requests_are_rate_limited(): void
    {
        $user = User::factory()->create();

        for ($i = 0; $i < 10; $i++) {
            $this
                ->actingAs($user, 'sanctum')
                ->getJson('/api/ai/providers');
        }

        $response = $this
            ->actingAs($user, 'sanctum')
            ->getJson('/api/ai/providers');

        $response->assertStatus(429);
    }
}
