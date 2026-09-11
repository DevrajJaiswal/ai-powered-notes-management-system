export const PROVIDER_MODELS = {
    openai: [
        {
            id: 'gpt-5.6-luna',
            name: 'GPT-5.6 Luna',
        },
        {
            id: 'gpt-5.6-terra',
            name: 'GPT-5.6 Terra',
        },
        {
            id: 'gpt-5.6-sol',
            name: 'GPT-5.6 Sol',
        },
    ],

    gemini: [
        {
            id: 'gemini-2.5-flash',
            name: 'Gemini 2.5 Flash',
        },
        {
            id: 'gemini-2.5-flash-lite',
            name: 'Gemini 2.5 Flash-Lite',
        },
        {
            id: 'gemini-2.5-pro',
            name: 'Gemini 2.5 Pro',
        },
        {
            id: 'gemini-3.5-flash',
            name: 'Gemini 3.5 Flash',
        },
        {
            id: 'gemini-3.5-flash-lite',
            name: 'Gemini 3.5 Flash-Lite',
        },
    ],

    groq: [
        {
            id: 'openai/gpt-oss-20b',
            name: 'GPT-OSS 20B',
        },
        {
            id: 'openai/gpt-oss-120b',
            name: 'GPT-OSS 120B',
        },
        {
            id: 'llama-3.1-8b-instant',
            name: 'Llama 3.1 8B Instant',
        },
        {
            id: 'llama-3.3-70b-versatile',
            name: 'Llama 3.3 70B Versatile',
        },
    ],
};

export const PROVIDERS = [
    {
        id: 'openai',
        name: 'OpenAI',
        icon: 'O',
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        icon: 'G',
    },
    {
        id: 'groq',
        name: 'Groq',
        icon: 'G',
    },
];