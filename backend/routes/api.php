<?php

use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RegistrationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Artist Registration Portal (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Public Artist Submission & Tracking Routes
    Route::post('/registrations', [RegistrationController::class, 'store']);
    Route::get('/registrations/track/{registrationId}', [RegistrationController::class, 'track']);

    // Admin Auth Routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected Admin Management Endpoints
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::get('/admin/analytics', [AdminDashboardController::class, 'analytics']);
        Route::get('/admin/registrations', [AdminDashboardController::class, 'index']);
        Route::get('/admin/registrations/{id}', [AdminDashboardController::class, 'show']);
        Route::patch('/admin/registrations/{id}/status', [AdminDashboardController::class, 'updateStatus']);
        Route::get('/admin/export', [AdminDashboardController::class, 'exportCsv']);
    });

    // Public fallback for admin analytics/list during testing if needed
    Route::get('/admin/public-registrations', [AdminDashboardController::class, 'index']);
});
