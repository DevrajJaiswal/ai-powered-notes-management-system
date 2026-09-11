import { useEffect, useState } from 'react';

import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';

import {
    createNote,
    deleteNote,
    generateSummary,
    getNotes,
    updateNote,
} from '../services/noteService';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);

    const loadNotes = async (currentPage = 1) => {
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

            setShowForm(false);
            setEditingNote(null);

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

            setShowForm(false);
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

            const nextPage =
                notes.length === 1 && page > 1
                    ? page - 1
                    : page;

            await loadNotes(nextPage);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Unable to delete note.'
            );
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleNewNote = () => {
        setEditingNote(null);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleCancel = () => {
        setEditingNote(null);
        setShowForm(false);
    };

    const handleGenerateSummary = async (id) => {
        return generateSummary(id);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Notes
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Create and manage your notes.
                    </p>
                </div>

                {!showForm && (
                    <button
                        type="button"
                        onClick={handleNewNote}
                        className="shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        + New note
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => setError('')}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Note form */}
            {showForm && (
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            {editingNote
                                ? 'Edit note'
                                : 'New note'}
                        </h2>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-sm font-medium text-slate-500 hover:text-slate-900"
                        >
                            Cancel
                        </button>
                    </div>

                    <NoteForm
                        note={editingNote}
                        onSubmit={
                            editingNote
                                ? handleUpdate
                                : handleCreate
                        }
                        onCancel={handleCancel}
                    />
                </section>
            )}

            {/* Notes */}
            <section>
                {loading && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white p-5"
                            >
                                <div className="h-5 w-2/3 rounded bg-slate-100" />

                                <div className="mt-5 space-y-3">
                                    <div className="h-3 w-full rounded bg-slate-100" />
                                    <div className="h-3 w-11/12 rounded bg-slate-100" />
                                    <div className="h-3 w-4/5 rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && notes.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <h2 className="text-base font-semibold text-slate-900">
                            No notes yet
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first note to get started.
                        </p>

                        <button
                            type="button"
                            onClick={handleNewNote}
                            className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Create note
                        </button>
                    </div>
                )}

                {!loading && notes.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onGenerateSummary={
                                    handleGenerateSummary
                                }
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Pagination */}
            {!loading && lastPage > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                    <p className="text-sm text-slate-500">
                        Page {page} of {lastPage}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => loadNotes(page - 1)}
                            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={page === lastPage}
                            onClick={() => loadNotes(page + 1)}
                            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;
