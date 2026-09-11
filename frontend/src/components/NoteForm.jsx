import { useEffect, useState } from 'react';

const NoteForm = ({ note, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = Boolean(note);

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setContent(note.content || '');
        } else {
            setTitle('');
            setContent('');
        }

        setError('');
    }, [note]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');

        if (!title.trim()) {
            setError('Please enter a title.');
            return;
        }

        if (!content.trim()) {
            setError('Please enter some content.');
            return;
        }

        setLoading(true);

        try {
            await onSubmit({
                title: title.trim(),
                content: content.trim(),
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Unable to save the note.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                {/* Title */}
                <div>
                    <label
                        htmlFor="note-title"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                        Title
                    </label>

                    <input
                        id="note-title"
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="e.g. Project ideas"
                        maxLength={255}
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <div className="mt-2 flex justify-between">
                        <p className="text-xs text-slate-400">
                            Give your note a short, meaningful title.
                        </p>

                        <span className="text-xs text-slate-400">
                            {title.length}/255
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label
                        htmlFor="note-content"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                        Content
                    </label>

                    <textarea
                        id="note-content"
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        placeholder="Write your thoughts, ideas, meeting notes, reminders..."
                        rows={7}
                        disabled={loading}
                        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                        Your content can later be summarized using your
                        configured AI provider.
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <span className="mt-0.5 font-bold text-red-500">
                        !
                    </span>

                    <p className="text-sm font-medium leading-5 text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            {isEditing
                                ? 'Updating...'
                                : 'Creating...'}
                        </>
                    ) : (
                        <>
                            <span>
                                {isEditing ? '✓' : '+'}
                            </span>

                            {isEditing
                                ? 'Update note'
                                : 'Create note'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default NoteForm;
