import { useState } from 'react';
import api from '../services/api.js';
import SearchBox from '../components/SearchBox.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const normalize = (item) => ({
  cardName: item.cardName || item.title || item.name || '',
  bank: item.bank || '',
  occurrences: item.occurrences ?? item.count ?? item.frequency ?? 0,
  applyUrl: item.applyUrl || item.detailsUrl || item.url || '',
  annualFees: item.annualFees || '',
});

export default function RankingPage() {
  const [kw, setKw] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!kw.trim()) {
      setErr('Please enter a keyword to rank.');
      setResults(null);
      return;
    }
    setLoading(true);
    setErr('');
    setResults(null);
    try {
      const data = await api.rank(kw);
      const list = Array.isArray(data) ? data : data?.rankings || data?.results || [];
      setResults(list.map(normalize));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Analytics - Keyword Score</div>
        <div className="page-title">Page Ranking</div>
        <div className="page-sub">Rank credit cards by keyword occurrences across the catalog dataset.</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Ranking Query</div>
        <div className="card-title">Rank Cards By Keyword</div>
        <div className="card-desc">Enter a keyword like `rbc`, `travel`, `cashback`, or `student` to rank matching cards.</div>
        <SearchBox
          value={kw}
          onChange={setKw}
          onSearch={run}
          placeholder="e.g. rbc, travel, cashback..."
          loading={loading}
          btnLabel="Rank Cards"
        />
        <ErrorMessage message={err} />
      </div>

      {loading && <Loader text="Ranking cards..." />}

      {!loading && results !== null && (
        <div className="card fade-up fade-up-2">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div className="card-label">Ranked Results</div>
              <div className="card-title" style={{ marginBottom: 0 }}>Cards matching "{kw}"</div>
            </div>
            <span className="badge badge-cyan">{results.length} cards</span>
          </div>

          {results.length === 0 ? (
            <div className="empty" style={{ padding: '30px 0' }}>
              <div className="empty-title">No ranked cards found</div>
              <div>Try another keyword from the card names, benefits, or value propositions.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Card Name</th>
                    <th>Bank</th>
                    <th>Occurrences</th>
                    <th>Annual Fee</th>
                    <th>Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, index) => (
                    <tr key={`${item.cardName}-${index}`}>
                      <td>{index + 1}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ color: 'var(--text-100)', fontWeight: 600 }}>{item.cardName}</span>
                        </div>
                      </td>
                      <td>{item.bank || 'N/A'}</td>
                      <td>
                        <span className="badge badge-cyan">{item.occurrences}</span>
                      </td>
                      <td>{item.annualFees || 'N/A'}</td>
                      <td>
                        {item.applyUrl ? (
                          <a
                            className="btn btn-cyan btn-sm"
                            href={item.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Apply
                          </a>
                        ) : (
                          <span className="muted-mini">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
