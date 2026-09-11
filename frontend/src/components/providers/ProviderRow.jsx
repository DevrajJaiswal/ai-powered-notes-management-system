const PROVIDER_INFO = {
    openai: {
        name: 'OpenAI',
        description: 'OpenAI API',
        icon: 'O',
    },
    gemini: {
        name: 'Google Gemini',
        description: 'Google AI API',
        icon: 'G',
    },
    groq: {
        name: 'Groq',
        description: 'Groq API',
        icon: 'G',
    },
};

const ProviderRow = ({
    provider,
    onEdit,
    onDelete,
    onActivate,
    activating = false,
}) => {
    const info =
        PROVIDER_INFO[provider.provider] || {
            name: provider.provider,
            description: 'AI provider',
            icon: 'A',
        };

    const isActive = Boolean(provider.is_active);

    return (
        <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
            <td className="px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
                        {info.icon}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {info.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-500">
                            {info.description}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <p className="max-w-xs truncate text-sm text-slate-700">
                    {provider.model}
                </p>
            </td>

            <td className="px-5 py-4">
                <span className="text-sm text-slate-600">
                    Configured
                </span>
            </td>

            <td className="px-5 py-4">
                <span
                    className={[
                        'inline-flex items-center gap-1.5 text-sm font-medium',
                        isActive
                            ? 'text-emerald-700'
                            : 'text-slate-500',
                    ].join(' ')}
                >
                    <span
                        className={[
                            'size-1.5 rounded-full',
                            isActive
                                ? 'bg-emerald-500'
                                : 'bg-slate-300',
                        ].join(' ')}
                    />

                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </td>

            <td className="whitespace-nowrap px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                    {!isActive && (
                        <button
                            type="button"
                            onClick={() => onActivate(provider.id)}
                            disabled={activating}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {activating
                                ? 'Activating...'
                                : 'Make active'}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => onEdit(provider)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(provider.id)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ProviderRow;