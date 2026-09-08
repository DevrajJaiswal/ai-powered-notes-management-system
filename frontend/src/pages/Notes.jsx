import { useEffect, useState } from 'react';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import {
    createNote,
    deleteNote,
    getNotes,
    updateNote,
} from '../services/noteService';
import { useAuth } from '../context/AuthContext';

const Notes = () => {
    const { user, logout } = useAuth();

    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadNotes = async (currentPage = page) => {
        setLoading(true);
        setError('');

        try {
            const data = await getNotes(currentPage, 10);

            setNotes(data.data);
            setPage(data.current_page);
            setLastPage(data.last_page);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to load notes.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotes(1);
    }, []);

    const handleCreate = async (data) => {
        try {
            await createNote(data);
            await loadNotes(1);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to create note.'
            );

            throw error;
        }
    };

    const handleUpdate = async (data) => {
        try {
            await updateNote(editingNote.id, data);

            setEditingNote(null);

            await loadNotes(page);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to update note.'
            );

            throw error;
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this note?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteNote(id);

            await loadNotes(page);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to delete note.'
            );
        }
    };

    const handlePageChange = (newPage) => {
        loadNotes(newPage);
    };

    return (
        <div>
            <header>
                <h1>AI Notes</h1>

                <p>
                    Welcome, {user?.name}
                </p>

                <button onClick={logout}>
                    Logout
                </button>
            </header>

            <hr />

            <section>
                <h2>
                    {editingNote
                        ? 'Edit Note'
                        : 'Create Note'}
                </h2>

                <NoteForm
                    note={editingNote}
                    onSubmit={
                        editingNote
                            ? handleUpdate
                            : handleCreate
                    }
                    onCancel={() => setEditingNote(null)}
                />
            </section>

            <hr />

            <section>
                <h2>Your Notes</h2>

                {error && <p>{error}</p>}

                {loading ? (
                    <p>Loading notes...</p>
                ) : notes.length === 0 ? (
                    <p>No notes found. Create your first note.</p>
                ) : (
                    notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={setEditingNote}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </section>

            {!loading && lastPage > 1 && (
                <section>
                    <button
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        {' '}
                        Page {page} of {lastPage}{' '}
                    </span>

                    <button
                        disabled={page === lastPage}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Next
                    </button>
                </section>
            )}
        </div>
    );
};

export default Notes;