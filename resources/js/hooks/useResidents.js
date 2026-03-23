import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export function useResidentsFilter(filters) {
    const [q, setQ] = useState(filters?.q || '');

    useEffect(() => {
        setQ(filters?.q || '');
    }, [filters?.q]);

    function onSubmit(e) {
        e.preventDefault();
        router.get(
            route('admin.residents.index'),
            { q },
            { preserveState: true, replace: true }
        );
    }

    return { q, setQ, onSubmit };
}
