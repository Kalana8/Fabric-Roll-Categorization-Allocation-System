import React, { useEffect, useState } from 'react';

type Style = { id: string; name: string; code: string };
type Roll = { id: string; rollId: string; fabricWidth: number; widthShrinkage: number; lengthM: number; location: string; styleId: string; isBalance?: boolean; isActive?: boolean };

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export function RollEntry() {
    const [styles, setStyles] = useState<Style[]>([]);
    const [rolls, setRolls] = useState<Roll[]>([]);
    const [form, setForm] = useState({ styleId: '', rollId: '', fabricWidth: 0, widthShrinkage: 0, lengthM: 0, location: '' });
    const [q, setQ] = useState({ rollId: '', location: '', onlyBalance: false, showConsumed: false });

    const load = async () => {
        const [s, r] = await Promise.all([
            fetch(`${API}/styles`).then((res) => res.json()),
            fetch(`${API}/rolls`).then((res) => res.json())
        ]);
        setStyles(s);
        setRolls(r);
        if (s.length && !form.styleId) setForm((f) => ({ ...f, styleId: s[0].id }));
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${API}/rolls`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        await load();
    };

    const filtered = rolls.filter((r) => {
        if (q.onlyBalance && !r.isBalance) return false;
        if (!q.showConsumed && r.lengthM <= 0) return false;
        if (q.rollId && !r.rollId.toLowerCase().includes(q.rollId.toLowerCase())) return false;
        if (q.location && !r.location.toLowerCase().includes(q.location.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="grid">
            <div className="card">
                <h2>Fabric Roll Entry</h2>
                <form onSubmit={submit} className="grid" style={{ maxWidth: 520 }}>
                    <select value={form.styleId} onChange={(e) => setForm({ ...form, styleId: e.target.value })} required>
                        {styles.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                    </select>
                    <input placeholder="Roll ID" value={form.rollId} onChange={(e) => setForm({ ...form, rollId: e.target.value })} required />
                    <input type="number" step="0.01" placeholder="Fabric Width" value={form.fabricWidth} onChange={(e) => setForm({ ...form, fabricWidth: Number(e.target.value) })} required />
                    <input type="number" step="0.01" placeholder="Width Shrinkage (±)" value={form.widthShrinkage} onChange={(e) => setForm({ ...form, widthShrinkage: Number(e.target.value) })} required />
                    <input type="number" step="0.01" placeholder="Length (m)" value={form.lengthM} onChange={(e) => setForm({ ...form, lengthM: Number(e.target.value) })} required />
                    <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                    <button type="submit">Add Roll</button>
                </form>
            </div>

            <div className="card">
                <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3>Existing Rolls</h3>
                    <div className="row">
                        <input placeholder="Search Roll ID" value={q.rollId} onChange={(e) => setQ({ ...q, rollId: e.target.value })} />
                        <input placeholder="Search Location" value={q.location} onChange={(e) => setQ({ ...q, location: e.target.value })} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="checkbox" checked={q.onlyBalance} onChange={(e) => setQ({ ...q, onlyBalance: e.target.checked })} /> Balance only
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="checkbox" checked={q.showConsumed} onChange={(e) => setQ({ ...q, showConsumed: e.target.checked })} /> Show consumed
                        </label>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Style</th>
                            <th>RollID</th>
                            <th>Width</th>
                            <th>Shrinkage</th>
                            <th>Length</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((r) => (
                            <tr key={r.id}>
                                <td>{styles.find((s) => s.id === r.styleId)?.code}</td>
                                <td>{r.rollId}</td>
                                <td>{r.fabricWidth}</td>
                                <td>{r.widthShrinkage}</td>
                                <td>{r.lengthM}</td>
                                <td>{r.location}</td>
                                <td>
                                    <div className="badges">
                                        {r.isBalance ? <span className="badge balance">Balance</span> : null}
                                        {r.lengthM <= 0 || r.isActive === false ? <span className="badge consumed">Consumed</span> : null}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


