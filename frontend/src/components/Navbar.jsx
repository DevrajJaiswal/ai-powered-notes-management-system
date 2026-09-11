import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    const navLinkClass = ({ isActive }) =>
        [
            'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            isActive
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        ].join(' ');

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-slate-200 bg-white lg:flex lg:flex-col">
                {/* Brand */}
                <div className="flex h-16 items-center border-b border-slate-200 px-5">
                    <NavLink
                        to="/notes"
                        className="flex items-center gap-2.5"
                    >
                        <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
                            N
                        </span>

                        <span className="text-sm font-semibold text-slate-900">
                            AI Notes
                        </span>
                    </NavLink>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Menu
                    </p>

                    <NavLink
                        to="/notes"
                        className={navLinkClass}
                    >
                        <span className="mr-3 w-5 text-center text-sm">
                            ▤
                        </span>

                        Notes
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={navLinkClass}
                    >
                        <span className="mr-3 w-5 text-center text-sm">
                            ⚙
                        </span>

                        AI Providers
                    </NavLink>
                </nav>

                {/* User */}
                <div className="border-t border-slate-200 p-4">
                    <div className="mb-3 min-w-0 px-3">
                        <p className="truncate text-sm font-medium text-slate-900">
                            {user?.name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            {user?.email}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Mobile header */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden">
                <div className="flex h-16 items-center justify-between px-4">
                    <NavLink
                        to="/notes"
                        className="flex items-center gap-2.5"
                    >
                        <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
                            N
                        </span>

                        <span className="text-sm font-semibold text-slate-900">
                            AI Notes
                        </span>
                    </NavLink>

                    <nav className="flex items-center gap-1">
                        <NavLink
                            to="/notes"
                            className={navLinkClass}
                        >
                            Notes
                        </NavLink>

                        <NavLink
                            to="/settings"
                            className={navLinkClass}
                        >
                            AI
                        </NavLink>

                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                            Exit
                        </button>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Navbar;
