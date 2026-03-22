<?php

use App\Http\Controllers\Api\ServiceRequestApiController;
use App\Http\Controllers\Api\MeApiController;
use App\Http\Controllers\Api\ComplaintApiController;
use App\Http\Controllers\Api\CertificateRequestApiController;
use App\Http\Controllers\Api\ProgramApiController;
use App\Http\Controllers\Api\PermitAssistanceApiController;
use App\Http\Controllers\Api\DeviceTokenApiController;
use Illuminate\Support\Facades\Route;

Route::middleware('firebase')->group(function () {
    Route::get('/me', [MeApiController::class, 'show']);
    Route::put('/me', [MeApiController::class, 'update']);

    Route::post('/device-token', [DeviceTokenApiController::class, 'store']);
    Route::delete('/device-token', [DeviceTokenApiController::class, 'destroy']);

    Route::get('/service-requests', [ServiceRequestApiController::class, 'index']);
    Route::post('/service-requests', [ServiceRequestApiController::class, 'store']);
    Route::patch('/service-requests/{serviceRequest}', [ServiceRequestApiController::class, 'update']);
    Route::delete('/service-requests/{serviceRequest}', [ServiceRequestApiController::class, 'destroy']);

    Route::get('/complaints', [ComplaintApiController::class, 'index']);
    Route::post('/complaints', [ComplaintApiController::class, 'store']);
    Route::patch('/complaints/{complaint}', [ComplaintApiController::class, 'update']);
    Route::delete('/complaints/{complaint}', [ComplaintApiController::class, 'destroy']);

    Route::get('/certificates', [CertificateRequestApiController::class, 'index']);
    Route::post('/certificates', [CertificateRequestApiController::class, 'store']);
    Route::patch('/certificates/{certificateRequest}', [CertificateRequestApiController::class, 'update']);
    Route::delete('/certificates/{certificateRequest}', [CertificateRequestApiController::class, 'destroy']);

    Route::get('/programs', [ProgramApiController::class, 'index']);

    Route::get('/permit-assistance', [PermitAssistanceApiController::class, 'index']);
    Route::post('/permit-assistance', [PermitAssistanceApiController::class, 'store']);
    Route::patch('/permit-assistance/{permitAssistanceRequest}', [PermitAssistanceApiController::class, 'update']);
    Route::delete('/permit-assistance/{permitAssistanceRequest}', [PermitAssistanceApiController::class, 'destroy']);
});
