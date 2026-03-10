import { useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const popular = ['cashback', 'rewards', 'travel', 'annual', 'interest', 'balance', 'credit', 'limit'];

export default function FrequencyPage() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = async (w) => {
    const t = (w || word).trim();
    if (!t) return;
    setWord(t); setLoading(true); setErr(''); setResult(null);
    try {
      const data = await api.frequency(t);
      const count = typeof data === 'number' ? data
        : data?.count ?? data?.frequency ?? data?.total ?? 0;
      const pages = Array.isArray(data?.pages) ? data.pages
        : data?.occurrences || data?.pageOccurrences || [];
      setResult({ word: t, count, pages });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const maxCount = result?.pages?.length
    ? Math.max(...result.pages.map(p => p.count || 0), 1)
    : 1;

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Analytics</div>
        <div className="page-title">Frequency Counter</div>
        <div className="page-sub">Word occurrence count across all indexed pages</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Word Query</div>
        <div className="card-title">Count Occurrences</div>
        <div className="card-desc">Enter any word to see how frequently it appears in crawled credit card content</div>
        <div className="input-row" style={{ marginBottom: 14 }}>
          <input
            type="text"
            value={word}
            onChange={e => setWord(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="e.g. cashback, rewards, APR..."
          />
          <button className="btn btn-primary" onClick={() => run()} disabled={loading || !word.trim()}>
            {loading ? <><span className="spinner-sm" /> Counting</> : '◈  Count'}
          </button>
        </div>

        <div>
          <div style={{ fontSize:11, color:'var(--text-400)', marginBottom:8, fontFamily:'var(--font-mono)', letterSpacing:'0.5px' }}>
            POPULAR TERMS →
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {popular.map(p => (
              <button key={p} className="btn btn-secondary btn-sm"
                style={{ fontFamily:'var(--font-mono)', fontSize:12 }}
                onClick={() => run(p)}>{p}</button>
            ))}
          </div>
        </div>
        <ErrorMessage message={err} />
      </div>

      {loading && <Loader text="Counting occurrences..." />}

      {!loading && result && (
        <div className="fade-up">
          <div className="stat-grid" style={{ marginBottom:20 }}>
            <div className="stat-card green">
              <div className="stat-val green">{result.count.toLocaleString()}</div>
              <div className="stat-lbl">Total Occurrences</div>
            </div>
            <div className="stat-card cyan">
              <div className="stat-val cyan">{result.pages.length || '—'}</div>
              <div className="stat-lbl">Pages Found</div>
            </div>
          </div>

          {result.pages.length > 0 && (
            <div className="card">
              <div className="card-label">Per-Page Breakdown</div>
              <div className="card-title" style={{ marginBottom:16 }}>
                Pages containing &ldquo;{result.word}&rdquo;
              </div>
              {result.pages.map((p, i) => {
                const cnt = p.count || 0;
                const pct = Math.round((cnt / maxCount) * 100);
                return (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                      <a className="url" href={p.url || p} target="_blank" rel="noopener noreferrer">
                        {p.url || p}
                      </a>
                      <span className="badge badge-green">{cnt}</span>
                    </div>
                    <div className="progress-wrap" style={{ width:'100%' }}>
                      <div className="progress-fill" style={{ width:`${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}