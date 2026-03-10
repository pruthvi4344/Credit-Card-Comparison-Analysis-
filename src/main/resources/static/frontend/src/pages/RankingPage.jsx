import { useState } from 'react';
import api from '../services/api.js';
import SearchBox from '../components/SearchBox.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const normalize = (item) => {
  if (typeof item === 'string') return { url: item, score: '', occurrences: '' };
  return {
    url: item.url || item.page || item.link || '',
    score: item.score ?? item.rank ?? item.relevance ?? '',
    occurrences: item.occurrences ?? item.count ?? item.frequency ?? '',
  };
};

const rankClass = (i) => ['rank-1','rank-2','rank-3'][i] || 'rank-n';

export default function RankingPage() {
  const [kw, setKw] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!kw.trim()) return;
    setLoading(true); setErr(''); setResults(null);
    try {
      const data = await api.rank(kw);
      const list = Array.isArray(data) ? data
        : data?.rankings || data?.pages || data?.results || [];
      setResults(list.map(normalize));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const maxScore = results ? Math.max(...results.map(r => Number(r.score) || 0), 1) : 1;

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Analytics — TF-IDF / Page Score</div>
        <div className="page-title">Page Ranking</div>
        <div className="page-sub">Rank indexed pages by keyword relevance and occurrence score</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Ranking Query</div>
        <div className="card-title">Enter a Keyword to Rank</div>
        <div className="card-desc">Pages are scored and sorted by relevance for the given keyword</div>
        <SearchBox
          value={kw}
          onChange={setKw}
          onSearch={run}
          placeholder="e.g. cashback, APR, annual fee..."
          loading={loading}
          btnLabel="▲  Rank"
        />
        <ErrorMessage message={err} />
      </div>

      {loading && <Loader text="Ranking pages..." />}

      {!loading && results !== null && (
        <div className="fade-up">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div className="section-lbl" style={{ margin:0, flex:1 }}>Rankings for &ldquo;{kw}&rdquo;</div>
            <span className="badge badge-cyan">{results.length} pages</span>
          </div>

          {results.length === 0 ? (
            <div className="card">
              <div className="empty">
                <div className="empty-icon">▲</div>
                <div className="empty-title">No ranked pages found</div>
                <div>Try a different keyword or crawl first</div>
              </div>
            </div>
          ) : (
            results.map((r, i) => {
              const pct = r.score ? Math.round((Number(r.score) / maxScore) * 100) : null;
              return (
                <div className="rank-row" key={i}>
                  <span className={`rank ${rankClass(i)}`} style={{ width:36, height:36 }}>{i + 1}</span>
                  <div className="rank-row-info">
                    <a className="url" href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ maxWidth:'100%', marginBottom: pct !== null ? 8 : 0, display:'block' }}>
                      {r.url || '—'}
                    </a>
                    {pct !== null && (
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="progress-wrap" style={{ width:180 }}>
                          <div className="progress-fill" style={{ width:`${pct}%` }} />
                        </div>
                        <span style={{ fontSize:11, color:'var(--text-400)', fontFamily:'var(--font-mono)' }}>
                          Score: {r.score}
                        </span>
                      </div>
                    )}
                  </div>
                  {r.occurrences !== '' && (
                    <div className="rank-row-score">
                      <div className="score-val">{r.occurrences}</div>
                      <div className="score-lbl">Hits</div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}