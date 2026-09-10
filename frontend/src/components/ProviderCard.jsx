const ProviderCard = ({
    provider,
    onEdit,
    onDelete,
    onActivate,
}) => {
    return (
        <div>
            <h3>
                {provider.provider.toUpperCase()}
            </h3>

            <p>
                Model: {provider.model}
            </p>

            <p>
                Status:{' '}
                {provider.is_active
                    ? 'Active'
                    : 'Inactive'}
            </p>

            <button onClick={() => onEdit(provider)}>
                Edit
            </button>

            {!provider.is_active && (
                <button
                    onClick={() => onActivate(provider.id)}
                >
                    Activate
                </button>
            )}

            <button
                onClick={() => onDelete(provider.id)}
            >
                Delete
            </button>
        </div>
    );
};

export default ProviderCard;