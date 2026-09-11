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

import { useAuth } from '../context/AuthContext';

const Notes = () => {
    const { user } = useAuth();

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
                    'Unable to load your notes.'
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

            setEditingNote(null);
            setShowForm(false);

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

            /*
             * If the last note on the current page was deleted,
             * move back one page when necessary.
             */
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
        return await generateSummary(id);
    };

    return (
        <div className="space-y-8">
            {/* Page header */}
            <section>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Personal workspace
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Good to see you,{' '}
                            {user?.name?.split(' ')[0] || 'there'}.
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Capture your thoughts, manage your notes, and
                            use AI to turn them into concise summaries.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleNewNote}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                    >
                        <span className="text-lg leading-none">+</span>
                        New note
                    </button>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                    <span className="mt-0.5 font-bold">!</span>

                    <div className="flex-1">
                        <p className="font-semibold">
                            Something went wrong
                        </p>

                        <p className="mt-1 text-red-600">
                            {error}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setError('')}
                        className="text-red-400 transition hover:text-red-700"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Create / edit form */}
            {showForm && (
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                                {editingNote ? 'Edit note' : 'Create note'}
                            </p>

                            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                                {editingNote
                                    ? 'Update your note'
                                    : 'Capture a new thought'}
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="grid size-9 shrink-0 place-items-center rounded-xl text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Close form"
                        >
                            ×
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

            {/* Notes section */}
            <section>
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950">
                            Your notes
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {loading
                                ? 'Loading your notes...'
                                : notes.length === 0
                                  ? 'Your workspace is ready for your first note.'
                                  : `${notes.length} note${
                                        notes.length === 1 ? '' : 's'
                                    } on this page`}
                        </p>
                    </div>

                    {!showForm && (
                        <button
                            type="button"
                            onClick={handleNewNote}
                            className="self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            + Add note
                        </button>
                    )}
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="grid gap-5 md:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="min-h-64 animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="h-5 w-2/3 rounded bg-slate-100" />

                                <div className="mt-5 space-y-3">
                                    <div className="h-3 w-full rounded bg-slate-100" />
                                    <div className="h-3 w-11/12 rounded bg-slate-100" />
                                    <div className="h-3 w-4/5 rounded bg-slate-100" />
                                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                                </div>

                                <div className="mt-10 flex gap-2">
                                    <div className="h-9 w-16 rounded-lg bg-slate-100" />
                                    <div className="h-9 w-20 rounded-lg bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && notes.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-slate-100 text-2xl">
                            📝
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-slate-950">
                            No notes yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Start building your personal knowledge
                            workspace. Create your first note and let AI
                            help you summarize it.
                        </p>

                        <button
                            type="button"
                            onClick={handleNewNote}
                            className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Create your first note
                        </button>
                    </div>
                )}

                {/* Notes grid */}
                {!loading && notes.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2">
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
                <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                        Page{' '}
                        <span className="font-semibold text-slate-900">
                            {page}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-slate-900">
                            {lastPage}
                        </span>
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => loadNotes(page - 1)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                        >
                            ← Previous
                        </button>

                        <button
                            type="button"
                            disabled={page === lastPage}
                            onClick={() => loadNotes(page + 1)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;
