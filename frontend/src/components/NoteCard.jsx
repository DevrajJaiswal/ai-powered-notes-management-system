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
        <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <h2 className="min-w-0 break-words text-base font-semibold text-slate-900">
                    {note.title}
                </h2>

                <span className="shrink-0 text-xs text-slate-400">
                    #{note.id}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 px-5 py-4">
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                    {note.content}
                </p>
            </div>

            {/* AI Summary */}
            {summaryError && (
                <div className="mx-5 mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3">
                    <p className="text-xs leading-5 text-red-700">
                        {summaryError}
                    </p>
                </div>
            )}

            {summary && (
                <div className="mx-5 mb-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="border-b border-slate-200 px-4 py-2.5">
                        <p className="text-xs font-semibold text-slate-700">
                            AI Summary
                        </p>
                    </div>

                    <div className="px-4 py-3">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {summary}
                        </p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        {formattedDate}
                    </span>

                    {summary && (
                        <span className="text-xs text-slate-400">
                            Summary generated
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(note)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(note.id)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        Delete
                    </button>

                    <button
                        type="button"
                        onClick={handleGenerateSummary}
                        disabled={loadingSummary}
                        className="ml-auto rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loadingSummary
                            ? 'Generating...'
                            : summary
                              ? 'Regenerate summary'
                              : 'Generate summary'}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default NoteCard;
