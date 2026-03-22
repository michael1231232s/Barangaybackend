<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $rows = ServiceRequest::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('ServiceRequests/Index', [
            'rows' => $rows,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        ServiceRequest::create([
            'user_id' => $request->user()->id,
            'type' => $data['type'],
            'notes' => $data['notes'] ?? null,
            'status' => 'pending',
        ]);

        return redirect()->route('service-requests.index');
    }
}
