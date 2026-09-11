import { useEffect, useState } from 'react';

import ProviderModal from '../components/providers/ProviderModal';
import ProviderTable from '../components/providers/ProviderTable';

import {
    activateProvider,
    createProvider,
    deleteProvider,
    getProviders,
    updateProvider,
} from '../services/aiProviderService';

const Settings = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activatingId, setActivatingId] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);

    const loadProviders = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getProviders();

            setProviders(
                data.providers ||
                    data.data ||
                    data
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Unable to load AI providers.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProviders();
    }, []);

    const openCreateModal = () => {
        setEditingProvider(null);
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (provider) => {
        setEditingProvider(provider);
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setIsModalOpen(false);
        setEditingProvider(null);
        setError('');
    };

    const handleSubmit = async (form) => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            if (editingProvider) {
                const payload = {
                    model: form.model,
                };

                if (form.api_key.trim()) {
                    payload.api_key =
                        form.api_key.trim();
                }

                await updateProvider(
                    editingProvider.id,
                    payload
                );

                setSuccess(
                    'Provider updated successfully.'
                );
            } else {
                await createProvider({
                    provider: form.provider,
                    model: form.model,
                    api_key: form.api_key.trim(),
                });

                setSuccess(
                    'Provider added successfully.'
                );
            }

            await loadProviders();

            setIsModalOpen(false);
            setEditingProvider(null);
        } catch (error) {
            const validationErrors =
                error.response?.data?.errors;

            const firstValidationError =
                validationErrors
                    ? Object.values(validationErrors)
                          .flat()[0]
                    : null;

            setError(
                firstValidationError ||
                    error.response?.data?.message ||
                    'Unable to save provider.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this AI provider?'
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await deleteProvider(id);

            setSuccess(
                'Provider deleted successfully.'
            );

            await loadProviders();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Unable to delete provider.'
            );
        }
    };

    const handleActivate = async (id) => {
        setActivatingId(id);
        setError('');
        setSuccess('');

        try {
            await activateProvider(id);

            setSuccess(
                'AI provider activated successfully.'
            );

            await loadProviders();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Unable to activate provider.'
            );
        } finally {
            setActivatingId(null);
        }
    };

    return (
        <>
            <div className="space-y-7">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            AI Providers
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage the AI providers used by your notes.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        <span className="mr-2 text-base leading-none">
                            +
                        </span>

                        Add provider
                    </button>
                </div>

                {/* Error */}
                {error && !isModalOpen && (
                    <div className="flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => setError('')}
                            className="text-xs font-medium text-red-600 hover:text-red-800"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="flex items-start justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                        <p className="text-sm text-emerald-700">
                            {success}
                        </p>

                        <button
                            type="button"
                            onClick={() => setSuccess('')}
                            className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Providers */}
                <section>
                    <div className="mb-3 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Configured providers
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Choose which provider will power your AI features.
                            </p>
                        </div>

                        {!loading && (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500">
                                {providers.length}{' '}
                                {providers.length === 1
                                    ? 'provider'
                                    : 'providers'}
                            </span>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        {loading ? (
                            <div className="divide-y divide-slate-100">
                                {[1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="flex animate-pulse items-center gap-4 px-5 py-5"
                                    >
                                        <div className="size-9 rounded-lg bg-slate-100" />

                                        <div className="flex-1">
                                            <div className="h-4 w-28 rounded bg-slate-100" />
                                            <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
                                        </div>

                                        <div className="hidden h-4 w-36 rounded bg-slate-100 lg:block" />
                                        <div className="h-8 w-20 rounded bg-slate-100" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ProviderTable
                                providers={providers}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                                onActivate={handleActivate}
                                activatingId={activatingId}
                            />
                        )}
                    </div>
                </section>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ProviderModal
                    provider={editingProvider}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    saving={saving}
                    error={error}
                />
            )}
        </>
    );
};

export default Settings;