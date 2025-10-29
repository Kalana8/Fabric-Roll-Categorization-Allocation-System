import React, { useEffect, useState } from 'react';

type Rule = { id: string };
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export function Categorization() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [ruleId, setRuleId] = useState('');
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const r = await fetch(`${API}/rules`).then((res) => res.json());
            setRules(r);
            if (r.length) setRuleId(r[0].id);
        })();
    }, []);

    const run = async () => {
        const res = await fetch(`${API}/categorize`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ruleId }) });
        setResult(await res.json());
    };

    return (
        <div>
            <h2>Categorization</h2>
            <div style={{ display: 'flex', gap: 8 }}>
                <select value={ruleId} onChange={(e) => setRuleId(e.target.value)}>
                    {rules.map((r) => (
                        <option key={r.id} value={r.id}>{r.id}</option>
                    ))}
                </select>
                <button onClick={run}>Run Categorization</button>
            </div>
            {result && (
                <pre style={{ background: '#f6f8fa', padding: 12, marginTop: 12 }}>{JSON.stringify(result, null, 2)}</pre>
            )}
        </div>
    );
}


