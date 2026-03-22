import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function Pagination({ meta, links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {links.map((l) => (
                <Link
                    key={l.label}
                    href={l.url || ''}
                    preserveScroll
                    className={
                        'rounded-md border px-3 py-2 text-sm font-extrabold ' +
                        (l.active
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : l.url
                              ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                              : 'border-gray-100 bg-gray-100 text-gray-400')
                    }
                    dangerouslySetInnerHTML={{ __html: l.label }}
                />
            ))}
            <div className="ml-auto text-sm font-bold text-gray-600">
                {meta.from}-{meta.to} of {meta.total}
            </div>
        </div>
    );
}

export default function Index({ rows, filters }) {
    const [q, setQ] = useState(filters?.q ?? '');

    useEffect(() => {
        setQ(filters?.q ?? '');
    }, [filters?.q]);

    function submit(e) {
        e.preventDefault();
        router.get(
            route('admin.firebase-users.index'),
            { q },
            { preserveState: true, replace: true },
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Firebase Users
                </h2>
            }
        >
            <Head title="Firebase Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="flex gap-2">
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Search email, name, phone, uid"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-indigo-700"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {rows.data.length === 0 ? (
                                <p className="text-sm text-gray-600">
                                    No Firebase users found.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="text-xs font-extrabold uppercase text-gray-500">
                                            <tr>
                                                <th className="px-3 py-2">User</th>
                                                <th className="px-3 py-2">UID</th>
                                                <th className="px-3 py-2">Phone</th>
                                                <th className="px-3 py-2">Synced</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {rows.data.map((r) => (
                                                <tr key={r.id}>
                                                    <td className="px-3 py-3 font-bold text-gray-900">
                                                        <div className="mt-1 text-xs font-medium text-gray-600">
                                                            {r.email || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3 font-mono text-xs text-gray-700">
                                                        {r.firebase_uid}
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-700">
                                                        {r.phone_number || '-'}
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-600">
                                                        {r.synced_at
                                                            ? new Date(
                                                                  r.synced_at,
                                                              ).toLocaleString()
                                                            : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <Pagination meta={rows.meta} links={rows.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
