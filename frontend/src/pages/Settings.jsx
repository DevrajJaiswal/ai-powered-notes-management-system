import { useEffect, useState } from 'react';

import ProviderCard from '../components/ProviderCard';

import {
    activateProvider,
    createProvider,
    deleteProvider,
    getProviders,
    updateProvider,
} from '../services/aiProviderService';

const PROVIDER_MODELS = {
    openai: [
        {
            id: 'gpt-5.6-luna',
            name: 'GPT-5.6 Luna',
            description: 'Cost-efficient option for everyday note summaries.',
        },
        {
            id: 'gpt-5.6-terra',
            name: 'GPT-5.6 Terra',
            description: 'Balanced option for quality and cost.',
        },
        {
            id: 'gpt-5.6-sol',
            name: 'GPT-5.6 Sol',
            description: 'Advanced option for complex reasoning and analysis.',
        },
    ],

    gemini: [
        {
            id: 'gemini-2.5-flash',
            name: 'Gemini 2.5 Flash',
            description: 'Fast and cost-effective for everyday tasks.',
        },
        {
            id: 'gemini-2.5-flash-lite',
            name: 'Gemini 2.5 Flash-Lite',
            description: 'Lightweight and budget-friendly.',
        },
        {
            id: 'gemini-2.5-pro',
            name: 'Gemini 2.5 Pro',
            description: 'Advanced model for complex reasoning.',
        },
        {
            id: 'gemini-3.5-flash',
            name: 'Gemini 3.5 Flash',
            description: 'Fast general-purpose model for high-throughput tasks.',
        },
        {
            id: 'gemini-3.5-flash-lite',
            name: 'Gemini 3.5 Flash-Lite',
            description: 'Fast and cost-effective option for lightweight tasks.',
        },
    ],

    groq: [
        {
            id: 'openai/gpt-oss-20b',
            name: 'GPT-OSS 20B',
            description: 'Very fast and cost-efficient open-weight model.',
        },
        {
            id: 'openai/gpt-oss-120b',
            name: 'GPT-OSS 120B',
            description: 'Higher-capability open-weight model.',
        },
        {
            id: 'llama-3.1-8b-instant',
            name: 'Llama 3.1 8B Instant',
            description: 'Extremely fast model for lightweight tasks.',
        },
        {
            id: 'llama-3.3-70b-versatile',
            name: 'Llama 3.3 70B Versatile',
            description: 'Higher-capability model for general-purpose tasks.',
        },
    ],
};

const PROVIDERS = [
    {
        id: 'openai',
        name: 'OpenAI',
        description: 'Powerful models for intelligent note processing.',
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        description: 'Fast and capable models from Google AI.',
    },
    {
        id: 'groq',
        name: 'Groq',
        description: 'High-speed inference for responsive AI workflows.',
    },
];

const emptyForm = {
    provider: 'openai',
    model: PROVIDER_MODELS.openai[0].id,
    api_key: '',
};

