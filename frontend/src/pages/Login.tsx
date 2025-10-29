import React, { useState } from 'react';
import { useAuth } from '../auth';
import { useLocation, useNavigate } from 'react-router-dom';

export function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation() as any;
    const from = location.state?.from?.pathname || '/';

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err?.message ?? 'Login failed');
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
                <h2>Login</h2>
                <form onSubmit={submit} className="grid">
                    <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <div style={{ color: 'salmon' }}>{error}</div>}
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
}


