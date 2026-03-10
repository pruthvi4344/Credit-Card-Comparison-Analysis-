import { useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const BANKS = ['RBC', 'CIBC', 'TD', 'SCOTIA', 'BMO'];

export default function CrawlerPage() {
  const [phase, setPhase] = useState('idle');
  const [selectedBanks, setSelectedBanks] = useState(BANKS);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [err, setErr] = useState('');

  const toggleBank = (bank) => {
    setSelectedBanks((current) =>
      current.includes(bank)
        ? current.filter((item) => item !== bank)
        : [...current, bank]
    );
  };

  const start = async () => {
    setPhase('crawling');
    setErr('');
    setResults([]);
    setSummary(null);

    try {
      const data = await api.crawl(selectedBanks);
      const bankResults = Array.isArray(data?.results) ? data.results : [];

      setResults(bankResults);
      setSummary({
        message: data?.message || 'Crawl completed.',
        totalCards:
          data?.totalCards ??
          bankResults.reduce((sum, item) => sum + (item.cardCount || 0), 0),
      });
      setPhase('done');
    } catch (e) {
      setErr(e.message || 'Crawler request failed.');
      setPhase('error');
    }
  };

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Data Collection</div>
        <div className="page-title">Web Crawler</div>
        <div className="page-sub">Crawl supported bank sites and extract credit card listings</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Crawler Control</div>
        <div className="card-title">Start Crawling Session</div>
        <div className="card-desc">
          Uses Selenium with ChromeDriver to open official bank credit card pages and extract card
          names and detail links.
        </div>

        <div className="field">
          <label>Select banks</label>
          <div className="bank-grid">
            {BANKS.map((bank) => (
              <label className="bank-option" key={bank}>
                <input
                  type="checkbox"
                  checked={selectedBanks.includes(bank)}
                  onChange={() => toggleBank(bank)}
                />
                <span>{bank === 'SCOTIA' ? 'Scotia' : bank}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={start}
          disabled={phase === 'crawling' || selectedBanks.length === 0}
          style={{ marginBottom: 0 }}
        >
          {phase === 'crawling'
            ? <><span className="spinner-sm" /> Crawling in progress...</>
            : 'Start Crawling'}
        </button>

        <ErrorMessage message={err} />
      </div>

      {phase === 'crawling' && <Loader text="Crawling selected bank websites..." />}

      {phase === 'done' && (
        <div className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="section-lbl" style={{ margin: 0, flex: 1 }}>Crawl Results</div>
            <span className="badge badge-green">{results.length} banks processed</span>
          </div>

          {summary && (
            <div className="card mb-4">
              <div className="card-title">Session Summary</div>
              <div className="card-desc" style={{ marginBottom: 0 }}>
                {summary.message} Total cards extracted: {summary.totalCards}.
              </div>
            </div>
          )}

          {results.length === 0 ? (
            <div className="card">
              <div className="empty">
                <div className="empty-title">Crawl completed with no structured results</div>
                <div>Check ChromeDriver setup and the backend logs.</div>
              </div>
            </div>
          ) : (
            <div className="grid-auto">
              {results.map((bankResult) => (
                <div className="card" key={bankResult.bank}>
                  <div className="crawl-head">
                    <div className="card-title" style={{ marginBottom: 0 }}>
                      {bankResult.bank === 'SCOTIA' ? 'Scotia' : bankResult.bank}
                    </div>
                    <span className={`badge ${bankResult.status === 'SUCCESS' ? 'badge-green' : 'badge-red'}`}>
                      {bankResult.status || 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="card-desc">
                    {bankResult.pageTitle || bankResult.message || 'No page title returned'}
                  </div>

                  <div className="crawl-meta">
                    <span className="badge badge-cyan">{bankResult.cardCount || 0} cards</span>
                    <a className="url" href={bankResult.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {bankResult.sourceUrl}
                    </a>
                  </div>

                  <div className="divider" />

                  {Array.isArray(bankResult.cards) && bankResult.cards.length > 0 ? (
                    <div className="crawl-cards">
                      {bankResult.cards.slice(0, 8).map((card, index) => (
                        <div className="crawl-card-row" key={`${bankResult.bank}-${index}`}>
                          <span className="crawl-num">{index + 1}</span>
                          <div className="rank-row-info">
                            <div>{card.name || 'Unnamed card'}</div>
                            <a className="url" href={card.detailsUrl} target="_blank" rel="noopener noreferrer">
                              {card.detailsUrl}
                            </a>
                          </div>
                        </div>
                      ))}

                      {bankResult.cards.length > 8 && (
                        <div className="card-desc" style={{ marginBottom: 0 }}>
                          Showing first 8 cards of {bankResult.cards.length}.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="empty" style={{ padding: '24px 12px' }}>
                      <div>No cards extracted for this bank.</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
