<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\ResidentController;
use App\Http\Controllers\Admin\ComplaintAdminController;
use App\Http\Controllers\Admin\CertificateRequestAdminController;
use App\Http\Controllers\Admin\ProgramAdminController;
use App\Http\Controllers\Admin\PermitAssistanceAdminController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified', 'staff'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->middleware('staff')->group(function () {
        Route::get('/complaints', [ComplaintAdminController::class, 'index'])
            ->name('admin.complaints.index');
        Route::patch('/complaints/{complaint}', [ComplaintAdminController::class, 'update'])
            ->name('admin.complaints.update');

        Route::get('/certificates', [CertificateRequestAdminController::class, 'index'])
            ->name('admin.certificates.index');
        Route::patch('/certificates/{certificateRequest}', [CertificateRequestAdminController::class, 'update'])
            ->name('admin.certificates.update');

        Route::get('/programs', [ProgramAdminController::class, 'index'])
            ->name('admin.programs.index');
        Route::post('/programs', [ProgramAdminController::class, 'store'])
            ->name('admin.programs.store');
        Route::patch('/programs/{program}', [ProgramAdminController::class, 'update'])
            ->name('admin.programs.update');
        Route::delete('/programs/{program}', [ProgramAdminController::class, 'destroy'])
            ->name('admin.programs.destroy');

        Route::get('/permit-assistance', [PermitAssistanceAdminController::class, 'index'])
            ->name('admin.permit-assistance.index');
        Route::patch('/permit-assistance/{permitAssistanceRequest}', [PermitAssistanceAdminController::class, 'update'])
            ->name('admin.permit-assistance.update');

        Route::get('/residents', [ResidentController::class, 'index'])
            ->name('admin.residents.index');
    });
});

require __DIR__.'/auth.php';
