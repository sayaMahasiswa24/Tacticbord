<?php

use App\Http\Controllers\HealthCheckController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\TacticalBoardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingPageController::class, 'index'])->name('landing');
Route::get('/board', [TacticalBoardController::class, 'index'])->name('tactical-board.index');
Route::get('/api/health', HealthCheckController::class)->name('health');
Route::post('/tactics', [TacticalBoardController::class, 'store'])->name('tactical-board.store');
Route::get('/tactics/{savedTactic}', [TacticalBoardController::class, 'show'])->name('tactical-board.show');
Route::delete('/tactics/{savedTactic}', [TacticalBoardController::class, 'destroy'])->name('tactical-board.destroy');

