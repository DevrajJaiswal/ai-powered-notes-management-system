import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
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

        if (!form.name.trim()) {
            newErrors.name = 'Name is required.';
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email is required.';
        }

        if (!form.password) {
            newErrors.password = 'Password is required.';
        } else if (form.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }

        if (!form.password_confirmation) {
            newErrors.password_confirmation =
                'Please confirm your password.';
        } else if (form.password !== form.password_confirmation) {
            newErrors.password_confirmation =
                'Passwords do not match.';
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
            await register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                password_confirmation: form.password_confirmation,
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
                    'Unable to create your account. Please try again.'
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
                        Create your account
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Create account
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Enter your details to get started.
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
                                htmlFor="name"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                                placeholder="Your name"
                                className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                                    errors.name
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                        : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'
                                }`}
                            />

                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                                autoComplete="new-password"
                                placeholder="At least 8 characters"
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

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Confirm password
                            </label>

                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                                    errors.password_confirmation
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                        : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'
                                }`}
                            />

                            {errors.password_confirmation && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-slate-900 hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;