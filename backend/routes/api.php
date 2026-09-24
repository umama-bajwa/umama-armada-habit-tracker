<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\HabitLogController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/habits', [HabitController::class, 'store']);
    Route::get('/habits', [HabitController::class, 'index']);
    Route::get('/habits/{id}', [HabitController::class, 'show']);
    Route::put('/habits/{id}', [HabitController::class, 'update']);
    Route::patch('/habits/{id}', [HabitController::class, 'update']);
    Route::delete('/habits/{id}', [HabitController::class, 'destroy']);
    Route::post('/habits/{id}/complete', [HabitLogController::class, 'complete']);
    Route::post('/habits/{id}/incomplete', [HabitLogController::class, 'incomplete']);
});