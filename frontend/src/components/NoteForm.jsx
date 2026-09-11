import { useEffect, useState } from 'react';

import { validateNote } from '../utils/validation';

const NoteForm = ({ note, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const isEditing = Boolean(note);

    useEffect(() => {
        setTitle(note?.title || '');
        setContent(note?.content || '');
        setErrors({});
        setServerError('');
    }, [note]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrors({});
        setServerError('');

        const validationErrors = validateNote({
            title,
            content,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            await onSubmit({
                title: title.trim(),
                content: content.trim(),
            });
        } catch (error) {
            const validationErrors =
                error.response?.data?.errors;

            const firstValidationError =
                validationErrors
                    ? Object.values(validationErrors).flat()[0]
                    : null;

            setServerError(
                firstValidationError ||
                    error.response?.data?.message ||
                    'Unable to save note.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-5">
                <div>
                    <label
                        htmlFor="note-title"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Title
                    </label>

                    <input
                        id="note-title"
                        type="text"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);

                            if (errors.title) {
                                setErrors((current) => ({
                                    ...current,
                                    title: '',
                                }));
                            }
                        }}
                        placeholder="Note title"
                        maxLength={255}
                        disabled={loading}
                        className={[
                            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition',
                            'focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50',
                            errors.title
                                ? 'border-red-300 focus:border-red-400'
                                : 'border-slate-300 focus:border-slate-500',
                        ].join(' ')}
                    />

                    {errors.title && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="note-content"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Content
                    </label>

                    <textarea
                        id="note-content"
                        value={content}
                        onChange={(event) => {
                            setContent(event.target.value);

                            if (errors.content) {
                                setErrors((current) => ({
                                    ...current,
                                    content: '',
                                }));
                            }
                        }}
                        placeholder="Write your note..."
                        rows={8}
                        disabled={loading}
                        className={[
                            'w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition',
                            'focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50',
                            errors.content
                                ? 'border-red-300 focus:border-red-400'
                                : 'border-slate-300 focus:border-slate-500',
                        ].join(' ')}
                    />

                    {errors.content && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.content}
                        </p>
                    )}
                </div>

                {serverError && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                        {serverError}
                    </p>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? isEditing
                                ? 'Updating...'
                                : 'Creating...'
                            : isEditing
                              ? 'Update note'
                              : 'Create note'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default NoteForm;