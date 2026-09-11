import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />

            <div className="lg:pl-60">
                <div className="flex min-h-screen flex-col">
                    <main className="flex-1">
                        <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
                            <Outlet />
                        </div>
                    </main>

                    <footer className="border-t border-slate-200 bg-white">
                        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            <span>AI Notes Management System</span>
                            <span>© 2026</span>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Layout;
