import { useForm } from '@inertiajs/react';

export function useServiceRequestStatus(row) {
    const { data, setData, patch, processing } = useForm({
        status: row.status,
    });

    function submit(e) {
        e.preventDefault();
        patch(route('admin.service-requests.update', { serviceRequest: row.id }), {
            preserveScroll: true,
        });
    }

    return { data, setData, processing, submit };
}
