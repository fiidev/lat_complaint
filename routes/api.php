<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComplaintCategoryController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/rooms', [RoomController::class, 'index']);
        Route::get('/rooms/{id}', [RoomController::class, 'show']);
        Route::get('/complaint-categories', [ComplaintCategoryController::class, 'index']);
        Route::get('/complaint-categories/{id}', [ComplaintCategoryController::class, 'show']);

        Route::post('/complaints', [ComplaintController::class, 'store']);
        Route::get('/me/complaints', [ComplaintController::class, 'my']);
        Route::get('/complaints/{id}', [ComplaintController::class, 'show']);

        Route::get('/tickets/{id}', [TicketController::class, 'show']);
        Route::get('/tickets/{id}/histories', [TicketController::class, 'getHistories']);

        Route::middleware('role:admin')->group(function () {
            Route::apiResource('rooms', RoomController::class)->except(['index', 'show']);
            Route::apiResource('complaint-categories', ComplaintCategoryController::class)->except(['index', 'show']);
            Route::get('/admin/complaints', [ComplaintController::class, 'adminIndex']);
            Route::patch('/admin/complaints/{id}/accept', [ComplaintController::class, 'accept']);
            Route::patch('/admin/complaints/{id}/reject', [ComplaintController::class, 'reject']);
            Route::post('/admin/complaints/{id}/tickets', [TicketController::class, 'store']);

            Route::get('/admin/reports/complaints/summary', [ReportController::class, 'summary']);
            Route::get('/admin/reports/complaints/by-category', [ReportController::class, 'byCategory']);
            Route::get('/admin/reports/complaints/by-room', [ReportController::class, 'byRoom']);
            Route::get('/admin/reports/complaints/trends', [ReportController::class, 'trends']);
            Route::get('/admin/reports/tickets/resolution', [ReportController::class, 'resolution']);
        });

        Route::middleware('role:staff')->group(function () {
            Route::get('/me/tickets', [TicketController::class, 'myTickets']);
            Route::patch('/tickets/{id}/start', [TicketController::class, 'start']);
            Route::patch('/tickets/{id}/resolve', [TicketController::class, 'resolve']);
        });

        Route::middleware('role:staff,admin')->group(function () {
            Route::post('/tickets/{id}/histories', [TicketController::class, 'history']);
        });
    });
});
