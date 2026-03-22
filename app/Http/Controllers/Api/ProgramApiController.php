<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramApiController extends Controller
{
    public function index(Request $request)
    {
        $rows = Program::query()
            ->where('is_published', true)
            ->orderByDesc('id')
            ->get();

        return response()->json(['rows' => $rows]);
    }
}
