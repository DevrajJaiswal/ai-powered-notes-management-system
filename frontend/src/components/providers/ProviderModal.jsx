import { useEffect, useMemo, useState } from 'react';

import {
    PROVIDER_MODELS,
    PROVIDERS,
} from '../../constants/providerModels';

import { validateProvider } from '../../utils/validation';

const ProviderModal = ({
    provider,
    onClose,
    onSubmit,
    saving,
    error,
}) => {
    const isEditing = provider !== null;

    const [form, setForm] = useState({
        provider: '',
        model: '',
        api_key: '',
    });

    const [errors, setErrors] = useState({});

    const availableModels = useMemo(
        () => PROVIDER_MODELS[form.provider] || [],
        [form.provider]
    );

    useEffect(() => {
        if (provider) {
            setForm({
                provider: provider.provider,
                model: provider.model,
                api_key: '',
            });
        } else {
            const defaultProvider = 'openai';

            setForm({
                provider: defaultProvider,
                model: PROVIDER_MODELS[defaultProvider][0].id,
                api_key: '',
            });
        }

        setErrors({});
    }, [provider]);

    const handleProviderChange = (event) => {
        const providerId = event.target.value;
        const models = PROVIDER_MODELS[providerId] || [];

        setForm((current) => ({
            ...current,
            provider: providerId,
            model: models[0]?.id || '',
        }));

        setErrors({});
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = validateProvider({
            provider: form.provider,
            model: form.model,
            api_key: form.api_key,
            isEditing,
        });

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        onSubmit(form);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="provider-modal-title"
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2
                            id="provider-modal-title"
                            className="text-base font-semibold text-slate-900"
                        >
                            {isEditing
                                ? 'Edit AI provider'
                                : 'Add AI provider'}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {isEditing
                                ? 'Update the provider configuration.'
                                : 'Connect an AI provider to generate note summaries.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close modal"
                        className="rounded-md p-1.5 text-lg leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-5 py-5">
                        {/* Provider */}
                        <div>
                            <label
                                htmlFor="provider"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Provider
                            </label>

                            <select
                                id="provider"
                                value={form.provider}
                                onChange={handleProviderChange}
                                disabled={saving || isEditing}
                                className={[
                                    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50',
                                    errors.provider
                                        ? 'border-red-300'
                                        : 'border-slate-300',
                                ].join(' ')}
                            >
                                {PROVIDERS.map(
                                    (providerOption) => (
                                        <option
                                            key={providerOption.id}
                                            value={providerOption.id}
                                        >
                                            {providerOption.name}
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.provider && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.provider}
                                </p>
                            )}
                        </div>

                        {/* Model */}
                        <div>
                            <label
                                htmlFor="model"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Model
                            </label>

                            <select
                                id="model"
                                value={form.model}
                                onChange={(event) => {
                                    setForm((current) => ({
                                        ...current,
                                        model: event.target.value,
                                    }));

                                    setErrors((current) => ({
                                        ...current,
                                        model: '',
                                    }));
                                }}
                                disabled={saving}
                                className={[
                                    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50',
                                    errors.model
                                        ? 'border-red-300'
                                        : 'border-slate-300',
                                ].join(' ')}
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

                            {errors.model && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.model}
                                </p>
                            )}
                        </div>

                        {/* API key */}
                        <div>
                            <label
                                htmlFor="api-key"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                API key
                            </label>

                            <input
                                id="api-key"
                                type="password"
                                value={form.api_key}
                                onChange={(event) => {
                                    setForm((current) => ({
                                        ...current,
                                        api_key: event.target.value,
                                    }));

                                    setErrors((current) => ({
                                        ...current,
                                        api_key: '',
                                    }));
                                }}
                                placeholder={
                                    isEditing
                                        ? 'Leave blank to keep current key'
                                        : 'Enter your API key'
                                }
                                required={!isEditing}
                                disabled={saving}
                                autoComplete="off"
                                className={[
                                    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50',
                                    errors.api_key
                                        ? 'border-red-300'
                                        : 'border-slate-300',
                                ].join(' ')}
                            />

                            {errors.api_key && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.api_key}
                                </p>
                            )}

                            <p className="mt-2 text-xs text-slate-500">
                                Your API key is encrypted and stored on the
                                server.
                            </p>
                        </div>

                        {/* Server error */}
                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5">
                                <p className="text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? isEditing
                                    ? 'Saving...'
                                    : 'Adding...'
                                : isEditing
                                  ? 'Save changes'
                                  : 'Add provider'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProviderModal;