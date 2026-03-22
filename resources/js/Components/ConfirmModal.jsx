import Modal from '@/Components/Modal';

export default function ConfirmModal({
    show,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    destructive = false,
    processing = false,
    onConfirm,
    onCancel,
}) {
    return (
        <Modal show={show} onClose={onCancel} closeable={!processing} maxWidth="md">
            <div className="p-6">
                <div className="text-lg font-extrabold text-slate-900">
                    {title}
                </div>
                {message ? (
                    <div className="mt-2 text-sm font-semibold text-slate-700">
                        {message}
                    </div>
                ) : null}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-800 disabled:opacity-50"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={
                            (destructive
                                ? 'bg-red-700 hover:bg-red-800'
                                : 'bg-blue-700 hover:bg-blue-800') +
                            ' rounded-md px-4 py-2 text-sm font-extrabold text-white disabled:opacity-50'
                        }
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
