<?php

namespace App\Http\Controllers;

use App\Models\CertificateRequest;
use App\Models\Complaint;
use App\Models\PermitAssistanceRequest;
use App\Models\Program;
use App\Models\ServiceRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $totalUsers = (int) User::query()->count();

        $totalRequests = (int) ServiceRequest::query()->count();

        $requestsByStatus = ServiceRequest::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $requestsByType = ServiceRequest::query()
            ->select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->orderByDesc('total')
            ->pluck('total', 'type');

        $start = Carbon::now()->startOfDay()->subDays(6);
        $end = Carbon::now()->endOfDay();

        $raw = ServiceRequest::query()
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw('date(created_at) as day'), DB::raw('count(*) as total'))
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->pluck('total', 'day');

        $dailyRequests = collect(range(0, 6))
            ->map(function ($i) use ($start, $raw) {
                $day = $start->copy()->addDays($i)->toDateString();

                return [
                    'day' => $day,
                    'total' => (int) ($raw[$day] ?? 0),
                ];
            })
            ->values();

        $complaintsByStatus = Complaint::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $certificatesByStatus = CertificateRequest::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $permitsByStatus = PermitAssistanceRequest::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $programsPublished = (int) Program::query()->where('is_published', true)->count();
        $programsHidden = (int) Program::query()->where('is_published', false)->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalRequests' => $totalRequests,
                'requestsByStatus' => $requestsByStatus,
                'requestsByType' => $requestsByType,
                'dailyRequests' => $dailyRequests,
                'totalComplaints' => (int) Complaint::query()->count(),
                'complaintsByStatus' => $complaintsByStatus,
                'totalCertificates' => (int) CertificateRequest::query()->count(),
                'certificatesByStatus' => $certificatesByStatus,
                'totalPermits' => (int) PermitAssistanceRequest::query()->count(),
                'permitsByStatus' => $permitsByStatus,
                'programsPublished' => $programsPublished,
                'programsHidden' => $programsHidden,
            ],
        ]);
    }
}
