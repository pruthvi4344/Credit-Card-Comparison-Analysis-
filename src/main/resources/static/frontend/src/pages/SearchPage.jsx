import { useState } from 'react';
import api from '../services/api.js';
import SearchBox from '../components/SearchBox.jsx';
import ResultsTable from '../components/ResultsTable.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const normalize = (item) => {
  if (typeof item === 'string') return { url: item, snippet: '', score: '' };
  return {
    url: item.url || item.page || item.link || '',
    snippet: item.snippet || item.content || item.description || item.text || '',
    score: item.score ?? item.rank ?? item.relevance ?? '',
  };
};

const cols = [
  {
    key: '_rank', label: '#',
    render: (_, __, i) => (
      <span className={`rank ${['rank-1','rank-2','rank-3'][i] || 'rank-n'}`}>{i + 1}</span>
    ),
  },
  {
    key: 'url', label: 'Page URL',
    render: (v) => <a className="url" href={v} target="_blank" rel="noopener noreferrer">{v || '—'}</a>,
  },
  { key: 'snippet', label: 'Snippet' },
  {
    key: 'score', label: 'Score',
    render: (v) => v !== '' ? <span className="badge badge-green">{v}</span> : '—',
  },
];

export default function SearchPage() {
  const [kw, setKw] = useState('');
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const search = async () => {
    if (!kw.trim()) return;
    setLoading(true); setErr(''); setRows(null);
    try {
      const data = await api.search(kw);
      const list = Array.isArray(data)
        ? data
        : data?.results || data?.pages || data?.urls || [];
      setRows(list.map(n => ({ ...normalize(n), _rank: null })));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Inverted Index</div>
        <div className="page-title">Keyword Search</div>
        <div className="page-sub">Fast full-text search across all crawled and indexed pages</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Search Interface</div>
        <div className="card-title">Enter a Keyword</div>
        <div className="card-desc">Search through the inverted index built from crawled pages</div>
        <SearchBox
          value={kw}
          onChange={setKw}
          onSearch={search}
          placeholder="e.g. cashback, annual fee, travel rewards..."
          loading={loading}
          btnLabel="⌕  Search"
        />
        <ErrorMessage message={err} />
      </div>

      {loading && <Loader text="Searching index..." />}

      {!loading && rows !== null && (
        <div className="fade-up">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div className="section-lbl" style={{ margin:0, flex:1 }}>Results for &ldquo;{kw}&rdquo;</div>
            <span className="badge badge-cyan">{rows.length} found</span>
          </div>
          <ResultsTable columns={cols} rows={rows} />
        </div>
      )}
    </div>
  );
}