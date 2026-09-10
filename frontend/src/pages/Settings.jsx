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
        {
            id: 'groq/compound',
            name: 'Groq Compound',
            description: 'AI system combining models with built-in tools.',
        },
    ],
};

const Settings = () => {
    const [providers, setProviders] = useState([]);
    const [editingProvider, setEditingProvider] = useState(null);

    const [form, setForm] = useState({
        provider: 'openai',
        model: '',
        api_key: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const loadProviders = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getProviders();

            setProviders(data.providers || []);
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previousForm) => {
            if (name === 'provider') {
                return {
                    ...previousForm,
                    provider: value,
                    model: '',
                };
            }

            return {
                ...previousForm,
                [name]: value,
            };
        });

        setError('');
        setMessage('');
    };

    const resetForm = () => {
        setForm({
            provider: 'openai',
            model: '',
            api_key: '',
        });

        setEditingProvider(null);
        setError('');
        setMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError('');
        setMessage('');

        try {
            if (editingProvider) {
                await updateProvider(
                    editingProvider.id,
                    form
                );

                setMessage(
                    'AI provider updated successfully.'
                );
            } else {
                await createProvider(form);

                setMessage(
                    'AI provider configured successfully.'
                );
            }

            resetForm();

            await loadProviders();
        } catch (error) {
            const validationErrors =
                error.response?.data?.errors;

            if (validationErrors) {
                setError(
                    Object.values(validationErrors)
                        .flat()
                        .join(' ')
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    'Unable to save AI provider.'
                );
            }
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
        setMessage('');
    };


    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this AI provider?'
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setMessage('');

        try {
            await deleteProvider(id);

            setMessage(
                'AI provider deleted successfully.'
            );

            if (editingProvider?.id === id) {
                resetForm();
            }

            await loadProviders();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to delete AI provider.'
            );
        }
    };

    const handleActivate = async (id) => {
        setError('');
        setMessage('');

        try {
            await activateProvider(id);

            setMessage(
                'AI provider activated successfully.'
            );

            await loadProviders();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to activate AI provider.'
            );
        }
    };

    const availableModels =
        PROVIDER_MODELS[form.provider] || [];

    const selectedModel = availableModels.find(
        (model) => model.id === form.model
    );

    return (
        <div>
            <h1>AI Provider Settings</h1>

            {error && (
                <p>
                    {error}
                </p>
            )}

            {message && (
                <p>
                    {message}
                </p>
            )}

            <section>
                <h2>
                    {editingProvider
                        ? 'Edit Provider'
                        : 'Add Provider'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Provider
                        </label>

                        <select
                            name="provider"
                            value={form.provider}
                            onChange={handleChange}
                            disabled={!!editingProvider || saving}
                            required
                        >
                            <option value="openai">
                                OpenAI
                            </option>

                            <option value="gemini">
                                Gemini
                            </option>

                            <option value="groq">
                                Groq
                            </option>
                        </select>
                    </div>

                    <div>
                        <label>
                            Model
                        </label>

                        <select
                            name="model"
                            value={form.model}
                            onChange={handleChange}
                            disabled={saving}
                            required
                        >
                            <option value="">
                                Select a model
                            </option>

                            {availableModels.map((model) => (
                                <option
                                    key={model.id}
                                    value={model.id}
                                >
                                    {model.name}
                                </option>
                            ))}
                        </select>

                        {selectedModel && (
                            <p>
                                {selectedModel.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label>
                            API Key
                        </label>

                        <input
                            type="password"
                            name="api_key"
                            value={form.api_key}
                            onChange={handleChange}
                            placeholder={
                                editingProvider
                                    ? 'Enter new API key'
                                    : 'Enter API key'
                            }
                            disabled={saving}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            !form.provider ||
                            !form.model ||
                            !form.api_key
                        }
                    >
                        {saving
                            ? 'Verifying & Saving...'
                            : editingProvider
                                ? 'Update Provider'
                                : 'Add Provider'}
                    </button>

                    {/* Cancel Edit */}
                    {editingProvider && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </section>

            <hr />

            <section>
                <h2>
                    Configured Providers
                </h2>

                {loading ? (
                    <p>
                        Loading providers...
                    </p>
                ) : providers.length === 0 ? (
                    <p>
                        No AI providers configured yet.
                    </p>
                ) : (
                    providers.map((provider) => (
                        <ProviderCard
                            key={provider.id}
                            provider={provider}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onActivate={handleActivate}
                        />
                    ))
                )}
            </section>
        </div>
    );
};

export default Settings;
