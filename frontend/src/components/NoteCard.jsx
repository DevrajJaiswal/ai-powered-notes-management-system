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

    return (
        <div>
            <h3>{note.title}</h3>

            <p>{note.content}</p>

            <button onClick={() => onEdit(note)}>
                Edit
            </button>

            <button onClick={() => onDelete(note.id)}>
                Delete
            </button>

            <button
                onClick={handleGenerateSummary}
                disabled={loadingSummary}
            >
                {loadingSummary
                    ? 'Generating Summary...'
                    : 'Generate Summary'}
            </button>

            {summaryError && (
                <p>
                    {summaryError}
                </p>
            )}

            {summary && (
                <div>
                    <h4>AI Summary</h4>

                    <p>
                        {summary}
                    </p>
                </div>
            )}
        </div>
    );
};

export default NoteCard;

