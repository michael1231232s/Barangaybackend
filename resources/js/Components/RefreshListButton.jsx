import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function RefreshListButton({ title = 'Refresh' }) {
    const [busy, setBusy] = useState(false);

    function onClick() {
        setBusy(true);
        router.reload({
            preserveScroll: true,
            onFinish: () => setBusy(false),
        });
    }

    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            disabled={busy}
            onClick={onClick}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={busy ? 'h-5 w-5 animate-spin' : 'h-5 w-5'}
            >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
            </svg>
        </button>
    );
}
