<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/complaints', [ComplaintController::class, 'store']);
        Route::get('/rooms', RoomController::class);

        Route::middleware('role:admin')->group(function () {
            Route::patch('/admin/complaints/{id}/accept', [ComplaintController::class, 'accept']);
            Route::patch('/admin/complaints/{id}/reject', [ComplaintController::class, 'reject']);
            Route::post('/admin/complaints/{id}/tickets ', [TicketController::class, 'store']);
        });
        Route::middleware('role:staff')->group(function () {
            Route::patch('/tickets/{id}/start ', [TicketController::class, 'start']);
            Route::patch('/tickets/{id}/resolve', [TicketController::class, 'resolve']);
        });
        Route::middleware('role:staff,admin')->group(function () {
            Route::patch('/tickets/{id}/histories', [TicketController::class, 'history']);
        });
    });
});
