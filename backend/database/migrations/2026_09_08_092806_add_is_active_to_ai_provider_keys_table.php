
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_provider_keys', function (Blueprint $table) {
            $table->boolean('is_active')
                ->default(false)
                ->after('api_key');
        });

        // Keep the currently configured provider active.
        $provider = DB::table('ai_provider_keys')->first();

        if ($provider) {
            DB::table('ai_provider_keys')
                ->where('id', $provider->id)
                ->update(['is_active' => true]);
        }
    }

    public function down(): void
    {
        Schema::table('ai_provider_keys', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};