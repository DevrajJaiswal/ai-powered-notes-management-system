import { useState } from 'react';

const NoteCard = ({
    note,
    onEdit,
    onDelete,
    onGenerateSummary,
}) => {
    const [summary, setSummary] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    const handleGenerateSummary = async () => {
        setLoadingSummary(true);
        setSummaryError('');

        try {
            const data = await onGenerateSummary(note.id);
            setSummary(data.summary);
        } catch (error) {
            setSummaryError(
                error.response?.data?.message ||
                    'Unable to generate summary.'
            );
        } finally {
            setLoadingSummary(false);
        }
    };

    const formattedDate = note.created_at
        ? new Date(note.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : '';

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
            {/* Card header */}
            <div className="border-b border-slate-100 px-6 pb-5 pt-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-slate-900" />

                            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Note
                            </span>
                        </div>

                        <h3 className="break-words text-xl font-bold leading-tight tracking-tight text-slate-950">
                            {note.title}
                        </h3>
                    </div>

                    <div className="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-400">
                        #{note.id}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-5">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                    {note.content}
                </p>
            </div>

            {/* AI Summary */}
            {summaryError && (
                <div className="mx-6 mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-red-500">!</span>

                        <p className="text-xs font-medium leading-5 text-red-700">
                            {summaryError}
                        </p>
                    </div>
                </div>
            )}

            {summary && (
                <div className="mx-6 mb-5 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/60">
                    <div className="flex items-center gap-2 border-b border-violet-100 px-4 py-3">
                        <span className="grid size-7 place-items-center rounded-lg bg-white text-sm shadow-sm">
                            ✨
                        </span>

                        <span className="text-xs font-bold uppercase tracking-[0.12em] text-violet-700">
                            AI Summary
                        </span>
                    </div>

                    <div className="px-4 py-4">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {summary}
                        </p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-4">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        {formattedDate}
                    </span>

                    {summary && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600">
                            <span className="size-1.5 rounded-full bg-violet-500" />
                            AI generated
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(note)}
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(note.id)}
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        Delete
                    </button>

                    <button
                        type="button"
                        onClick={handleGenerateSummary}
                        disabled={loadingSummary}
                        className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loadingSummary ? (
                            <>
                                <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                {summary
                                    ? 'Regenerate'
                                    : 'AI Summary'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default NoteCard;
