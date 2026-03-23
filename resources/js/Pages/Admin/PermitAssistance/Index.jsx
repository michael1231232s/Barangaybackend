import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import RefreshListButton from '@/Components/RefreshListButton';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { useIndexFilters } from '@/hooks/useIndexFilters';
import { useUpdateRowForm } from '@/hooks/useUpdateRowForm';

const STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
];

function statusBadgeClass(status) {
    const base =
        'rounded-full px-2 py-1 text-xs font-extrabold inline-flex items-center';

    switch (status) {
        case 'pending':
            return base + ' bg-amber-100 text-amber-800';
        case 'processing':
            return base + ' bg-blue-100 text-blue-800';
        case 'scheduled':
            return base + ' bg-indigo-100 text-indigo-800';
        case 'resolved':
            return base + ' bg-emerald-100 text-emerald-800';
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

    const { q, setQ, status, setStatus, onSubmit } = useIndexFilters(filters, 'admin.permit-assistance.index');
    const items = useMemo(() => rows?.data || [], [rows]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-extrabold leading-tight text-slate-900">
                        Permit Assistance
                    </h2>
                    <RefreshListButton title="Refresh permit assistance" />
                </div>
            }
        >
            <Head title="Permit Assistance" />

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
                            label="Resolved"
                            value={stats?.byStatus?.resolved ?? 0}
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
                                placeholder="Search tracking, permit type, business, location, resident"
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
                                            Permit
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
                                                colSpan={6}
                                            >
                                                No permit assistance requests found.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((r) => (
                                            <PermitRow key={r.id} row={r} />
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

function PermitRow({ row }) {
    const canUpdate = !['cancelled', 'resolved', 'rejected'].includes(row.status);

    const {
        open, setOpen, confirmSaveOpen, setConfirmSaveOpen,
        data, setData, processing, submit, confirmSave
    } = useUpdateRowForm(row.id, 'admin.permit-assistance.update', {
        status: row.status,
        admin_notes: row.admin_notes || '',
        scheduled_at: row.scheduled_at || '',
    });

    return (
        <>
            <ConfirmModal
                show={confirmSaveOpen}
                title="Save changes"
                message="Save updates to this request?"
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
                        {row.permit_type}
                    </div>
                    {row.business_name ? (
                        <div className="mt-1 text-xs font-semibold text-slate-500">
                            Business: {row.business_name}
                        </div>
                    ) : null}
                    {row.location ? (
                        <div className="mt-1 text-xs font-semibold text-slate-500">
                            Location: {row.location}
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
                    <td colSpan={6} className="bg-slate-50 px-4 py-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded border bg-white p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Details
                                </div>
                                <div className="mt-2 whitespace-pre-wrap text-sm text-gray-800">
                                    {row.details || '-'}
                                </div>
                                {row.notes ? (
                                    <div className="mt-3">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Resident notes
                                        </div>
                                        <div className="mt-2 whitespace-pre-wrap text-sm text-gray-800">
                                            {row.notes}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            {canUpdate ? (
                                <div className="rounded border bg-white p-3">
                                    <form onSubmit={submit} className="flex flex-col gap-3">
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Status
                                            </div>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="scheduled">Scheduled</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Schedule (optional)
                                            </div>
                                            <input
                                                value={data.scheduled_at || ''}
                                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                                className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                                placeholder="YYYY-MM-DD HH:MM"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Admin notes
                                            </div>
                                            <textarea
                                                value={data.admin_notes}
                                                onChange={(e) => setData('admin_notes', e.target.value)}
                                                rows={4}
                                                className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                                placeholder="Requirements, fees, next steps"
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
