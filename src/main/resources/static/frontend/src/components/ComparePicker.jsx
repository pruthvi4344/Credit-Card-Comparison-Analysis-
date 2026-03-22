import { useMemo, useState } from 'react';

function formatCardLabel(card) {
  return `${card.title} (${card.bank || 'Bank'})`;
}

export default function ComparePicker({ cards, selectedCards, onChange }) {
  const [query, setQuery] = useState('');

  const selectedIds = useMemo(
    () => new Set(selectedCards.map((card) => `${card.title}::${card.bank}::${card.detailsUrl}`)),
    [selectedCards],
  );

  const filteredCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return cards.slice(0, 18);
    }

    return cards
      .filter((card) => [
        card.title,
        card.bank,
        card.productValueProp,
        card.productBenefits,
        card.annualFees,
      ].join(' ').toLowerCase().includes(normalized))
      .slice(0, 18);
  }, [cards, query]);

  const toggleCard = (card) => {
    const cardId = `${card.title}::${card.bank}::${card.detailsUrl}`;
    const exists = selectedIds.has(cardId);

    if (exists) {
      onChange(selectedCards.filter((item) => `${item.title}::${item.bank}::${item.detailsUrl}` !== cardId));
      return;
    }

    if (selectedCards.length >= 3) {
      return;
    }

    onChange([...selectedCards, card]);
  };

  return (
    <div className="card mb-6 fade-up fade-up-1">
      <div className="card-label">Selection</div>
      <div className="card-title">Choose Up To 3 Cards</div>
      <div className="card-desc">
        Search the CSV catalog and select up to three cards to compare side by side.
      </div>

      <div className="field">
        <label>Search catalog</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, bank, fee, benefit, or reward type..."
        />
      </div>

      <div className="compare-selection-bar">
        <span className="badge badge-cyan">{selectedCards.length}/3 selected</span>
        {selectedCards.length >= 3 && (
          <span className="badge badge-amber">Maximum reached</span>
        )}
      </div>

      {selectedCards.length > 0 && (
        <div className="compare-picked-list">
          {selectedCards.map((card, index) => (
            <button
              key={`${card.title}-${card.bank}-${index}`}
              type="button"
              className="compare-picked-chip"
              onClick={() => toggleCard(card)}
            >
              <span>{formatCardLabel(card)}</span>
              <span className="compare-picked-remove">Remove</span>
            </button>
          ))}
        </div>
      )}

      <div className="compare-picker-grid">
        {filteredCards.map((card, index) => {
          const cardId = `${card.title}::${card.bank}::${card.detailsUrl}`;
          const active = selectedIds.has(cardId);
          const disabled = !active && selectedCards.length >= 3;

          return (
            <button
              key={`${cardId}-${index}`}
              type="button"
              className={`compare-picker-card ${active ? 'active' : ''}`}
              onClick={() => toggleCard(card)}
              disabled={disabled}
            >
              <div className="compare-picker-head">
                <span className="badge badge-cyan">{card.bank || 'Bank'}</span>
                <span className="badge badge-green">{card.annualFees || 'Fee N/A'}</span>
              </div>
              <div className="compare-picker-title">{card.title}</div>
              <div className="compare-picker-meta">
                <span>Purchase {card.purchaseInterestRate || 'N/A'}</span>
                <span>Cash {card.cashInterestRate || 'N/A'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
