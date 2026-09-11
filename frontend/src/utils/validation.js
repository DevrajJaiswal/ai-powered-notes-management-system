export const validateNote = ({ title, content }) => {
    const errors = {};

    if (!title?.trim()) {
        errors.title = 'Title is required.';
    }

    if (!content?.trim()) {
        errors.content = 'Content is required.';
    }

    return errors;
};

export const validateProvider = ({
    provider,
    model,
    api_key,
    isEditing = false,
}) => {
    const errors = {};

    if (!isEditing && !provider?.trim()) {
        errors.provider = 'Provider is required.';
    }

    if (!model?.trim()) {
        errors.model = 'Model is required.';
    }

    if (!isEditing && !api_key?.trim()) {
        errors.api_key = 'API key is required.';
    }

    return errors;
};