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

        Route::apiResource('rooms', RoomController::class)->only(['index', 'show']);
        Route::apiResource('complaint-categories', ComplaintCategoryController::class)
            ->parameters(['complaint-categories' => 'category'])
            ->only(['index', 'show']);

        Route::controller(ComplaintController::class)->group(function () {
            Route::post('/complaints', 'store');
            Route::get('/me/complaints', 'my');
            Route::get('/complaints/{id}', 'show');
        });

        Route::get('/tickets/{id}', [TicketController::class, 'show']);
        Route::get('/tickets/{id}/histories', [TicketController::class, 'getHistories']);
        Route::post('/tickets/{id}/histories', [TicketController::class, 'history'])->middleware('role:staff,admin');

        Route::middleware('role:admin')->group(function () {
            Route::get('/admin/users', [AuthController::class, 'users']);
            Route::apiResource('rooms', RoomController::class)->except(['index', 'show']);
            Route::apiResource('complaint-categories', ComplaintCategoryController::class)
                ->parameters(['complaint-categories' => 'category'])
                ->except(['index', 'show']);

            Route::controller(ComplaintController::class)->prefix('admin/complaints')->group(function () {
                Route::get('/', 'adminIndex');
                Route::patch('/{id}/accept', 'accept');
                Route::patch('/{id}/reject', 'reject');
                Route::post('/{id}/tickets', [TicketController::class, 'store']);
            });

            Route::controller(ReportController::class)->prefix('admin/reports')->group(function () {
                Route::get('/complaints/summary', 'summary');
                Route::get('/complaints/by-category', 'byCategory');
                Route::get('/complaints/by-room', 'byRoom');
                Route::get('/complaints/trends', 'trends');
                Route::get('/tickets/resolution', 'resolution');
            });
        });

        Route::middleware('role:staff')->controller(TicketController::class)->group(function () {
            Route::get('/me/tickets', 'myTickets');
            Route::patch('/tickets/{id}/start', 'start');
            Route::patch('/tickets/{id}/resolve', 'resolve');
        });
    });
});
