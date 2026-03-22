<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\BroadcastResidentsPushNotificationJob;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $category = trim((string) $request->query('category', ''));
        $published = trim((string) $request->query('published', ''));

        $rows = Program::query()
            ->when($category !== '', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->when($published !== '', function ($query) use ($published) {
                $query->where('is_published', $published === '1');
            })
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($inner) use ($q) {
                    $inner
                        ->where('title', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%")
                        ->orWhere('location', 'like', "%{$q}%")
                        ->orWhere('schedule', 'like', "%{$q}%")
                        ->orWhere('contact', 'like', "%{$q}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        $categories = Program::query()
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        return Inertia::render('Admin/Programs/Index', [
            'rows' => $rows,
            'filters' => [
                'q' => $q,
                'category' => $category,
                'published' => $published,
            ],
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category' => ['required', 'string', 'max:80'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'contact' => ['nullable', 'string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $program = Program::query()->create([
            'category' => $data['category'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'schedule' => $data['schedule'] ?? null,
            'location' => $data['location'] ?? null,
            'contact' => $data['contact'] ?? null,
            'is_published' => (bool) ($data['is_published'] ?? true),
        ]);

        if ($program->is_published) {
            BroadcastResidentsPushNotificationJob::dispatch(
                'New community program',
                $program->title,
                [
                    'type' => 'program',
                    'id' => (string) $program->id,
                ],
            )->afterResponse();
        }

        return redirect()->route('admin.programs.index');
    }

    public function update(Request $request, Program $program)
    {
        $data = $request->validate([
            'category' => ['required', 'string', 'max:80'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'contact' => ['nullable', 'string', 'max:255'],
            'is_published' => ['required', 'boolean'],
        ]);

        $wasPublished = (bool) $program->is_published;

        $program->update($data);
        $program->refresh();

        if ($program->is_published && ! $wasPublished) {
            BroadcastResidentsPushNotificationJob::dispatch(
                'New community program',
                $program->title,
                [
                    'type' => 'program',
                    'id' => (string) $program->id,
                ],
            )->afterResponse();
        }

        return redirect()->route('admin.programs.index');
    }

    public function destroy(Program $program)
    {
        $program->delete();

        return redirect()->route('admin.programs.index');
    }
}