const Settings = () => {
    const [providers, setProviders] = useState([]);

    const [form, setForm] = useState(emptyForm);
    const [editingProvider, setEditingProvider] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activatingId, setActivatingId] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadProviders = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getProviders();

            setProviders(data.data || data);
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

    const resetForm = () => {
        setForm(emptyForm);
        setEditingProvider(null);
    };

    const handleProviderChange = (event) => {
        const provider = event.target.value;

        setForm({
            provider,
            model: PROVIDER_MODELS[provider][0].id,
            api_key: '',
        });
    };

    const handleModelChange = (event) => {
        setForm((current) => ({
            ...current,
            model: event.target.value,
        }));
    };

    const handleApiKeyChange = (event) => {
        setForm((current) => ({
            ...current,
            api_key: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!form.api_key.trim() && !editingProvider) {
            setError('Please enter your API key.');
            return;
        }

        setSaving(true);

        try {
            if (editingProvider) {
                const payload = {
                    provider: form.provider,
                    model: form.model,
                };

                if (form.api_key.trim()) {
                    payload.api_key = form.api_key.trim();
                }

                await updateProvider(editingProvider.id, payload);

                setSuccess('AI provider updated successfully.');
            } else {
                await createProvider({
                    provider: form.provider,
                    model: form.model,
                    api_key: form.api_key.trim(),
                });

                setSuccess('AI provider added successfully.');
            }

            resetForm();
            await loadProviders();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Unable to save AI provider.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (provider) => {
        setEditingProvider(provider);

        setForm({
            provider: provider.provider,
            model: provider.model,
            api_key: '',
        });

        setError('');
        setSuccess('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to remove this AI provider?'
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            await deleteProvider(id);

            setSuccess('AI provider removed successfully.');

            if (editingProvider?.id === id) {
                resetForm();
            }

            await loadProviders();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Unable to remove AI provider.'
            );
        }
    };

    const handleActivate = async (id) => {
        setActivatingId(id);
        setError('');
        setSuccess('');

        try {
            await activateProvider(id);

            setSuccess('AI provider activated successfully.');

            await loadProviders();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    'Unable to activate AI provider.'
            );
        } finally {
            setActivatingId(null);
        }
    };

    const availableModels =
        PROVIDER_MODELS[form.provider] || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <section>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                    <span className="size-1.5 rounded-full bg-violet-500" />
                    AI configuration
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    AI Providers
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    Connect your preferred AI provider and choose which
                    model powers your note summaries.
                </p>
            </section>

            {/* Alerts */}
            {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                    <span className="font-bold">!</span>

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
                        className="text-red-400 hover:text-red-700"
                    >
                        ×
                    </button>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                    <span className="font-bold">✓</span>

                    <div className="flex-1">
                        <p className="font-semibold">
                            Success
                        </p>

                        <p className="mt-1 text-emerald-600">
                            {success}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSuccess('')}
                        className="text-emerald-400 hover:text-emerald-700"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Provider form */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-6 sm:px-7">
                    <div className="flex items-start gap-4">
                        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-lg text-white">
                            {editingProvider ? '✎' : '+'}
                        </div>

                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-950">
                                {editingProvider
                                    ? 'Edit AI provider'
                                    : 'Add AI provider'}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingProvider
                                    ? 'Update the provider or model. Leave the API key empty to keep the existing key.'
                                    : 'Your API key is encrypted and stored securely on the server.'}
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 sm:p-7"
                >
                    <div className="grid gap-5 lg:grid-cols-3">
                        {/* Provider */}
                        <div>
                            <label
                                htmlFor="provider"
                                className="mb-2 block text-sm font-semibold text-slate-800"
                            >
                                Provider
                            </label>

                            <select
                                id="provider"
                                value={form.provider}
                                onChange={handleProviderChange}
                                disabled={saving || Boolean(editingProvider)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {PROVIDERS.map((provider) => (
                                    <option
                                        key={provider.id}
                                        value={provider.id}
                                    >
                                        {provider.name}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-2 text-xs text-slate-400">
                                {PROVIDERS.find(
                                    (item) =>
                                        item.id === form.provider
                                )?.description}
                            </p>
                        </div>

                        {/* Model */}
                        <div>
                            <label
                                htmlFor="model"
                                className="mb-2 block text-sm font-semibold text-slate-800"
                            >
                                Model
                            </label>

                            <select
                                id="model"
                                value={form.model}
                                onChange={handleModelChange}
                                disabled={saving}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {availableModels.map((model) => (
                                    <option
                                        key={model.id}
                                        value={model.id}
                                    >
                                        {model.name}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-2 text-xs leading-5 text-slate-400">
                                {availableModels.find(
                                    (model) =>
                                        model.id === form.model
                                )?.description}
                            </p>
                        </div>

                        {/* API Key */}
                        <div>
                            <label
                                htmlFor="api-key"
                                className="mb-2 block text-sm font-semibold text-slate-800"
                            >
                                {editingProvider
                                    ? 'New API key'
                                    : 'API key'}
                            </label>

                            <input
                                id="api-key"
                                type="password"
                                value={form.api_key}
                                onChange={handleApiKeyChange}
                                placeholder={
                                    editingProvider
                                        ? 'Leave empty to keep current key'
                                        : 'Enter your API key'
                                }
                                autoComplete="new-password"
                                disabled={saving}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <p className="mt-2 text-xs text-slate-400">
                                Never stored in browser localStorage.
                            </p>
                        </div>
                    </div>

                    {/* Selected model information */}
                    {availableModels.length > 0 && (
                        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Selected model
                            </p>

                            <p className="mt-1.5 text-sm font-bold text-slate-800">
                                {
                                    availableModels.find(
                                        (model) =>
                                            model.id ===
                                            form.model
                                    )?.name
                                }
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {
                                    availableModels.find(
                                        (model) =>
                                            model.id ===
                                            form.model
                                    )?.description
                                }
                            </p>
                        </div>
                    )}

                    {/* Form actions */}
                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        {editingProvider && (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={saving}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    {editingProvider
                                        ? 'Updating...'
                                        : 'Connecting...'}
                                </>
                            ) : (
                                <>
                                    <span>
                                        {editingProvider ? '✓' : '+'}
                                    </span>

                                    {editingProvider
                                        ? 'Update provider'
                                        : 'Add provider'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>

            {/* Security information */}
            <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-lg">
                        🔒
                    </div>

                    <div>
                        <h2 className="font-bold">
                            Your API keys stay private
                        </h2>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                            API keys are sent directly to the Laravel
                            backend and stored using encrypted database
                            storage. They are never returned by the API
                            or saved in browser localStorage.
                        </p>
                    </div>
                </div>
            </section>

            {/* Configured providers */}
            <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950">
                            Configured providers
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Choose which provider will power your AI
                            features.
                        </p>
                    </div>

                    {!loading && (
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                            {providers.length}{' '}
                            {providers.length === 1
                                ? 'provider'
                                : 'providers'}
                        </span>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {[1, 2].map((item) => (
                            <div
                                key={item}
                                className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex gap-4">
                                    <div className="size-12 rounded-2xl bg-slate-100" />

                                    <div className="flex-1">
                                        <div className="h-4 w-32 rounded bg-slate-100" />
                                        <div className="mt-2 h-3 w-56 rounded bg-slate-100" />
                                    </div>
                                </div>

                                <div className="mt-7 h-20 rounded-2xl bg-slate-100" />

                                <div className="mt-4 h-12 rounded-2xl bg-slate-100" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && providers.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-slate-100 text-2xl">
                            ✨
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-slate-950">
                            No AI providers configured
                        </h3>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                            Add an OpenAI, Google Gemini, or Groq API
                            key above to enable AI-powered note
                            summaries.
                        </p>
                    </div>
                )}

                {/* Provider cards */}
                {!loading && providers.length > 0 && (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {providers.map((provider) => (
                            <ProviderCard
                                key={provider.id}
                                provider={provider}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onActivate={handleActivate}
                                activating={
                                    activatingId === provider.id
                                }
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Settings;
