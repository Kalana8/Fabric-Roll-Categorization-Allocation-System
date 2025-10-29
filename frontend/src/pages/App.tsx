import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

export function App() {
    const { pathname } = useLocation();
    const { logout } = useAuth();
    return (
        <div className="container">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Fabric Roll Categorization & Allocation</h1>
                <button onClick={logout}>Logout</button>
            </div>
            <nav className="navbar">
                <Link className={`navlink ${pathname === '/' ? 'active' : ''}`} to="/">Roll Entry</Link>
                <Link className={`navlink ${pathname.startsWith('/rules') ? 'active' : ''}`} to="/rules">Rules</Link>
                <Link className={`navlink ${pathname.startsWith('/categorize') ? 'active' : ''}`} to="/categorize">Categorization</Link>
                <Link className={`navlink ${pathname.startsWith('/allocate') ? 'active' : ''}`} to="/allocate">Allocation</Link>
            </nav>
            <Outlet />
        </div>
    );
}


