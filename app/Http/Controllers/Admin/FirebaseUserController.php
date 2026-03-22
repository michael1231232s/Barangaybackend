<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FirebaseUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FirebaseUserController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $rows = FirebaseUser::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($inner) use ($q) {
                    $inner
                        ->where('email', 'like', "%{$q}%")
                        ->orWhere('display_name', 'like', "%{$q}%")
                        ->orWhere('phone_number', 'like', "%{$q}%")
                        ->orWhere('firebase_uid', 'like', "%{$q}%");
                });
            })
            ->orderByDesc('synced_at')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/FirebaseUsers/Index', [
            'rows' => $rows,
            'filters' => [
                'q' => $q,
            ],
        ]);
    }
}
