import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#f7f8fc]">
            <Navbar />

            <main className="min-h-screen lg:ml-64">
                <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
