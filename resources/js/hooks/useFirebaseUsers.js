import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export function useFirebaseUsersFilter(filters) {
    const [q, setQ] = useState(filters?.q ?? '');

    useEffect(() => {
        setQ(filters?.q ?? '');
    }, [filters?.q]);

    function submit(e) {
        e.preventDefault();
        router.get(
            route('admin.firebase-users.index'),
            { q },
            { preserveState: true, replace: true }
        );
    }

    return { q, setQ, submit };
}
