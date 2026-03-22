import { useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const BANKS = ['RBC', 'CIBC', 'TD', 'SCOTIA', 'BMO'];
const BANK_LABELS = {
  RBC: 'RBC',
  CIBC: 'CIBC',
  TD: 'TD',
  SCOTIA: 'Scotia',
  BMO: 'BMO',
};

export default function CrawlerPage() {
  const [phase, setPhase] = useState('idle');
  const [selectedBank, setSelectedBank] = useState('RBC');
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState(null);
  const [err, setErr] = useState('');

  const start = async () => {
    setPhase('crawling');
    setErr('');
    setResult(null);
    setSummary(null);

    try {
      const data = await api.crawl([selectedBank]);
      const bankResult = Array.isArray(data?.results) ? data.results[0] : null;

      setResult(bankResult);
      setSummary({
        bank: selectedBank,
        message: bankResult?.status === 'SUCCESS'
          ? `Crawl completed for ${BANK_LABELS[selectedBank]}.`
          : data?.message || `Crawl finished for ${BANK_LABELS[selectedBank]}.`,
        totalCards: bankResult?.cardCount ?? data?.totalCards ?? 0,
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
        <div className="card-title">Single Bank Crawl</div>
        <div className="card-desc">
          Select one bank, run the crawler, then review only that bank's extracted card results.
        </div>

        <div className="field">
          <label>Select one bank</label>
          <div className="bank-grid single-bank-grid">
            {BANKS.map((bank) => (
              <label
                className={`bank-option single-bank-option${selectedBank === bank ? ' active' : ''}`}
                key={bank}
              >
                <input
                  type="radio"
                  name="selected-bank"
                  checked={selectedBank === bank}
                  onChange={() => setSelectedBank(bank)}
                />
                <span>{BANK_LABELS[bank]}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={start}
          disabled={phase === 'crawling' || !selectedBank}
          style={{ marginBottom: 0 }}
        >
          {phase === 'crawling'
            ? <><span className="spinner-sm" /> Crawling {BANK_LABELS[selectedBank]}...</>
            : `Start ${BANK_LABELS[selectedBank]} Crawl`}
        </button>

        <ErrorMessage message={err} />
      </div>

      {phase === 'crawling' && <Loader text={`Crawling ${BANK_LABELS[selectedBank]} website...`} />}

      {phase === 'done' && (
        <div className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="section-lbl" style={{ margin: 0, flex: 1 }}>Crawl Results</div>
            <span className="badge badge-green">1 bank processed</span>
          </div>

          {summary && (
            <div className="card mb-4">
              <div className="crawl-summary">
                <div>
                  <div className="card-title">Session Summary</div>
                  <div className="card-desc" style={{ marginBottom: 0 }}>
                    {summary.message}
                  </div>
                </div>
                <div className="crawl-summary-stats">
                  <span className="badge badge-cyan">{BANK_LABELS[summary.bank]}</span>
                  <span className="badge badge-green">{summary.totalCards} cards</span>
                </div>
              </div>
            </div>
          )}

          {!result ? (
            <div className="card">
              <div className="empty">
                <div className="empty-title">Crawl completed with no structured results</div>
                <div>Check ChromeDriver setup and the backend logs.</div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="crawl-head">
                <div>
                  <div className="card-title" style={{ marginBottom: 4 }}>
                    {BANK_LABELS[result.bank] || result.bank}
                  </div>
                  <div className="card-desc" style={{ marginBottom: 0 }}>
                    {result.pageTitle || result.message || 'No page title returned'}
                  </div>
                </div>
                <span className={`badge ${result.status === 'SUCCESS' ? 'badge-green' : 'badge-red'}`}>
                  {result.status || 'UNKNOWN'}
                </span>
              </div>

              <div className="crawl-meta-block">
                <div className="crawl-meta-pill">
                  <span className="crawl-meta-label">Source</span>
                  <a className="url" href={result.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {result.sourceUrl}
                  </a>
                </div>
                <div className="crawl-meta-pill">
                  <span className="crawl-meta-label">Extracted</span>
                  <span>{result.cardCount || 0} cards</span>
                </div>
              </div>

              <div className="divider" />

              {Array.isArray(result.cards) && result.cards.length > 0 ? (
                <div className="table-wrap crawl-results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Card Name</th>
                        <th>Annual Fee</th>
                        <th>Purchase Rate</th>
                        <th>Cash Rate</th>
                        <th>Value</th>
                        <th>Details URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.cards.map((card, index) => (
                        <tr key={`${result.bank}-${index}`}>
                          <td>{index + 1}</td>
                          <td>
                            {card.imageUrl ? (
                              <img
                                src={card.imageUrl}
                                alt={card.name || 'Card image'}
                                className="crawl-card-thumb"
                                loading="lazy"
                              />
                            ) : (
                              <span className="muted-mini">No image</span>
                            )}
                          </td>
                          <td>{card.name || 'Unnamed card'}</td>
                          <td>{card.annualFees || '-'}</td>
                          <td>{card.purchaseInterestRate || '-'}</td>
                          <td>{card.cashInterestRate || '-'}</td>
                          <td className="crawl-value-cell">{card.productValueProp || '-'}</td>
                          <td>
                            <a className="url" href={card.detailsUrl} target="_blank" rel="noopener noreferrer">
                              {card.detailsUrl}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty" style={{ padding: '24px 12px' }}>
                  <div>No cards extracted for this bank.</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
