<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendUserPushNotificationJob;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestAdminController extends Controller
{
    public function index(): Response
    {
        $rows = ServiceRequest::query()
            ->with('user:id,name,email,role,firebase_uid')
            ->latest()
            ->get();

        return Inertia::render('Admin/ServiceRequests/Index', [
            'rows' => $rows,
        ]);
    }

    public function update(Request $request, ServiceRequest $serviceRequest)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,approved,rejected,cancelled,completed'],
        ]);

        $previousStatus = $serviceRequest->status;

        $serviceRequest->update([
            'status' => $data['status'],
        ]);

        if ($serviceRequest->user_id && $serviceRequest->status !== $previousStatus) {
            SendUserPushNotificationJob::dispatch(
                $serviceRequest->user_id,
                'Service request updated',
                'Your service request status is now: '.$serviceRequest->status.'.',
                [
                    'type' => 'service_request',
                    'id' => (string) $serviceRequest->id,
                    'status' => $serviceRequest->status,
                ],
            )->afterResponse();
        }

        return redirect()->route('admin.service-requests.index');
    }
}
