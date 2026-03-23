import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export function useIndexFilters(filters, routeName) {
    const [q, setQ] = useState(filters?.q || '');
    const [status, setStatus] = useState(filters?.status || '');

    useEffect(() => {
        setQ(filters?.q || '');
        setStatus(filters?.status || '');
    }, [filters?.q, filters?.status]);

    function onSubmit(e) {
        e?.preventDefault?.();
        router.get(
            route(routeName),
            { q, status },
            { preserveState: true, replace: true }
        );
    }

    return { q, setQ, status, setStatus, onSubmit };
}
