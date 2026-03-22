import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function StatCard({ label, value }) {
    return (
        <div className="overflow-hidden rounded-xl border border-blue-900/10 bg-white p-5 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
                {label}
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">
                {value}
            </div>
        </div>
    );
}

/** Horizontal bar chart — values scaled to the largest row */
function BarChartCard({ title, rows, barClass = 'bg-blue-600' }) {
    const list = rows || [];
    const max = Math.max(...list.map((r) => r.total), 1);

    return (
        <div className="overflow-hidden rounded-xl border border-blue-900/10 bg-white shadow-sm">
            <div className="p-6">
                <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
                {list.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-600">No data.</p>
                ) : (
                    <div className="mt-4 space-y-3">
                        {list.map((r) => (
                            <div key={r.key}>
                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                    <span className="truncate pr-2">{r.key}</span>
                                    <span>{r.total}</span>
                                </div>
                                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${barClass}`}
                                        style={{
                                            width:
                                                r.total <= 0
                                                    ? '0%'
                                                    : `${Math.max(
                                                          4,
                                                          (r.total / max) * 100,
                                                      )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/** Last 7 days service requests as vertical bars */
function DailyRequestsChart({ rows }) {
    const list = rows || [];
    const max = Math.max(...list.map((r) => r.total), 1);

    return (
        <div className="overflow-hidden rounded-xl border border-blue-900/10 bg-white shadow-sm">
            <div className="p-6">
                <h3 className="text-sm font-extrabold text-slate-900">
                    Service requests (last 7 days)
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                    Volume by day
                </p>
                <div className="mt-6 flex h-40 items-end justify-between gap-1 sm:gap-2">
                    {list.map((r) => {
                        const h = max > 0 ? (r.total / max) * 100 : 0;
                        const label = r.day?.slice(5) || r.day;
                        return (
                            <div
                                key={r.day}
                                className="flex min-w-0 flex-1 flex-col items-center justify-end"
                            >
                                <div
                                    className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-blue-700 to-blue-500 transition-all"
                                    style={{
                                        height: `${Math.max(r.total ? 8 : 0, h)}%`,
                                        minHeight: r.total ? '0.5rem' : 0,
                                    }}
                                    title={`${r.day}: ${r.total}`}
                                />
                                <div className="mt-2 text-center text-[10px] font-extrabold text-slate-600 sm:text-xs">
                                    {label}
                                </div>
                                <div className="text-[11px] font-black text-slate-900">
                                    {r.total}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function toRows(obj) {
    return Object.entries(obj || {}).map(([key, total]) => ({ key, total }));
}

export default function Dashboard({ stats }) {
    const requestsByStatus = toRows(stats.requestsByStatus);
    const requestsByType = toRows(stats.requestsByType);
    const complaintsByStatus = toRows(stats.complaintsByStatus);
    const certificatesByStatus = toRows(stats.certificatesByStatus);
    const permitsByStatus = toRows(stats.permitsByStatus);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Staff Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Registered residents" value={stats.totalResidents} />
                        <StatCard label="Service requests" value={stats.totalRequests} />
                        <StatCard label="Complaints" value={stats.totalComplaints} />
                        <StatCard label="Certificates" value={stats.totalCertificates} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Permit assistance" value={stats.totalPermits} />
                        <StatCard label="Programs (published)" value={stats.programsPublished} />
                        <StatCard label="Programs (hidden)" value={stats.programsHidden} />
                        <StatCard
                            label="Pending requests"
                            value={stats.requestsByStatus?.pending ?? 0}
                        />
                    </div>

                    <div className="rounded-xl border border-blue-900/10 bg-white p-4 shadow-sm">
                        <div className="text-sm font-extrabold text-slate-900">
                            Quick links
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Link
                                href={route('admin.programs.index')}
                                className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
                            >
                                Programs
                            </Link>
                            <Link
                                href={route('admin.complaints.index')}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
                            >
                                Complaints
                            </Link>
                            <Link
                                href={route('admin.certificates.index')}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
                            >
                                Certificates
                            </Link>
                            <Link
                                href={route('admin.permit-assistance.index')}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
                            >
                                Permit assistance
                            </Link>
                            <Link
                                href={route('admin.residents.index')}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
                            >
                                Residents
                            </Link>
                        </div>
                    </div>

                    <DailyRequestsChart rows={stats.dailyRequests || []} />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <BarChartCard
                            title="Service requests by type"
                            rows={requestsByType}
                            barClass="bg-indigo-600"
                        />
                        <BarChartCard
                            title="Service requests by status"
                            rows={requestsByStatus}
                            barClass="bg-emerald-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <BarChartCard
                            title="Complaints by status"
                            rows={complaintsByStatus}
                            barClass="bg-amber-500"
                        />
                        <BarChartCard
                            title="Certificates by status"
                            rows={certificatesByStatus}
                            barClass="bg-violet-600"
                        />
                        <BarChartCard
                            title="Permit requests by status"
                            rows={permitsByStatus}
                            barClass="bg-cyan-600"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
