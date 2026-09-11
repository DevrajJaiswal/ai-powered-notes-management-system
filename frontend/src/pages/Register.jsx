import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register, isAuthenticated, loading: authLoading } = useAuth();

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
                <div className="text-center">
                    <div className="mx-auto size-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/notes" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');

        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await register({
                name: name.trim(),
                email: email.trim(),
                password,
                password_confirmation: passwordConfirmation,
            });

            navigate('/notes', { replace: true });
            } catch (error) {
                console.error('Registration error:', error);

                const validationErrors =
                    error.response?.data?.errors;

                const firstValidationError =
                    validationErrors &&
                    Object.values(validationErrors)[0]?.[0];

                setError(
                    firstValidationError ||
                        error.response?.data?.message ||
                        error.message ||
                        'Unable to create your account.'
                );
            } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f8fc]">
            <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
                {/* Brand panel */}
                <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -right-32 -top-32 size-96 rounded-full border border-white/10" />
                    <div className="absolute -bottom-40 -left-40 size-96 rounded-full border border-white/10" />

                    <div className="relative">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-3"
                        >
                            <span className="grid size-11 place-items-center rounded-2xl bg-white text-lg font-bold text-slate-950">
                                ✦
                            </span>

                            <div>
                                <p className="font-bold tracking-tight">
                                    AI Notes
                                </p>

                                <p className="text-xs text-slate-400">
                                    Intelligent workspace
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="relative max-w-xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                            <span className="size-1.5 rounded-full bg-violet-400" />
                            Build your personal knowledge base
                        </div>

                        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
                            One place for every thought worth keeping.
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                            Keep your notes organized and use AI to
                            transform long thoughts into clear,
                            useful summaries.
                        </p>

                        <div className="mt-10 grid gap-3">
                            <div className="flex items-center gap-3">
                                <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-sm">
                                    📝
                                </span>

                                <span className="text-sm text-slate-300">
                                    Simple note management
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-sm">
                                    ✨
                                </span>

                                <span className="text-sm text-slate-300">
                                    Multiple AI providers
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-sm">
                                    🔒
                                </span>

                                <span className="text-sm text-slate-300">
                                    Secure account and credentials
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="relative text-xs text-slate-500">
                        AI Notes Management System
                    </p>
                </section>

                {/* Registration panel */}
                <section className="flex items-center justify-center px-5 py-10 sm:px-8">
                    <div className="w-full max-w-md">
                        {/* Mobile logo */}
                        <div className="mb-10 lg:hidden">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-3"
                            >
                                <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-lg font-bold text-white">
                                    ✦
                                </span>

                                <div>
                                    <p className="font-bold tracking-tight text-slate-950">
                                        AI Notes
                                    </p>

                                    <p className="text-[11px] font-medium text-slate-400">
                                        Intelligent workspace
                                    </p>
                                </div>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                                Get started
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Start organizing your notes with an
                                AI-powered workspace.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5">
                                <span className="mt-0.5 font-bold text-red-500">
                                    !
                                </span>

                                <p className="text-sm font-medium leading-5 text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="register-name"
                                    className="mb-2 block text-sm font-semibold text-slate-800"
                                >
                                    Full name
                                </label>

                                <input
                                    id="register-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Your name"
                                    autoComplete="name"
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="register-email"
                                    className="mb-2 block text-sm font-semibold text-slate-800"
                                >
                                    Email address
                                </label>

                                <input
                                    id="register-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="register-password"
                                    className="mb-2 block text-sm font-semibold text-slate-800"
                                >
                                    Password
                                </label>

                                <input
                                    id="register-password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="register-password-confirmation"
                                    className="mb-2 block text-sm font-semibold text-slate-800"
                                >
                                    Confirm password
                                </label>

                                <input
                                    id="register-password-confirmation"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(event) =>
                                        setPasswordConfirmation(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <span>→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />

                            <span className="text-xs font-medium text-slate-400">
                                Already have an account?
                            </span>

                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <Link
                            to="/login"
                            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            Sign in instead
                        </Link>

                        <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                            Your account credentials are handled securely
                            by the Laravel backend.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Register;
