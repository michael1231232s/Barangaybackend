import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const PUBLISHED_OPTIONS = [
    { value: '', label: 'All' },
    { value: '1', label: 'Published' },
    { value: '0', label: 'Hidden' },
];

const DEFAULT_CATEGORIES = [
    'Health',
    'Sanitation',
    'Youth',
    'Peace and Order',
];

export default function Index() {
    const { rows, filters, categories } = usePage().props;

    const [q, setQ] = useState(filters?.q || '');
    const [category, setCategory] = useState(filters?.category || '');
    const [published, setPublished] = useState(filters?.published || '');

    useEffect(() => {
        setQ(filters?.q || '');
        setCategory(filters?.category || '');
        setPublished(filters?.published || '');
    }, [filters?.q, filters?.category, filters?.published]);

    const items = useMemo(() => rows?.data || [], [rows]);

    const categoryOptions = useMemo(() => {
        const dynamic = Array.isArray(categories) ? categories : [];
        const set = new Set([...DEFAULT_CATEGORIES, ...dynamic].filter(Boolean));
        return ['', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
    }, [categories]);

    function onSubmit(e) {
        e.preventDefault();
        router.get(
            route('admin.programs.index'),
            { q, category, published },
            { preserveState: true, replace: true },
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-extrabold leading-tight text-slate-900">
                    Community Programs
                </h2>
            }
        >
            <Head title="Programs" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-8">
                    <CreateProgramCard categoryOptions={categoryOptions} />

                    <div className="rounded-xl border border-blue-900/10 bg-white p-4 shadow-sm">
                        <form
                            onSubmit={onSubmit}
                            className="flex flex-col gap-3 md:flex-row md:items-center"
                        >
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                placeholder="Search title, description, location, schedule, contact"
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 md:w-56"
                            >
                                {categoryOptions.map((c) => (
                                    <option key={c || 'all'} value={c}>
                                        {c === '' ? 'All categories' : c}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={published}
                                onChange={(e) => setPublished(e.target.value)}
                                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 md:w-48"
                            >
                                {PUBLISHED_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-800"
                            >
                                Apply
                            </button>
                        </form>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-blue-900/10 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Category
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Title
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Schedule / Location
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Published
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {items.length === 0 ? (
                                        <tr>
                                            <td
                                                className="px-4 py-4 text-sm text-slate-600"
                                                colSpan={5}
                                            >
                                                No programs found.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((p) => (
                                            <ProgramRow
                                                key={p.id}
                                                row={p}
                                                categoryOptions={categoryOptions.filter(
                                                    (x) => x !== '',
                                                )}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
                            <div>
                                Page {rows?.current_page || 1} of{' '}
                                {rows?.last_page || 1}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="rounded border border-slate-300 px-3 py-1 font-semibold disabled:opacity-50"
                                    disabled={!rows?.prev_page_url}
                                    onClick={() =>
                                        rows?.prev_page_url &&
                                        router.get(rows.prev_page_url)
                                    }
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    className="rounded border border-slate-300 px-3 py-1 font-semibold disabled:opacity-50"
                                    disabled={!rows?.next_page_url}
                                    onClick={() =>
                                        rows?.next_page_url &&
                                        router.get(rows.next_page_url)
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function CreateProgramCard({ categoryOptions }) {
    const { data, setData, post, processing, reset } = useForm({
        category: categoryOptions.find((x) => x !== '') || 'Health',
        title: '',
        description: '',
        schedule: '',
        location: '',
        contact: '',
        is_published: true,
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.programs.store'), {
            preserveScroll: true,
            onSuccess: () => reset('title', 'description', 'schedule', 'location', 'contact'),
        });
    }

    function fillCurrentLocation() {
        if (!navigator?.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos?.coords?.latitude;
                const lng = pos?.coords?.longitude;
                if (typeof lat === 'number' && typeof lng === 'number') {
                    setData('location', `${lat},${lng}`);
                }
            },
            () => alert('Unable to get current location. Please allow location permission.'),
            { enableHighAccuracy: true, timeout: 15000 },
        );
    }

    return (
        <div className="rounded-xl border border-blue-900/10 bg-white p-4 shadow-sm">
            <div className="text-base font-extrabold text-slate-900">
                Add program
            </div>
            <form onSubmit={submit} className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category
                    </div>
                    <select
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                    >
                        {categoryOptions
                            .filter((x) => x !== '')
                            .map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Title
                    </div>
                    <input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                        placeholder="Program name"
                    />
                </div>
                <div className="md:col-span-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Description
                    </div>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                        placeholder="Details"
                    />
                </div>
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Schedule
                    </div>
                    <input
                        value={data.schedule}
                        onChange={(e) => setData('schedule', e.target.value)}
                        className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                        placeholder="e.g., Every Monday 8AM"
                    />
                </div>
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Location
                    </div>
                    <div className="mt-2 flex gap-2">
                        <input
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                            placeholder="Where it happens"
                        />
                        <button
                            type="button"
                            onClick={fillCurrentLocation}
                            className="whitespace-nowrap rounded-md border border-slate-300 px-3 py-2 text-sm font-extrabold text-slate-800 hover:bg-slate-50"
                        >
                            Use my location
                        </button>
                    </div>
                </div>
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Contact
                    </div>
                    <input
                        value={data.contact}
                        onChange={(e) => setData('contact', e.target.value)}
                        className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                        placeholder="Phone or office"
                    />
                </div>
                <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <input
                            type="checkbox"
                            checked={!!data.is_published}
                            onChange={(e) =>
                                setData('is_published', e.target.checked)
                            }
                        />
                        Published
                    </label>
                </div>
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-800 disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

function ProgramRow({ row, categoryOptions }) {
    const [open, setOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

    const { data, setData, patch, delete: destroy, processing } = useForm({
        category: row.category,
        title: row.title,
        description: row.description || '',
        schedule: row.schedule || '',
        location: row.location || '',
        contact: row.contact || '',
        is_published: !!row.is_published,
    });

    function fillCurrentLocation() {
        if (!navigator?.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos?.coords?.latitude;
                const lng = pos?.coords?.longitude;
                if (typeof lat === 'number' && typeof lng === 'number') {
                    setData('location', `${lat},${lng}`);
                }
            },
            () => alert('Unable to get current location. Please allow location permission.'),
            { enableHighAccuracy: true, timeout: 15000 },
        );
    }

    function submit(e) {
        e.preventDefault();
        setConfirmSaveOpen(true);
    }

    function confirmSave() {
        patch(route('admin.programs.update', row.id), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmSaveOpen(false);
                setOpen(false);
            },
            onFinish: () => setConfirmSaveOpen(false),
        });
    }

    function onDelete() {
        setConfirmDeleteOpen(true);
    }

    function confirmDelete() {
        destroy(route('admin.programs.destroy', row.id), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmDeleteOpen(false);
                setOpen(false);
            },
            onFinish: () => setConfirmDeleteOpen(false),
        });
    }

    return (
        <>
            <ConfirmModal
                show={confirmDeleteOpen}
                title="Delete program"
                message="This action cannot be undone."
                destructive
                confirmText="Delete"
                processing={processing}
                onCancel={() => setConfirmDeleteOpen(false)}
                onConfirm={confirmDelete}
            />

            <ConfirmModal
                show={confirmSaveOpen}
                title="Save changes"
                message="Save updates to this program?"
                confirmText="Save"
                processing={processing}
                onCancel={() => setConfirmSaveOpen(false)}
                onConfirm={confirmSave}
            />
            <tr>
                <td className="px-4 py-3 text-sm font-extrabold text-slate-900">
                    {row.category}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="font-extrabold text-slate-900">{row.title}</div>
                    {row.description ? (
                        <div className="mt-1 text-xs font-semibold text-slate-500">
                            {row.description}
                        </div>
                    ) : null}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                    <div>{row.schedule || '-'}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">
                        {row.location || '-'}
                    </div>
                </td>
                <td className="px-4 py-3 text-sm">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-extrabold text-slate-700">
                        {row.is_published ? 'YES' : 'NO'}
                    </span>
                </td>
                <td className="px-4 py-3 text-sm">
                    <button
                        type="button"
                        className="rounded border border-slate-300 px-3 py-1 font-extrabold text-slate-800"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? 'Close' : 'Edit'}
                    </button>
                </td>
            </tr>
            {open ? (
                <tr>
                    <td colSpan={5} className="bg-gray-50 px-4 py-4">
                        <form
                            onSubmit={submit}
                            className="grid gap-3 md:grid-cols-2"
                        >
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Category
                                </div>
                                <select
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {categoryOptions.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Title
                                </div>
                                <input
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Description
                                </div>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Schedule
                                </div>
                                <input
                                    value={data.schedule}
                                    onChange={(e) =>
                                        setData('schedule', e.target.value)
                                    }
                                    className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Location
                                </div>
                                <div className="mt-2 flex gap-2">
                                    <input
                                        value={data.location}
                                        onChange={(e) =>
                                            setData(
                                                'location',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={fillCurrentLocation}
                                        className="whitespace-nowrap rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                                    >
                                        Use my location
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Contact
                                </div>
                                <input
                                    value={data.contact}
                                    onChange={(e) =>
                                        setData('contact', e.target.value)
                                    }
                                    className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={!!data.is_published}
                                        onChange={(e) =>
                                            setData(
                                                'is_published',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    Published
                                </label>
                            </div>
                            <div className="md:col-span-2 flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={onDelete}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </form>
                    </td>
                </tr>
            ) : null}
        </>
    );
}
