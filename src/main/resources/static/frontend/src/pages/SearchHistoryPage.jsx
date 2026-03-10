import { useState, useEffect } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const normalize = (item) => {
  if (typeof item === 'string') return { word: item, count: 1 };
  return {
    word: item.word || item.keyword || item.term || item.query || '',
    count: item.count || item.frequency || item.searches || item.total || 0,
  };
};

export default function SearchHistoryPage() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true); setErr('');
    try {
      const data = await api.searchFrequency();
      const list = Array.isArray(data)
        ? data
        : data?.history || data?.searches || data?.keywords ||
          (data && typeof data === 'object'
            ? Object.entries(data).map(([word, count]) => ({ word, count }))
            : []);
      setHistory(list.map(normalize).sort((a, b) => b.count - a.count));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const max = history ? Math.max(...history.map(h => h.count), 1) : 1;

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Analytics</div>
        <div className="page-title">Search History</div>
        <div className="page-sub">All searched keywords with cumulative frequency counts</div>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }} className="fade-up fade-up-1">
        <button className="btn btn-primary" onClick={load} disabled={loading}>
          {loading ? <><span className="spinner-sm" /> Refreshing</> : '↻  Refresh'}
        </button>
        {history && <span className="badge badge-cyan" style={{ alignSelf:'center' }}>{history.length} entries</span>}
      </div>

      <ErrorMessage message={err} />
      {loading && <Loader text="Loading search history..." />}

      {!loading && history !== null && (
        history.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-icon">◷</div>
              <div className="empty-title">No search history yet</div>
              <div>Start searching keywords to populate this view</div>
            </div>
          </div>
        ) : (
          <div className="card fade-up" style={{ padding:0 }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width:50 }}>#</th>
                  <th>Keyword</th>
                  <th style={{ width:100 }}>Searches</th>
                  <th>Frequency Bar</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => {
                  const pct = Math.round((item.count / max) * 100);
                  return (
                    <tr key={i}>
                      <td>
                        <span className={`rank ${['rank-1','rank-2','rank-3'][i] || 'rank-n'}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text-100)' }}>
                          {item.word}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-green">{item.count}</span>
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div className="progress-wrap">
                            <div className="progress-fill" style={{ width:`${pct}%` }} />
                          </div>
                          <span style={{ fontSize:11, color:'var(--text-400)', fontFamily:'var(--font-mono)', width:32 }}>
                            {pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}