import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export function useUpdateRowForm(rowId, updateRoute, initialData) {
    const [open, setOpen] = useState(false);
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

    const { data, setData, patch, processing } = useForm(initialData);

    function submit(e) {
        e?.preventDefault?.();
        setConfirmSaveOpen(true);
    }

    function confirmSave() {
        patch(route(updateRoute, rowId), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmSaveOpen(false);
                setOpen(false);
            },
            onFinish: () => setConfirmSaveOpen(false),
        });
    }

    return {
        open,
        setOpen,
        confirmSaveOpen,
        setConfirmSaveOpen,
        data,
        setData,
        processing,
        submit,
        confirmSave,
    };
}
