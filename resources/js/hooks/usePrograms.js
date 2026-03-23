import { useState, useEffect, useMemo } from 'react';
import { router, useForm } from '@inertiajs/react';

export function useProgramsFilter(filters, categories, defaultCategories) {
    const [q, setQ] = useState(filters?.q || '');
    const [category, setCategory] = useState(filters?.category || '');
    const [published, setPublished] = useState(filters?.published || '');

    useEffect(() => {
        setQ(filters?.q || '');
        setCategory(filters?.category || '');
        setPublished(filters?.published || '');
    }, [filters?.q, filters?.category, filters?.published]);

    const categoryOptions = useMemo(() => {
        const dynamic = Array.isArray(categories) ? categories : [];
        const set = new Set([...defaultCategories, ...dynamic].filter(Boolean));
        return ['', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
    }, [categories, defaultCategories]);

    function onSubmit(e) {
        e.preventDefault();
        router.get(
            route('admin.programs.index'),
            { q, category, published },
            { preserveState: true, replace: true }
        );
    }

    return { q, setQ, category, setCategory, published, setPublished, categoryOptions, onSubmit };
}

export function useCreateProgram(categoryOptions) {
    const { data, setData, post, processing, reset } = useForm({
        category: categoryOptions.find((x) => x !== '') || 'Health',
        title: '',
        description: '',
        schedule: '',
        location: '',
        contact: '',
        is_published: true,
    });

    function fillCurrentLocation() {
        if (!navigator?.geolocation) return alert('Geolocation is not supported.');
        navigator.geolocation.getCurrentPosition(
            (pos) => setData('location', `${pos?.coords?.latitude},${pos?.coords?.longitude}`),
            () => alert('Unable to get current location.'),
            { enableHighAccuracy: true, timeout: 15000 }
        );
    }

    function submit(e) {
        e.preventDefault();
        post(route('admin.programs.store'), {
            preserveScroll: true,
            onSuccess: () => reset('title', 'description', 'schedule', 'location', 'contact'),
        });
    }

    return { data, setData, processing, fillCurrentLocation, submit };
}

export function useProgramRow(row) {
    const [open, setOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

    const { data, setData, patch, delete: destroy, processing } = useForm({
        category: row.category,
        title: row.title,
        description: row.description || '',
        schedule: row.schedule || '',
        location: row.location || '',
        contact: row.contact || '',
        is_published: !!row.is_published,
    });

    function fillCurrentLocation() {
        if (!navigator?.geolocation) return alert('Geolocation is not supported.');
        navigator.geolocation.getCurrentPosition(
            (pos) => setData('location', `${pos?.coords?.latitude},${pos?.coords?.longitude}`),
            () => alert('Unable to get current location.'),
            { enableHighAccuracy: true, timeout: 15000 }
        );
    }

    function submit(e) { e.preventDefault(); setConfirmSaveOpen(true); }
    function confirmSave() {
        patch(route('admin.programs.update', row.id), {
            preserveScroll: true,
            onSuccess: () => { setConfirmSaveOpen(false); setOpen(false); },
            onFinish: () => setConfirmSaveOpen(false),
        });
    }
    function onDelete() { setConfirmDeleteOpen(true); }
    function confirmDelete() {
        destroy(route('admin.programs.destroy', row.id), {
            preserveScroll: true,
            onSuccess: () => { setConfirmDeleteOpen(false); setOpen(false); },
            onFinish: () => setConfirmDeleteOpen(false),
        });
    }

    return {
        open, setOpen,
        confirmDeleteOpen, setConfirmDeleteOpen,
        confirmSaveOpen, setConfirmSaveOpen,
        data, setData, processing,
        fillCurrentLocation, submit, confirmSave, onDelete, confirmDelete
    };
}
