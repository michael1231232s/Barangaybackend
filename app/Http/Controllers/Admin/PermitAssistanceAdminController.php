<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendUserPushNotificationJob;
use App\Models\PermitAssistanceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PermitAssistanceAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', ''));

        $base = PermitAssistanceRequest::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($inner) use ($q) {
                    $inner
                        ->where('tracking_number', 'like', "%{$q}%")
                        ->orWhere('permit_type', 'like', "%{$q}%")
                        ->orWhere('business_name', 'like', "%{$q}%")
                        ->orWhere('location', 'like', "%{$q}%")
                        ->orWhere('details', 'like', "%{$q}%")
                        ->orWhere('notes', 'like', "%{$q}%");
                })->orWhereHas('user', function ($uq) use ($q) {
                    $uq
                        ->where('name', 'like', "%{$q}%")
                        ->orWhere('email', 'like', "%{$q}%")
                        ->orWhere('phone_number', 'like', "%{$q}%")
                        ->orWhere('firebase_uid', 'like', "%{$q}%");
                });
            });

        $statsTotal = (clone $base)->count();
        $statsByStatus = (clone $base)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $rows = (clone $base)
            ->with('user:id,name,email,phone_number,barangay,purok')
            ->when($status !== '', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/PermitAssistance/Index', [
            'rows' => $rows,
            'filters' => [
                'q' => $q,
                'status' => $status,
            ],
            'stats' => [
                'total' => $statsTotal,
                'byStatus' => $statsByStatus,
            ],
        ]);
    }

    public function update(Request $request, PermitAssistanceRequest $permitAssistanceRequest)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,scheduled,resolved,rejected,cancelled'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
            'scheduled_at' => ['nullable', 'date'],
        ]);

        $previousStatus = $permitAssistanceRequest->status;

        $permitAssistanceRequest->status = $data['status'];
        $permitAssistanceRequest->admin_notes = $data['admin_notes'] ?? null;
        $permitAssistanceRequest->scheduled_at = $data['scheduled_at'] ?? null;

        if ($data['status'] === 'resolved' && !$permitAssistanceRequest->resolved_at) {
            $permitAssistanceRequest->resolved_at = now();
        }

        if ($data['status'] !== 'resolved') {
            $permitAssistanceRequest->resolved_at = null;
        }

        $permitAssistanceRequest->save();

        if ($permitAssistanceRequest->user_id && $permitAssistanceRequest->status !== $previousStatus) {
            SendUserPushNotificationJob::dispatch(
                $permitAssistanceRequest->user_id,
                'Permit assistance updated',
                'Your permit assistance request status is now: '.$permitAssistanceRequest->status.'.',
                [
                    'type' => 'permit_assistance',
                    'id' => (string) $permitAssistanceRequest->id,
                    'status' => $permitAssistanceRequest->status,
                ],
            )->afterResponse();
        }

        return redirect()->route('admin.permit-assistance.index');
    }
}
