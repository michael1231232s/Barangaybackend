<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ServiceRequestApiController extends Controller
{
    public function index(Request $request)
    {
        $rows = ServiceRequest::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['rows' => $rows]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $row = ServiceRequest::query()->create([
            'user_id' => $request->user()->id,
            'type' => $data['type'],
            'notes' => $data['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['row' => $row], 201);
    }

    public function update(Request $request, ServiceRequest $serviceRequest)
    {
        if ($serviceRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if ($request->has('status')) {
            $data = $request->validate([
                'status' => ['required', 'in:cancelled'],
            ]);

            $serviceRequest->update([
                'status' => $data['status'],
            ]);

            return response()->json(['row' => $serviceRequest]);
        }

        $data = $request->validate([
            'type' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($serviceRequest->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit this request.'], 422);
        }

        $serviceRequest->update([
            'type' => $data['type'] ?? $serviceRequest->type,
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json(['row' => $serviceRequest]);
    }

    public function destroy(Request $request, ServiceRequest $serviceRequest)
    {
        if ($serviceRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $serviceRequest->delete();

        return response()->json(['ok' => true]);
    }
}
