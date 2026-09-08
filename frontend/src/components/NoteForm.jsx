import { useEffect, useState } from 'react';

const NoteForm = ({ note, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        title: '',
        content: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (note) {
            setForm({
                title: note.title,
                content: note.content,
            });
        } else {
            setForm({
                title: '',
                content: '',
            });
        }
    }, [note]);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {
            await onSubmit(form);

            if (!note) {
                setForm({
                    title: '',
                    content: '',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>

                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Content</label>

                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows="6"
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading
                    ? 'Saving...'
                    : note
                        ? 'Update Note'
                        : 'Create Note'}
            </button>

            {note && (
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
            )}
        </form>
    );
};

export default NoteForm;