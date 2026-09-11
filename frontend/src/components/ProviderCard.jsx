const PROVIDER_INFO = {
    openai: {
        name: 'OpenAI',
        description: 'GPT models for powerful AI-assisted note processing.',
        icon: '◉',
    },
    gemini: {
        name: 'Google Gemini',
        description: 'Google AI models for fast and capable note processing.',
        icon: '✦',
    },
    groq: {
        name: 'Groq',
        description: 'High-speed inference for fast AI-powered workflows.',
        icon: '⚡',
    },
};

const ProviderCard = ({
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
            icon: '✦',
        };

    const isActive = Boolean(provider.is_active);

    return (
        <article
            className={[
                'relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-200',
                isActive
                    ? 'border-slate-300 shadow-md'
                    : 'border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md',
            ].join(' ')}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
            )}

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <div
                            className={[
                                'grid size-12 shrink-0 place-items-center rounded-2xl text-lg font-bold',
                                isActive
                                    ? 'bg-slate-950 text-white'
                                    : 'bg-slate-100 text-slate-600',
                            ].join(' ')}
                        >
                            {info.icon}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold tracking-tight text-slate-950">
                                    {info.name}
                                </h3>

                                {isActive && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                        Active
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                                {info.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Model */}
                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Model
                            </p>

                            <p className="mt-1.5 break-all text-sm font-semibold text-slate-800">
                                {provider.model}
                            </p>
                        </div>

                        <span className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 ring-1 ring-slate-200">
                            {provider.provider}
                        </span>
                    </div>
                </div>

                {/* API key status */}
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3.5">
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-sm text-emerald-600">
                        ✓
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700">
                            API key configured
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Stored securely on the server
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {!isActive && (
                        <button
                            type="button"
                            onClick={() => onActivate(provider.id)}
                            disabled={activating}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {activating ? (
                                <>
                                    <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Activating...
                                </>
                            ) : (
                                <>
                                    <span>✓</span>
                                    Make active
                                </>
                            )}
                        </button>
                    )}

                    {isActive && (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700">
                            <span>✓</span>
                            Currently active
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => onEdit(provider)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(provider.id)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProviderCard;
