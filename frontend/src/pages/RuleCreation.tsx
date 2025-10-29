import React, { useEffect, useState } from 'react';

type Style = { id: string; name: string; code: string };
type Rule = { id: string; styleId: string; widthToleranceMin: number; widthToleranceMax: number; shrinkageToleranceMin: number; shrinkageToleranceMax: number };

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export function RuleCreation() {
    const [styles, setStyles] = useState<Style[]>([]);
    const [rules, setRules] = useState<Rule[]>([]);
    const [form, setForm] = useState({ styleId: '', widthToleranceMin: -5, widthToleranceMax: 5, shrinkageToleranceMin: -5, shrinkageToleranceMax: 5 });

    const load = async () => {
        const [s, r] = await Promise.all([
            fetch(`${API}/styles`).then((res) => res.json()),
            fetch(`${API}/rules`).then((res) => res.json())
        ]);
        setStyles(s);
        setRules(r);
        if (s.length && !form.styleId) setForm((f) => ({ ...f, styleId: s[0].id }));
    };

    useEffect(() => { load(); }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${API}/rules`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        await load();
    };

    return (
        <div>
            <h2>Rule Creation</h2>
            <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
                <select value={form.styleId} onChange={(e) => setForm({ ...form, styleId: e.target.value })} required>
                    {styles.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                </select>
                <div>
                    <label>Width Tolerance (min / max)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input type="number" step="0.1" value={form.widthToleranceMin} onChange={(e) => setForm({ ...form, widthToleranceMin: Number(e.target.value) })} />
                        <input type="number" step="0.1" value={form.widthToleranceMax} onChange={(e) => setForm({ ...form, widthToleranceMax: Number(e.target.value) })} />
                    </div>
                </div>
                <div>
                    <label>Shrinkage Tolerance (min / max)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input type="number" step="0.1" value={form.shrinkageToleranceMin} onChange={(e) => setForm({ ...form, shrinkageToleranceMin: Number(e.target.value) })} />
                        <input type="number" step="0.1" value={form.shrinkageToleranceMax} onChange={(e) => setForm({ ...form, shrinkageToleranceMax: Number(e.target.value) })} />
                    </div>
                </div>
                <button type="submit">Create Rule</button>
            </form>

            <h3>Existing Rules</h3>
            <ul>
                {rules.map((r) => (
                    <li key={r.id}>
                        Style: {styles.find((s) => s.id === r.styleId)?.code} | Width: {r.widthToleranceMin}..{r.widthToleranceMax} | Shrink: {r.shrinkageToleranceMin}..{r.shrinkageToleranceMax}
                    </li>
                ))}
            </ul>
        </div>
    );
}


