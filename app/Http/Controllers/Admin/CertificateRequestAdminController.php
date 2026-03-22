<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendUserPushNotificationJob;
use App\Models\CertificateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateRequestAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', ''));

        $base = CertificateRequest::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($inner) use ($q) {
                    $inner
                        ->where('tracking_number', 'like', "%{$q}%")
                        ->orWhere('type', 'like', "%{$q}%")
                        ->orWhere('purpose', 'like', "%{$q}%")
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

        return Inertia::render('Admin/Certificates/Index', [
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

    public function update(Request $request, CertificateRequest $certificateRequest)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,approved,rejected,cancelled,released'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $previousStatus = $certificateRequest->status;

        $certificateRequest->status = $data['status'];
        $certificateRequest->admin_notes = $data['admin_notes'] ?? null;

        if ($data['status'] === 'processing' && !$certificateRequest->processed_at) {
            $certificateRequest->processed_at = now();
        }

        if ($data['status'] === 'released' && !$certificateRequest->released_at) {
            $certificateRequest->released_at = now();
        }

        if ($data['status'] !== 'released') {
            $certificateRequest->released_at = null;
        }

        $certificateRequest->save();

        if ($certificateRequest->user_id && $certificateRequest->status !== $previousStatus) {
            SendUserPushNotificationJob::dispatch(
                $certificateRequest->user_id,
                'Certificate request updated',
                'Your certificate request status is now: '.$certificateRequest->status.'.',
                [
                    'type' => 'certificate',
                    'id' => (string) $certificateRequest->id,
                    'status' => $certificateRequest->status,
                ],
            )->afterResponse();
        }

        return redirect()->route('admin.certificates.index');
    }
}
