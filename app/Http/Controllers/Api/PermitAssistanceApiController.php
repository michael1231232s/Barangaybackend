<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PermitAssistanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PermitAssistanceApiController extends Controller
{
    public function index(Request $request)
    {
        $rows = PermitAssistanceRequest::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['rows' => $rows]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'permit_type' => ['required', 'string', 'max:255'],
            'business_name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'details' => ['required', 'string', 'max:5000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $tracking = $this->generateTrackingNumber();

        $row = PermitAssistanceRequest::query()->create([
            'user_id' => $request->user()->id,
            'tracking_number' => $tracking,
            'permit_type' => $data['permit_type'],
            'business_name' => $data['business_name'],
            'location' => $data['location'],
            'details' => $data['details'],
            'notes' => $data['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['row' => $row], 201);
    }

    public function update(Request $request, PermitAssistanceRequest $permitAssistanceRequest)
    {
        if ($permitAssistanceRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if ($request->has('status')) {
            $data = $request->validate([
                'status' => ['required', 'in:cancelled'],
            ]);

            $permitAssistanceRequest->update([
                'status' => $data['status'],
            ]);

            return response()->json(['row' => $permitAssistanceRequest]);
        }

        $isFullUpdate = $request->has('permit_type')
            || $request->has('business_name')
            || $request->has('location')
            || $request->has('details');

        if ($isFullUpdate) {
            $data = $request->validate([
                'permit_type' => ['required', 'string', 'max:255'],
                'business_name' => ['required', 'string', 'max:255'],
                'location' => ['required', 'string', 'max:255'],
                'details' => ['required', 'string', 'max:5000'],
                'notes' => ['nullable', 'string', 'max:2000'],
            ]);
        } else {
            $data = $request->validate([
                'notes' => ['nullable', 'string', 'max:2000'],
            ]);
        }

        if ($permitAssistanceRequest->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit this request.'], 422);
        }

        if ($isFullUpdate) {
            $permitAssistanceRequest->update([
                'permit_type' => $data['permit_type'],
                'business_name' => $data['business_name'],
                'location' => $data['location'],
                'details' => $data['details'],
                'notes' => $data['notes'] ?? null,
            ]);
        } else {
            $permitAssistanceRequest->update([
                'notes' => $data['notes'] ?? null,
            ]);
        }

        return response()->json(['row' => $permitAssistanceRequest]);
    }

    public function destroy(Request $request, PermitAssistanceRequest $permitAssistanceRequest)
    {
        if ($permitAssistanceRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if (!in_array($permitAssistanceRequest->status, ['pending', 'cancelled', 'rejected'], true)) {
            return response()->json(['message' => 'Cannot delete this request.'], 422);
        }

        $permitAssistanceRequest->delete();

        return response()->json(['ok' => true]);
    }

    private function generateTrackingNumber(): string
    {
        $date = now()->format('Ymd');

        for ($i = 0; $i < 5; $i++) {
            $suffix = strtoupper(Str::random(6));
            $tracking = "PRM-{$date}-{$suffix}";

            $exists = PermitAssistanceRequest::query()
                ->where('tracking_number', $tracking)
                ->exists();

            if (!$exists) {
                return $tracking;
            }
        }

        return 'PRM-'.$date.'-'.strtoupper(Str::random(10));
    }
}
