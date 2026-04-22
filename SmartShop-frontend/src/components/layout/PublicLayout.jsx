import { Link, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function PublicLayout() {
    return (
        <>
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
        </>
    );
}
