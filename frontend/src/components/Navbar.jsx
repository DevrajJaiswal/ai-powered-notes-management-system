import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    const navItem = ({ isActive }) =>
        [
            'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all',
            isActive
                ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:bg-white/70 hover:text-slate-900',
        ].join(' ');

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-200 bg-[#f9fafc] lg:flex lg:flex-col">

                {/* Logo */}
                <div className="px-6 py-7">
                    <NavLink
                        to="/notes"
                        className="flex items-center gap-3"
                    >
                        <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-lg font-bold text-white shadow-sm">
                            ✦
                        </span>

                        <div>
                            <p className="text-base font-bold tracking-tight text-slate-950">
                                AI Notes
                            </p>

                            <p className="text-[11px] font-medium text-slate-400">
                                Intelligent workspace
                            </p>
                        </div>
                    </NavLink>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Workspace
                    </p>

                    <nav className="space-y-1.5">
                        <NavLink
                            to="/notes"
                            className={navItem}
                        >
                            <span className="grid size-8 place-items-center rounded-lg bg-slate-100">
                                📝
                            </span>

                            <span>Notes</span>
                        </NavLink>

                        <NavLink
                            to="/settings"
                            className={navItem}
                        >
                            <span className="grid size-8 place-items-center rounded-lg bg-slate-100">
                                ✨
                            </span>

                            <span>AI Providers</span>
                        </NavLink>
                    </nav>
                </div>

                {/* User */}
                <div className="border-t border-slate-200 p-4">
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {user?.name}
                            </p>

                            <p className="truncate text-xs text-slate-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-red-600"
                    >
                        <span>↪</span>
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Mobile navigation */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
                <div className="flex min-h-16 items-center px-4">
                    <NavLink
                        to="/notes"
                        className="flex items-center gap-2.5"
                    >
                        <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                            ✦
                        </span>

                        <span className="font-bold tracking-tight text-slate-950">
                            AI Notes
                        </span>
                    </NavLink>

                    <nav className="ml-auto flex items-center gap-1">
                        <NavLink
                            to="/notes"
                            className={navItem}
                        >
                            Notes
                        </NavLink>

                        <NavLink
                            to="/settings"
                            className={navItem}
                        >
                            AI
                        </NavLink>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Navbar;
