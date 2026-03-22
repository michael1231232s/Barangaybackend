import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Barangay Portal" />
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
                    <div className="rounded-2xl border border-blue-900/10 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-white p-1 shadow-sm">
                                <img
                                    src="/images/barangaylogo.png"
                                    alt=""
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div>
                                <div className="text-lg font-extrabold text-slate-900">
                                    Barangay Portal
                                </div>
                                <div className="text-sm font-semibold text-slate-600">
                                    Admin and community services management
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-sm font-semibold text-slate-700">
                            Manage certificates, programs, permit assistance, complaints, and residents.
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-blue-700 px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-800"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-800"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-800 hover:bg-slate-50"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-sm font-extrabold text-slate-900">
                                    Citizen Services
                                </div>
                                <div className="mt-1 text-sm font-semibold text-slate-700">
                                    Track and process requests efficiently.
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-sm font-extrabold text-slate-900">
                                    Community Programs
                                </div>
                                <div className="mt-1 text-sm font-semibold text-slate-700">
                                    Create programs and keep residents informed.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
