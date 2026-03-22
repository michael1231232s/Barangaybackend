import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const TYPES = [
    'Barangay Certificate',
    'Barangay Clearance',
    'Certificate of Residency',
    'Certificate of Indigency',
    'Business Permit',
];

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
        case 'rejected':
            return base + ' bg-red-100 text-red-800';
        case 'cancelled':
            return base + ' bg-gray-200 text-gray-800';
        default:
            return base + ' bg-gray-200 text-gray-800';
    }
}

export default function Index({ rows }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: TYPES[0],
        notes: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('service-requests.store'), {
            preserveScroll: true,
            onSuccess: () => reset('notes'),
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Service Requests
                </h2>
            }
        >
            <Head title="My Requests" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-base font-extrabold text-gray-900">
                                Create a request
                            </h3>

                            <form onSubmit={submit} className="mt-4 space-y-4">
                                <div>
                                    <label className="text-sm font-extrabold text-gray-700">
                                        Type
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) =>
                                            setData('type', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {TYPES.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type ? (
                                        <p className="mt-1 text-sm font-bold text-red-600">
                                            {errors.type}
                                        </p>
                                    ) : null}
                                </div>

                                <div>
                                    <label className="text-sm font-extrabold text-gray-700">
                                        Notes (optional)
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Add details to help processing"
                                    />
                                    {errors.notes ? (
                                        <p className="mt-1 text-sm font-bold text-red-600">
                                            {errors.notes}
                                        </p>
                                    ) : null}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-base font-extrabold text-gray-900">
                                Recent
                            </h3>

                            {rows.length === 0 ? (
                                <p className="mt-3 text-sm text-gray-600">
                                    No requests yet.
                                </p>
                            ) : (
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="text-xs font-extrabold uppercase text-gray-500">
                                            <tr>
                                                <th className="px-3 py-2">Type</th>
                                                <th className="px-3 py-2">Status</th>
                                                <th className="px-3 py-2">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {rows.map((r) => (
                                                <tr key={r.id}>
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
