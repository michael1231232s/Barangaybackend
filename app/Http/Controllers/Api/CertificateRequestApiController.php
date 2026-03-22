<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateRequestApiController extends Controller
{
    public function index(Request $request)
    {
        $rows = CertificateRequest::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['rows' => $rows]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'purpose' => ['required', 'string', 'max:255'],
            'delivery_method' => ['required', 'in:pickup,download'],
            'preferred_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $tracking = $this->generateTrackingNumber();

        $row = CertificateRequest::query()->create([
            'user_id' => $request->user()->id,
            'tracking_number' => $tracking,
            'type' => $data['type'],
            'purpose' => $data['purpose'],
            'delivery_method' => $data['delivery_method'],
            'preferred_date' => $data['preferred_date'],
            'notes' => $data['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['row' => $row], 201);
    }

    public function update(Request $request, CertificateRequest $certificateRequest)
    {
        if ($certificateRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if ($request->has('status')) {
            $data = $request->validate([
                'status' => ['required', 'in:cancelled'],
            ]);

            $certificateRequest->update([
                'status' => $data['status'],
            ]);

            return response()->json(['row' => $certificateRequest]);
        }

        $isFullUpdate = $request->has('type')
            || $request->has('purpose')
            || $request->has('delivery_method')
            || $request->has('preferred_date');

        if ($isFullUpdate) {
            $data = $request->validate([
                'type' => ['required', 'string', 'max:255'],
                'purpose' => ['required', 'string', 'max:255'],
                'delivery_method' => ['required', 'in:pickup,download'],
                'preferred_date' => ['required', 'date'],
                'notes' => ['nullable', 'string', 'max:2000'],
            ]);
        } else {
            $data = $request->validate([
                'notes' => ['nullable', 'string', 'max:2000'],
            ]);
        }

        if ($certificateRequest->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit this request.'], 422);
        }

        if ($isFullUpdate) {
            $certificateRequest->update([
                'type' => $data['type'],
                'purpose' => $data['purpose'],
                'delivery_method' => $data['delivery_method'],
                'preferred_date' => $data['preferred_date'],
                'notes' => $data['notes'] ?? null,
            ]);
        } else {
            $certificateRequest->update([
                'notes' => $data['notes'] ?? null,
            ]);
        }

        return response()->json(['row' => $certificateRequest]);
    }

    public function destroy(Request $request, CertificateRequest $certificateRequest)
    {
        if ($certificateRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if (!in_array($certificateRequest->status, ['pending', 'cancelled', 'rejected'], true)) {
            return response()->json(['message' => 'Cannot delete this request.'], 422);
        }

        $certificateRequest->delete();

        return response()->json(['ok' => true]);
    }

    private function generateTrackingNumber(): string
    {
        $date = now()->format('Ymd');

        for ($i = 0; $i < 5; $i++) {
            $suffix = strtoupper(Str::random(6));
            $tracking = "CRT-{$date}-{$suffix}";

            $exists = CertificateRequest::query()
                ->where('tracking_number', $tracking)
                ->exists();

            if (!$exists) {
                return $tracking;
            }
        }

        return 'CRT-'.$date.'-'.strtoupper(Str::random(10));
    }
}
