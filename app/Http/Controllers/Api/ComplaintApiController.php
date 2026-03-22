<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintApiController extends Controller
{
    public function index(Request $request)
    {
        $rows = Complaint::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['rows' => $rows]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category' => ['required', 'string', 'max:120'],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'location' => ['required', 'string', 'max:255'],
            'photo_url' => ['nullable', 'string', 'max:500'],
        ]);

        $row = Complaint::query()->create([
            'user_id' => $request->user()->id,
            'category' => $data['category'],
            'subject' => $data['subject'],
            'description' => $data['description'],
            'location' => $data['location'],
            'photo_url' => $data['photo_url'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['row' => $row], 201);
    }

    public function update(Request $request, Complaint $complaint)
    {
        if ($complaint->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if ($request->has('status')) {
            $data = $request->validate([
                'status' => ['required', 'in:cancelled'],
            ]);

            if (!in_array($complaint->status, ['pending'], true)) {
                return response()->json(['message' => 'Cannot update this complaint.'], 422);
            }

            $complaint->update([
                'status' => $data['status'],
            ]);

            return response()->json(['row' => $complaint]);
        }

        $data = $request->validate([
            'category' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'location' => ['required', 'string', 'max:255'],
        ]);

        if (!in_array($complaint->status, ['pending'], true)) {
            return response()->json(['message' => 'Cannot edit this complaint.'], 422);
        }

        $complaint->update([
            'category' => $data['category'],
            'subject' => $data['subject'],
            'description' => $data['description'],
            'location' => $data['location'],
        ]);

        return response()->json(['row' => $complaint]);
    }

    public function destroy(Request $request, Complaint $complaint)
    {
        if ($complaint->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if (!in_array($complaint->status, ['pending', 'cancelled', 'rejected'], true)) {
            return response()->json(['message' => 'Cannot delete this complaint.'], 422);
        }

        $complaint->delete();

        return response()->json(['ok' => true]);
    }
}
