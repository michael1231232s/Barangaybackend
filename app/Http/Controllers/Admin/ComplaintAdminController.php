<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendUserPushNotificationJob;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ComplaintAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', ''));

        $base = Complaint::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($inner) use ($q) {
                    $inner
                        ->where('category', 'like', "%{$q}%")
                        ->orWhere('subject', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%")
                        ->orWhere('location', 'like', "%{$q}%");
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

        return Inertia::render('Admin/Complaints/Index', [
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

    public function update(Request $request, Complaint $complaint)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,resolved,rejected'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $previousStatus = $complaint->status;

        $complaint->status = $data['status'];
        $complaint->admin_notes = $data['admin_notes'] ?? null;

        if ($data['status'] === 'resolved' && !$complaint->resolved_at) {
            $complaint->resolved_at = now();
        }

        if ($data['status'] !== 'resolved') {
            $complaint->resolved_at = null;
        }

        $complaint->save();

        if ($complaint->user_id && $complaint->status !== $previousStatus) {
            SendUserPushNotificationJob::dispatch(
                $complaint->user_id,
                'Complaint updated',
                'Your complaint status is now: '.$complaint->status.'.',
                [
                    'type' => 'complaint',
                    'id' => (string) $complaint->id,
                    'status' => $complaint->status,
                ],
            )->afterResponse();
        }

        return redirect()->route('admin.complaints.index');
    }
}
