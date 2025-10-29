import React, { useEffect, useState } from 'react';

type Style = { id: string; code: string };
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export function Allocation() {
    const [styles, setStyles] = useState<Style[]>([]);
    const [styleId, setStyleId] = useState('');
    const [requiredLength, setRequiredLength] = useState(0);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const s = await fetch(`${API}/styles`).then((res) => res.json());
            setStyles(s);
            if (s.length) setStyleId(s[0].id);
        })();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${API}/allocate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ styleId, requiredLength }) });
        setResult(await res.json());
    };

    return (
        <div>
            <h2>Allocation</h2>
            <form onSubmit={submit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={styleId} onChange={(e) => setStyleId(e.target.value)}>
                    {styles.map((s) => (
                        <option key={s.id} value={s.id}>{s.code}</option>
                    ))}
                </select>
                <input type="number" step="0.01" placeholder="Required Length (m)" value={requiredLength} onChange={(e) => setRequiredLength(Number(e.target.value))} />
                <button type="submit">Consume Roll</button>
            </form>
            {result && (
                <pre style={{ background: '#f6f8fa', padding: 12, marginTop: 12 }}>{JSON.stringify(result, null, 2)}</pre>
            )}
        </div>
    );
}


