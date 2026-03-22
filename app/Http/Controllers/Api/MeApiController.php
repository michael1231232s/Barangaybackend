<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;

class MeApiController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $user->load(['householdMembers']);

        return response()->json([
            'user' => $user,
            'household_members' => $user->householdMembers,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:120'],
            'first_name' => ['nullable', 'string', 'max:120'],
            'middle_name' => ['nullable', 'string', 'max:120'],
            'phone_number' => ['nullable', 'string', 'max:50'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'purok' => ['nullable', 'string', 'max:100'],
            'barangay' => ['nullable', 'string', 'max:150'],
            'city' => ['nullable', 'string', 'max:150'],
            'province' => ['nullable', 'string', 'max:150'],
            'birthdate' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:30'],
            'civil_status' => ['nullable', 'in:single,married,widowed,separated'],
            'occupation' => ['nullable', 'string', 'max:150'],
        ]);

        $user = $request->user();

        $filtered = array_filter($data, fn ($v) => $v !== null);

        $hasNameParts = array_key_exists('last_name', $filtered)
            || array_key_exists('first_name', $filtered)
            || array_key_exists('middle_name', $filtered);

        if ($hasNameParts) {
            $ln = trim((string)($filtered['last_name'] ?? $user->last_name ?? ''));
            $fn = trim((string)($filtered['first_name'] ?? $user->first_name ?? ''));
            $mn = trim((string)($filtered['middle_name'] ?? $user->middle_name ?? ''));

            $filtered['last_name'] = $ln !== '' ? $ln : null;
            $filtered['first_name'] = $fn !== '' ? $fn : null;
            $filtered['middle_name'] = $mn !== '' ? $mn : null;

            if ($ln !== '' && $fn !== '') {
                $name = $ln . ', ' . $fn;
                if ($mn !== '') {
                    $name .= ' ' . $mn;
                }
                $filtered['name'] = $name;
            }
        }

        $dupMessage = 'Another resident is already registered with this full name and birthdate. Please verify your details or contact the Barangay office.';

        $lastForDup = array_key_exists('last_name', $filtered)
            ? trim((string) ($filtered['last_name'] ?? ''))
            : trim((string) ($user->last_name ?? ''));
        $firstForDup = array_key_exists('first_name', $filtered)
            ? trim((string) ($filtered['first_name'] ?? ''))
            : trim((string) ($user->first_name ?? ''));

        $birthRaw = array_key_exists('birthdate', $filtered)
            ? $filtered['birthdate']
            : $user->birthdate;
        $birthStr = null;
        if ($birthRaw instanceof \DateTimeInterface) {
            $birthStr = Carbon::instance($birthRaw)->format('Y-m-d');
        } elseif (is_string($birthRaw) && trim($birthRaw) !== '') {
            try {
                $birthStr = Carbon::parse($birthRaw)->format('Y-m-d');
            } catch (\Throwable) {
                $birthStr = null;
            }
        }

        if ($lastForDup !== '' && $firstForDup !== '' && $birthStr) {
            $duplicate = User::query()
                ->where('id', '!=', $user->id)
                ->whereRaw('lower(trim(last_name)) = ?', [mb_strtolower($lastForDup)])
                ->whereRaw('lower(trim(first_name)) = ?', [mb_strtolower($firstForDup)])
                ->whereDate('birthdate', $birthStr)
                ->exists();

            if ($duplicate) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => [
                        'last_name' => [$dupMessage],
                        'first_name' => [$dupMessage],
                        'birthdate' => [$dupMessage],
                    ],
                ], 422);
            }
        }

        $user->fill(array_filter($filtered, fn ($v) => $v !== null));
        $user->save();

        return response()->json(['user' => $user]);
    }
}
