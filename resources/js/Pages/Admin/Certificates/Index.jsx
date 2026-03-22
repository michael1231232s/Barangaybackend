import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import RefreshListButton from '@/Components/RefreshListButton';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'released', label: 'Released' },
];

function statusBadgeClass(status) {
    const base =
        'rounded-full px-2 py-1 text-xs font-extrabold inline-flex items-center';

    switch (status) {
        case 'pending':
            return base + ' bg-amber-100 text-amber-800';
        case 'processing':
            return base + ' bg-blue-100 text-blue-800';
        case 'approved':
            return base + ' bg-emerald-100 text-emerald-800';
        case 'released':
            return base + ' bg-slate-200 text-slate-800';
        case 'rejected':
            return base + ' bg-red-100 text-red-800';
        case 'cancelled':
            return base + ' bg-slate-100 text-slate-700';
        default:
            return base + ' bg-slate-100 text-slate-700';
    }
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-xl border border-blue-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                {label}
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">
                {value}
            </div>
        </div>
    );
}

export default function Index() {
    const { rows, filters, stats } = usePage().props;

    const [q, setQ] = useState(filters?.q || '');
    const [status, setStatus] = useState(filters?.status || '');

    useEffect(() => {
        setQ(filters?.q || '');
        setStatus(filters?.status || '');
    }, [filters?.q, filters?.status]);

    const items = useMemo(() => rows?.data || [], [rows]);

    function onSubmit(e) {
        e.preventDefault();
        router.get(
            route('admin.certificates.index'),
            { q, status },
            { preserveState: true, replace: true },
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-extrabold leading-tight text-slate-900">
                        Certificates
                    </h2>
                    <RefreshListButton title="Refresh certificates" />
                </div>
            }
        >
            <Head title="Certificates" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total" value={stats?.total ?? 0} />
                        <StatCard
                            label="Pending"
                            value={stats?.byStatus?.pending ?? 0}
                        />
                        <StatCard
                            label="Processing"
                            value={stats?.byStatus?.processing ?? 0}
                        />
                        <StatCard
                            label="Released"
                            value={stats?.byStatus?.released ?? 0}
                        />
                    </div>

                    <div className="mb-4 rounded-xl border border-blue-900/10 bg-white p-4 shadow-sm">
                        <form
                            onSubmit={onSubmit}
                            className="flex flex-col gap-3 md:flex-row md:items-center"
                        >
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                placeholder="Search tracking, resident, type, purpose"
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 md:w-56"
                            >
                                {STATUS_OPTIONS.map((opt) => (
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
                                            Tracking
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Resident
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Delivery
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Submitted
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
                                                colSpan={7}
                                            >
                                                No certificate requests found.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((c) => (
                                            <CertificateRow
                                                key={c.id}
                                                row={c}
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

function CertificateRow({ row }) {
    const [open, setOpen] = useState(false);
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

    const canUpdate = !['cancelled', 'approved', 'released', 'rejected'].includes(row.status);

    const { data, setData, patch, processing } = useForm({
        status: row.status,
        admin_notes: row.admin_notes || '',
    });

    function submit(e) {
        e.preventDefault();
        setConfirmSaveOpen(true);
    }

    function confirmSave() {
        patch(route('admin.certificates.update', row.id), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmSaveOpen(false);
                setOpen(false);
            },
            onFinish: () => setConfirmSaveOpen(false),
        });
    }

    return (
        <>
            <ConfirmModal
                show={confirmSaveOpen}
                title="Save changes"
                message="Save updates to this certificate request?"
                confirmText="Save"
                processing={processing}
                onCancel={() => setConfirmSaveOpen(false)}
                onConfirm={confirmSave}
            />
            <tr>
                <td className="px-4 py-3 text-sm font-extrabold text-slate-900">
                    {row.tracking_number}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="font-extrabold text-slate-900">
                        {row.user?.name || 'Resident'}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                        {row.user?.email || ''}
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="font-extrabold text-slate-900">
                        {row.type}
                    </div>
                    {row.purpose ? (
                        <div className="mt-1 text-xs font-semibold text-slate-500">
                            Purpose: {row.purpose}
                        </div>
                    ) : null}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                    {row.delivery_method}
                    {row.preferred_date ? (
                        <div className="mt-1 text-xs font-semibold text-slate-500">
                            Preferred:{' '}
                            {new Date(row.preferred_date).toLocaleString()}
                        </div>
                    ) : null}
                </td>
                <td className="px-4 py-3 text-sm">
                    <span className={statusBadgeClass(row.status)}>
                        {String(row.status || '').toUpperCase()}
                    </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                    {row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                    <button
                        type="button"
                        className="rounded border border-slate-300 px-3 py-1 font-extrabold text-slate-800"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? 'Close' : canUpdate ? 'Update' : 'View'}
                    </button>
                </td>
            </tr>
            {open ? (
                <tr>
                    <td colSpan={7} className="bg-slate-50 px-4 py-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded border bg-white p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Notes
                                </div>
                                <div className="mt-2 whitespace-pre-wrap text-sm text-gray-800">
                                    {row.notes || '-'}
                                </div>
                            </div>
                            {canUpdate ? (
                                <div className="rounded border bg-white p-3">
                                    <form
                                        onSubmit={submit}
                                        className="flex flex-col gap-3"
                                    >
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Status
                                            </div>
                                            <select
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        'status',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                            >
                                                <option value="pending">
                                                    Pending
                                                </option>
                                                <option value="processing">
                                                    Processing
                                                </option>
                                                <option value="approved">
                                                    Approved
                                                </option>
                                                <option value="rejected">
                                                    Rejected
                                                </option>
                                                <option value="cancelled">
                                                    Cancelled
                                                </option>
                                                <option value="released">
                                                    Released
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Admin notes
                                            </div>
                                            <textarea
                                                value={data.admin_notes}
                                                onChange={(e) =>
                                                    setData(
                                                        'admin_notes',
                                                        e.target.value,
                                                    )
                                                }
                                                rows={4}
                                                className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                                placeholder="Optional notes (fee, pickup schedule, requirements)"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-800 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                    </form>
                                </div>
                            ) : null}
                        </div>
                    </td>
                </tr>
            ) : null}
        </>
    );
}
