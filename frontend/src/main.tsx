import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './pages/App';
import { RollEntry } from './pages/RollEntry';
import { RuleCreation } from './pages/RuleCreation';
import { Categorization } from './pages/Categorization';
import { Allocation } from './pages/Allocation';
import { Login } from './pages/Login';
import { AuthProvider, RequireAuth } from './auth';
import './styles.css';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: (
            <RequireAuth>
                <App />
            </RequireAuth>
        ),
        children: [
            { index: true, element: <RollEntry /> },
            { path: 'rules', element: <RuleCreation /> },
            { path: 'categorize', element: <Categorization /> },
            { path: 'allocate', element: <Allocation /> }
        ]
    }
]);

const root = createRoot(document.getElementById('root')!);
root.render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);


