import api from './api';

export const getProviders = async () => {
    const response = await api.get('/ai/providers');

    return response.data;
};

export const createProvider = async (data) => {
    const response = await api.post('/ai/providers', data);

    return response.data;
};

export const updateProvider = async (id, data) => {
    const response = await api.put(`/ai/providers/${id}`, data);

    return response.data;
};

export const deleteProvider = async (id) => {
    const response = await api.delete(`/ai/providers/${id}`);

    return response.data;
};

export const activateProvider = async (id) => {
    const response = await api.patch(
        `/ai/providers/${id}/activate`
    );

    return response.data;
};

export const getModelsForNewProvider = async (
    provider,
    api_key
) => {
    const response = await api.post(
        `/ai/providers/${provider}/models`,
        {
            api_key,
        }
    );

    return response.data;
};

export const getModelsForSavedProvider = async (id) => {
    const response = await api.get(
        `/ai/providers/${id}/models`
    );

    return response.data;
};