import { useState, useRef } from 'react';
import api from '../services/api.js';
import SuggestionList from '../components/SuggestionList.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function WordCompletionPage() {
  const [prefix, setPrefix] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const debounce = useRef(null);

  const fetch = async (val) => {
    if (!val || val.length < 2) { setSuggestions(null); return; }
    setLoading(true); setErr('');
    try {
      const data = await api.complete(val);
      const list = Array.isArray(data)
        ? data
        : data?.completions || data?.suggestions || data?.words || [];
      setSuggestions(list);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setPrefix(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetch(v), 320);
  };

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">NLP — Trie / Prefix Tree</div>
        <div className="page-title">Word Completion</div>
        <div className="page-sub">Autocomplete vocabulary prefix queries in real time</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Autocomplete</div>
        <div className="card-title">Type a Prefix</div>
        <div className="card-desc">
          Suggestions appear automatically after 2 characters — powered by the crawled vocabulary index
        </div>
        <div style={{ position:'relative' }}>
          <input
            type="text"
            value={prefix}
            onChange={handleChange}
            placeholder="e.g. cas, tra, rew, ann..."
            autoFocus
            autoComplete="off"
            spellCheck={false}
            style={{ paddingRight: 40 }}
          />
          {loading && (
            <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)' }}>
              <span className="spinner-sm" />
            </span>
          )}
        </div>
        <ErrorMessage message={err} />
      </div>

      {!loading && suggestions !== null && prefix.length >= 2 && (
        <div className="card fade-up">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <div className="card-label">Completions</div>
              <div className="card-title" style={{ marginBottom:0 }}>
                Words starting with &ldquo;<span style={{ color:'var(--cyan)', fontFamily:'var(--font-mono)' }}>{prefix}</span>&rdquo;
              </div>
            </div>
            <span className="badge badge-cyan">{suggestions.length}</span>
          </div>
          <SuggestionList
            items={suggestions}
            onSelect={s => setPrefix(s)}
            empty="No completions found for this prefix"
          />
        </div>
      )}

      {prefix.length < 2 && (
        <div className="card" style={{ textAlign:'center' }}>
          <div className="empty">
            <div className="empty-icon">◌</div>
            <div className="empty-title">Start typing to see completions</div>
            <div>Minimum 2 characters required</div>
          </div>
        </div>
      )}
    </div>
  );
}