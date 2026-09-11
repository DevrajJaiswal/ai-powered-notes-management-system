import ProviderRow from './ProviderRow';

const ProviderTable = ({
    providers,
    onEdit,
    onDelete,
    onActivate,
    activatingId,
}) => {
    if (providers.length === 0) {
        return (
            <div className="px-6 py-12 text-center">
                <h3 className="text-sm font-semibold text-slate-900">
                    No providers configured
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Add an AI provider to generate summaries.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed border-collapse">
                <colgroup>
                    <col className="w-[28%]" />
                    <col className="w-[24%]" />
                    <col className="w-[12%]" />
                    <col className="w-[11%]" />
                    <col className="w-[25%]" />
                </colgroup>

                <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                            Provider
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                            Model
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                            API key
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                            Status
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {providers.map((provider) => (
                        <ProviderRow
                            key={provider.id}
                            provider={provider}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onActivate={onActivate}
                            activating={
                                activatingId === provider.id
                            }
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProviderTable;