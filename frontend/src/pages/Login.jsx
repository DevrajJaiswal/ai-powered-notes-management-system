import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: '',
        }));

        setServerError('');
    };

    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = 'Email is required.';
        }

        if (!form.password) {
            newErrors.password = 'Password is required.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        setServerError('');

        try {
            await login({
                email: form.email.trim(),
                password: form.password,
            });

            navigate('/notes', { replace: true });
        } catch (error) {
            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                const formattedErrors = {};

                Object.entries(validationErrors).forEach(
                    ([field, messages]) => {
                        formattedErrors[field] = messages[0];
                    }
                );

                setErrors(formattedErrors);
            } else {
                setServerError(
                    error.response?.data?.message ||
                    'Unable to sign in. Please check your credentials.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        AI Notes Management System
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to continue
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Sign in
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Enter your account details below.
                        </p>
                    </div>

                    {serverError && (
                        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                                    errors.email
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                        : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'
                                }`}
                            />

                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                                    errors.password
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                        : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'
                                }`}
                            />

                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-slate-900 hover:underline"
                        >
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;