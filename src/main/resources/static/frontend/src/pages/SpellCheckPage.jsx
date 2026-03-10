import { useState } from 'react';
import api from '../services/api.js';
import SuggestionList from '../components/SuggestionList.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';

const examples = ['travle', 'intrest', 'credt', 'rewrds', 'balanc', 'anual', 'transfr'];

export default function SpellCheckPage() {
  const [word, setWord] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [checked, setChecked] = useState('');

  const check = async (w) => {
    const target = (w || word).trim();
    if (!target) return;
    setWord(target);
    setLoading(true); setErr(''); setSuggestions(null); setChecked(target);
    try {
      const data = await api.spellCheck(target);
      const list = Array.isArray(data)
        ? data
        : data?.suggestions || data?.corrections || (typeof data === 'string' ? [data] : []);
      setSuggestions(list);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">NLP — Edit Distance</div>
        <div className="page-title">Spell Checker</div>
        <div className="page-sub">Suggest corrections using Levenshtein distance algorithm</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Input</div>
        <div className="card-title">Check a Word</div>
        <div className="card-desc">Enter a misspelled word to receive ranked correction suggestions</div>
        <div className="input-row" style={{ marginBottom: 14 }}>
          <input
            type="text"
            value={word}
            onChange={e => setWord(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="e.g. travle, intrest..."
            autoFocus
          />
          <button className="btn btn-primary" onClick={() => check()} disabled={loading || !word.trim()}>
            {loading ? <><span className="spinner-sm" /> Checking</> : '✓  Check'}
          </button>
        </div>

        <div>
          <div style={{ fontSize:11, color:'var(--text-400)', marginBottom:8, fontFamily:'var(--font-mono)', letterSpacing:'0.5px' }}>
            TRY AN EXAMPLE →
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {examples.map(ex => (
              <button key={ex} className="btn btn-secondary btn-sm" onClick={() => check(ex)}
                style={{ fontFamily:'var(--font-mono)', fontSize:12 }}>
                {ex}
              </button>
            ))}
          </div>
        </div>
        <ErrorMessage message={err} />
      </div>

      {loading && <Loader text="Computing edit distances..." />}

      {!loading && suggestions !== null && (
        <div className="card fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ flex:1 }}>
              <div className="card-label">Results</div>
              <div className="card-title" style={{ marginBottom:0 }}>
                Suggestions for &ldquo;<span style={{ color:'var(--red)', fontFamily:'var(--font-mono)' }}>{checked}</span>&rdquo;
              </div>
            </div>
            <span className="badge badge-cyan">{suggestions.length} suggestions</span>
          </div>

          <div className="section-lbl">Ranked Corrections</div>
          <SuggestionList
            items={suggestions}
            onSelect={s => { setWord(s); setSuggestions(null); }}
            empty="No corrections found — word may already be correct"
          />
        </div>
      )}
    </div>
  );
}