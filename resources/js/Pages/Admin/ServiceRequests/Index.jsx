import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useServiceRequestStatus } from '@/hooks/useServiceRequests';

const STATUSES = ['pending', 'processing', 'approved', 'rejected', 'cancelled', 'completed'];

function statusBadge(status) {
    const base =
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold';

    switch (status) {
        case 'pending':
            return base + ' bg-amber-100 text-amber-800';
        case 'processing':
            return base + ' bg-blue-100 text-blue-800';
        case 'approved':
            return base + ' bg-emerald-100 text-emerald-800';
        case 'completed':
            return base + ' bg-slate-200 text-slate-800';
        case 'rejected':
            return base + ' bg-red-100 text-red-800';
        case 'cancelled':
            return base + ' bg-gray-200 text-gray-800';
        default:
            return base + ' bg-gray-200 text-gray-800';
    }
}

function StatusForm({ row }) {
    const { data, setData, processing, submit } = useServiceRequestStatus(row);

    return (
        <form onSubmit={submit} className="flex items-center gap-2">
            <select
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
                className="rounded-md border-slate-300 text-sm shadow-sm focus:border-blue-600 focus:ring-blue-600"
            >
                {STATUSES.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
            <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-blue-700 px-3 py-2 text-sm font-extrabold text-white hover:bg-blue-800 disabled:opacity-50"
            >
                Save
            </button>
        </form>
    );
}

export default function Index({ rows }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-extrabold leading-tight text-slate-900">
                    Admin: Service Requests
                </h2>
            }
        >
            <Head title="Admin Requests" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl border border-blue-900/10 bg-white shadow-sm">
                        <div className="p-6">
                            {rows.length === 0 ? (
                                <p className="text-sm text-gray-600">
                                    No requests.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="text-xs font-extrabold uppercase text-slate-600">
                                            <tr>
                                                <th className="px-3 py-2">Resident</th>
                                                <th className="px-3 py-2">Type</th>
                                                <th className="px-3 py-2">Status</th>
                                                <th className="px-3 py-2">Update</th>
                                                <th className="px-3 py-2">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {rows.map((r) => (
                                                <tr key={r.id}>
                                                    <td className="px-3 py-3 font-bold text-gray-900">
                                                        {r.user?.name || '-'}
                                                        <div className="mt-1 text-xs font-medium text-gray-600">
                                                            {r.user?.email || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3 font-bold text-gray-900">
                                                        {r.type}
                                                        {r.notes ? (
                                                            <div className="mt-1 text-xs font-medium text-gray-600">
                                                                {r.notes}
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <span
                                                            className={statusBadge(
                                                                r.status,
                                                            )}
                                                        >
                                                            {String(
                                                                r.status || '',
                                                            ).toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <StatusForm row={r} />
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-600">
                                                        {new Date(
                                                            r.created_at,
                                                        ).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
