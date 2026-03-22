import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function AllCardsPage() {
  const [cards, setCards] = useState([]);
  const [query, setQuery] = useState('');
  const [bank, setBank] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      setErr('');
      try {
        const data = await api.cards();
        setCards(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || 'Failed to load cards.');
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  const banks = useMemo(() => ['ALL', ...new Set(cards.map((card) => card.bank).filter(Boolean))], [cards]);

  const filteredCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesBank = bank === 'ALL' || card.bank === bank;
      const haystack = [
        card.title,
        card.bank,
        card.annualFees,
        card.purchaseInterestRate,
        card.productValueProp,
        card.productBenefits,
      ].join(' ').toLowerCase();

      return matchesBank && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [cards, bank, query]);

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Catalog</div>
        <div className="page-title">All Cards</div>
        <div className="page-sub">Browse every card currently available in the project dataset</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Card Directory</div>
        <div className="card-title">All Credit Cards</div>
        <div className="card-desc">
          Search by title, fees, benefits, or bank. Each card is shown with its image and quick details.
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Search cards</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. cashback, student, travel, annual fee..."
            />
          </div>

          <div className="field">
            <label>Bank filter</label>
            <select value={bank} onChange={(e) => setBank(e.target.value)}>
              {banks.map((item) => (
                <option key={item} value={item}>
                  {item === 'ALL' ? 'All Banks' : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="catalog-stats">
          <span className="badge badge-cyan">{cards.length} total cards</span>
          <span className="badge badge-green">{filteredCards.length} visible</span>
        </div>

        <ErrorMessage message={err} />
      </div>

      {loading && <Loader text="Loading all credit cards..." />}

      {!loading && !err && (
        filteredCards.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-title">No cards match this filter</div>
              <div>Try a different bank or search keyword.</div>
            </div>
          </div>
        ) : (
          <div className="catalog-grid fade-up">
            {filteredCards.map((card, index) => (
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
                  <p className="catalog-card-prop">
                    {card.productValueProp || 'No summary available for this card.'}
                  </p>

                  <div className="catalog-chip-row">
                    <span className="catalog-chip">Purchase {card.purchaseInterestRate || 'N/A'}</span>
                    <span className="catalog-chip">Cash {card.cashInterestRate || 'N/A'}</span>
                  </div>

                  <p className="catalog-card-benefits">
                    {card.productBenefits || 'Benefits not available.'}
                  </p>
                </div>

                <div className="catalog-card-footer">
                  <a
                    className="btn btn-primary btn-sm"
                    href={card.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Details
                  </a>
                </div>
              </article>
            ))}
          </div>
        )
      )}
    </div>
  );
}
