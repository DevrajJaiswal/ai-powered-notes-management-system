<?php

use App\Http\Controllers\AiProviderController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Notes
    Route::apiResource('notes', NoteController::class);

    // AI Provider Configurations
    Route::get('/ai/providers', [AiProviderController::class, 'index']);
    Route::post('/ai/providers', [AiProviderController::class, 'store']);
    Route::put('/ai/providers/{id}', [AiProviderController::class, 'update']);
    Route::delete('/ai/providers/{id}', [AiProviderController::class, 'destroy']);

    // Available models for a provider
    Route::get(
        '/ai/providers/{id}/models',
        [AiProviderController::class, 'models']
    );
});