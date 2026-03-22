import { useState } from 'react';
import api from '../services/api.js';
import SearchBox from '../components/SearchBox.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function SearchPage() {
  const [kw, setKw] = useState('');
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const search = async () => {
    if (!kw.trim()) return;
    setLoading(true);
    setErr('');
    setRows(null);
    try {
      const data = await api.search(kw);
      const list = Array.isArray(data) ? data : data?.results || [];
      setRows(list);
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
        <div className="page-sub">Search the indexed card catalog and return full card results</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Search Interface</div>
        <div className="card-title">Inverse Page Index Search</div>
        <div className="card-desc">Enter a keyword like `gold`, `travel`, `cashback`, or `visa`.</div>
        <SearchBox
          value={kw}
          onChange={setKw}
          onSearch={search}
          placeholder="e.g. gold, travel, cashback..."
          loading={loading}
          btnLabel="Search"
        />
        <ErrorMessage message={err} />
      </div>

      {loading && <Loader text="Searching index..." />}

      {!loading && rows !== null && (
        <div className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="section-lbl" style={{ margin: 0, flex: 1 }}>Results for "{kw}"</div>
            <span className="badge badge-cyan">{rows.length} found</span>
          </div>

          {rows.length === 0 ? (
            <div className="card">
              <div className="empty">
                <div className="empty-title">No matching cards found</div>
                <div>Try another keyword from card titles or benefits.</div>
              </div>
            </div>
          ) : (
            <div className="catalog-grid fade-up">
              {rows.map((card, index) => (
                <article className="catalog-card" key={`${card.title}-${index}`}>
                  <div className="catalog-card-top">
                    <span className="badge badge-cyan">{card.bank || 'Bank'}</span>
                    <span className="badge badge-green">{card.annualFees || 'Fee N/A'}</span>
                  </div>

                  <div className="catalog-image-wrap">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="catalog-card-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="catalog-image-fallback">No Image</div>
                    )}
                  </div>

                  <div className="catalog-card-body">
                    <h3 className="catalog-card-title">{card.title}</h3>
                    <div className="catalog-chip-row">
                      <span className="catalog-chip">Annual Fee: {card.annualFees || 'N/A'}</span>
                      <span className="catalog-chip">Purchase: {card.purchaseInterestRate || 'N/A'}</span>
                      <span className="catalog-chip">Cash: {card.cashInterestRate || 'N/A'}</span>
                    </div>
                    <p className="catalog-card-benefits">
                      <strong>Benefit:</strong> {card.productValueProp || card.productBenefits || 'No summary available.'}
                    </p>
                  </div>

                  <div className="catalog-card-footer">
                    <a
                      className="btn btn-primary btn-sm"
                      href={card.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Card
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
