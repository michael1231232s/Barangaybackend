import ApplicationLogo from '@/Components/ApplicationLogo';
import ConfirmModal from '@/Components/ConfirmModal';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

    function SidebarLink({ href, active, icon, children }) {
        return (
            <Link
                href={href}
                className={
                    'flex w-full items-center rounded-md px-3 py-2 text-sm font-extrabold transition ' +
                    (active
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900')
                }
            >
                {icon ? <span className="me-2 inline-flex h-5 w-5 items-center justify-center">{icon}</span> : null}
                {children}
            </Link>
        );
    }

    const icons = {
        dashboard: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-16v5h7V4h-7Z"
                    fill="currentColor"
                />
            </svg>
        ),
        certificates: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7 3h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path d="M8 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                    d="M12 17l1.2 1.3 1.8-.7-.6 1.9 1.2 1.2-1.9.2L12 23l-1.7-1.1-1.9-.2 1.2-1.2-.6-1.9 1.8.7L12 17Z"
                    fill="currentColor"
                />
            </svg>
        ),
        programs: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    fill="currentColor"
                />
            </svg>
        ),
        permit: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        complaints: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4 4h16v12H7l-3 3V4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path d="M8 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        residents: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    fill="currentColor"
                />
                <path
                    d="M22 21v-2a3 3 0 0 0-2-2.83"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M17 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
        profile: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    fill="currentColor"
                />
            </svg>
        ),
        logout: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 17l-1 0a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M15 7l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M20 12H10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <ConfirmModal
                show={confirmLogoutOpen}
                title="Log out"
                message="Are you sure you want to log out?"
                confirmText="Log out"
                destructive
                onCancel={() => setConfirmLogoutOpen(false)}
                onConfirm={() => {
                    setConfirmLogoutOpen(false);
                    router.post(route('logout'));
                }}
            />

            <div className="border-b border-blue-900/10 bg-white md:hidden">
                <div className="flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-3">
                        <ApplicationLogo className="h-10 w-10 shrink-0" />
                        <div className="text-sm font-extrabold text-slate-900">
                            Barangay Portal
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-extrabold leading-4 text-slate-700 transition duration-150 ease-in-out hover:text-slate-900 focus:outline-none"
                                        >
                                            {user.name}

                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <button
                                        type="button"
                                        className="block w-full px-4 py-2 text-left text-sm font-extrabold text-slate-700 hover:bg-slate-50"
                                        onClick={() => setConfirmLogoutOpen(true)}
                                    >
                                        Log Out
                                    </button>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    (previousState) => !previousState,
                                )
                            }
                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 transition duration-150 ease-in-out hover:bg-slate-100 hover:text-slate-700 focus:bg-slate-100 focus:text-slate-700 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? 'inline-flex'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? 'inline-flex'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' border-t border-slate-200'
                    }
                >
                    <div className="space-y-1 p-3">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            <span className="me-2 inline-flex h-5 w-5 items-center justify-center">{icons.dashboard}</span>
                            Dashboard
                        </ResponsiveNavLink>

                        {user.role === 'admin' || user.role === 'staff' ? (
                            <>
                                <ResponsiveNavLink
                                    href={route('admin.certificates.index')}
                                    active={route().current('admin.certificates.*')}
                                >
                                    <span className="me-2 inline-flex h-5 w-5 items-center justify-center">{icons.certificates}</span>
                                    Certificates
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.programs.index')}
                                    active={route().current('admin.programs.*')}
                                >
                                    <span className="me-2 inline-flex h-5 w-5 items-center justify-center">{icons.programs}</span>
                                    Programs
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.permit-assistance.index')}
                                    active={route().current('admin.permit-assistance.*')}
                                >
                                    <span className="me-2 inline-flex h-5 w-5 items-center justify-center">{icons.permit}</span>
                                    Permit Assistance
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.complaints.index')}
                                    active={route().current('admin.complaints.*')}
                                >
                                    <span className="me-2 inline-flex h-5 w-5 items-center justify-center">{icons.complaints}</span>
                                    Complaints
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.residents.index')}
                                    active={route().current('admin.residents.*')}
                                >
                                    <span className="me-2 inline-flex h-5 w-5 items-center justify-center">{icons.residents}</span>
                                    Residents
                                </ResponsiveNavLink>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>

            <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-blue-900/10 bg-white md:flex md:flex-col">
                <div className="flex items-center gap-3 border-b border-blue-900/10 px-4 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <ApplicationLogo className="h-10 w-10 shrink-0" />
                        <div>
                            <div className="text-sm font-extrabold text-slate-900">
                                Barangay Portal
                            </div>
                            <div className="text-xs font-semibold text-slate-600">
                                Staff
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-1">
                        <SidebarLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            icon={icons.dashboard}
                        >
                            Dashboard
                        </SidebarLink>

                        {user.role === 'admin' || user.role === 'staff' ? (
                            <>
                                <SidebarLink
                                    href={route('admin.certificates.index')}
                                    active={route().current('admin.certificates.*')}
                                    icon={icons.certificates}
                                >
                                    Certificates
                                </SidebarLink>
                                <SidebarLink
                                    href={route('admin.programs.index')}
                                    active={route().current('admin.programs.*')}
                                    icon={icons.programs}
                                >
                                    Programs
                                </SidebarLink>
                                <SidebarLink
                                    href={route('admin.permit-assistance.index')}
                                    active={route().current('admin.permit-assistance.*')}
                                    icon={icons.permit}
                                >
                                    Permit Assistance
                                </SidebarLink>
                                <SidebarLink
                                    href={route('admin.complaints.index')}
                                    active={route().current('admin.complaints.*')}
                                    icon={icons.complaints}
                                >
                                    Complaints
                                </SidebarLink>
                                <SidebarLink
                                    href={route('admin.residents.index')}
                                    active={route().current('admin.residents.*')}
                                    icon={icons.residents}
                                >
                                    Residents
                                </SidebarLink>
                            </>
                        ) : null}
                    </div>
                </div>

                <div className="border-t border-blue-900/10 px-4 py-4">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        Signed in
                    </div>
                    <div className="mt-2 text-sm font-extrabold text-slate-900">
                        {user.name}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                        {user.email}
                    </div>

                    <div className="mt-3 space-y-1">
                        <SidebarLink
                            href={route('profile.edit')}
                            active={route().current('profile.*')}
                            icon={icons.profile}
                        >
                            Profile
                        </SidebarLink>
                        <button
                            type="button"
                            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-extrabold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                            onClick={() => setConfirmLogoutOpen(true)}
                        >
                            <span className="me-2 inline-flex h-5 w-5 items-center justify-center">{icons.logout}</span>
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>

            <div className="md:ml-64">
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    {header && (
                        <div className="rounded-xl border border-blue-900/10 bg-white p-5 shadow-sm">
                            {header}
                        </div>
                    )}

                    <div className={header ? 'mt-6' : ''}>{children}</div>
                </div>
            </div>
        </div>
    );
}
