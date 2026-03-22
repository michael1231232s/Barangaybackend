import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RefreshListButton from '@/Components/RefreshListButton';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

function formatDateOnly(value) {
    if (!value) return '-';
    if (typeof value === 'string') {
        const s = value.trim();
        if (!s) return '-';
        const hit = s.match(/^\d{4}-\d{2}-\d{2}/);
        if (hit) return hit[0];
    }
    const d = new Date(value);
    if (!Number.isFinite(d.getTime())) return String(value);
    return d.toISOString().slice(0, 10);
}

export default function Index() {
    const { rows, filters } = usePage().props;

    const [q, setQ] = useState(filters?.q || '');

    useEffect(() => {
        setQ(filters?.q || '');
    }, [filters?.q]);

    const items = useMemo(() => rows?.data || [], [rows]);

    const [openId, setOpenId] = useState(null);

    function onSubmit(e) {
        e.preventDefault();
        router.get(
            route('admin.residents.index'),
            { 
                q 
            }, 
            { 
                preserveState: true, 
                replace: true 
            },
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Residents
                    </h2>
                    <RefreshListButton title="Refresh residents" />
                </div>
            }
        >
            <Head title="Residents" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 rounded-lg bg-white p-4 shadow">
                        <form onSubmit={onSubmit} className="flex gap-3">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Search name, email, phone, occupation, civil status, firebase uid"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Civil status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Occupation</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">View</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {items.length === 0 ? (
                                        <tr>
                                            <td className="px-4 py-4 text-sm text-gray-500" colSpan={6}>No residents found.</td>
                                        </tr>
                                    ) : (
                                        items.map((r) => (
                                            <ResidentRow
                                                key={r.id}
                                                row={r}
                                                open={openId === r.id}
                                                onToggle={() => setOpenId((v) => (v === r.id ? null : r.id))}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
                            <div>
                                Page {rows?.current_page || 1} of {rows?.last_page || 1}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="rounded border px-3 py-1 disabled:opacity-50"
                                    disabled={!rows?.prev_page_url}
                                    onClick={() => rows?.prev_page_url && router.get(rows.prev_page_url)}
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    className="rounded border px-3 py-1 disabled:opacity-50"
                                    disabled={!rows?.next_page_url}
                                    onClick={() => rows?.next_page_url && router.get(rows.next_page_url)}
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

function ResidentRow({ row, open, onToggle }) {
    return (
        <>
            <tr>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{row.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.phone_number || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.civil_status || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.occupation || '-'}</td>
                <td className="px-4 py-3 text-sm">
                    <button
                        type="button"
                        className="rounded border px-3 py-1 text-sm font-semibold text-gray-800"
                        onClick={onToggle}
                    >
                        {open ? 'Close' : 'View'}
                    </button>
                </td>
            </tr>
            {open ? (
                <tr>
                    <td colSpan={6} className="bg-gray-50 px-4 py-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded border bg-white p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Personal information</div>
                                <div className="mt-3 grid gap-2 text-sm text-gray-800">
                                    <div><span className="font-semibold">Last name:</span> {row.last_name || '-'}</div>
                                    <div><span className="font-semibold">First name:</span> {row.first_name || '-'}</div>
                                    <div><span className="font-semibold">Middle name:</span> {row.middle_name || '-'}</div>
                                    <div><span className="font-semibold">Birthdate:</span> {formatDateOnly(row.birthdate)}</div>
                                    <div><span className="font-semibold">Gender:</span> {row.gender || '-'}</div>
                                </div>
                            </div>
                            <div className="rounded border bg-white p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Address</div>
                                <div className="mt-3 grid gap-2 text-sm text-gray-800">
                                    <div><span className="font-semibold">Building No., Street:</span> {row.address_line || '-'}</div>
                                    <div><span className="font-semibold">Barangay:</span> {row.barangay || '-'}</div>
                                    <div><span className="font-semibold">City:</span> {row.city || '-'}</div>
                                    <div><span className="font-semibold">Province:</span> {row.province || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            ) : null}
        </>
    );
}
