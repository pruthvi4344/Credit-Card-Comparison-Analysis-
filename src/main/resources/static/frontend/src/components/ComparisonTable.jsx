function normalizeText(value) {
  return (value || '').trim() || 'N/A';
}

function summarizeBenefits(text) {
  if (!text) {
    return 'Benefits not available.';
  }

  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

export default function ComparisonTable({ cards }) {
  if (!cards.length) {
    return (
      <div className="card fade-up fade-up-2">
        <div className="empty">
          <div className="empty-title">No cards selected yet</div>
          <div>Select one to three cards above to unlock the comparison view.</div>
        </div>
      </div>
    );
  }

  const rows = [
    {
      label: 'Card',
      render: (card) => (
        <div className="compare-cell-stack compare-card-cell">
          <div className="compare-card-image-wrap">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.title} className="compare-card-image" loading="lazy" />
            ) : (
              <div className="catalog-image-fallback">No Image</div>
            )}
          </div>
          <div className="compare-card-name">{normalizeText(card.title)}</div>
          <div className="compare-card-bank">{normalizeText(card.bank)}</div>
        </div>
      ),
    },
    { label: 'Annual Fee', render: (card) => normalizeText(card.annualFees) },
    { label: 'Purchase Interest', render: (card) => normalizeText(card.purchaseInterestRate) },
    { label: 'Cash Interest', render: (card) => normalizeText(card.cashInterestRate) },
    { label: 'Value Proposition', render: (card) => <div className="compare-long-text">{normalizeText(card.productValueProp)}</div> },
    { label: 'Benefits', render: (card) => <div className="compare-long-text">{summarizeBenefits(card.productBenefits)}</div> },
    {
      label: 'Details',
      render: (card) => card.detailsUrl ? (
        <a className="btn btn-primary btn-sm" href={card.detailsUrl} target="_blank" rel="noopener noreferrer">
          View Card
        </a>
      ) : 'N/A',
    },
  ];

  return (
    <div className="card fade-up fade-up-2">
      <div className="card-label">Comparison Matrix</div>
      <div className="card-title">Side-By-Side Card Comparison</div>
      <div className="card-desc">
        Compare interest rates, annual fees, and benefits across the selected cards.
      </div>

      <div className="table-wrap compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Category</th>
              {cards.map((card, index) => (
                <th key={`${card.title}-${index}`}>{card.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="compare-row-label">{row.label}</td>
                {cards.map((card, index) => (
                  <td key={`${row.label}-${card.title}-${index}`}>{row.render(card)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
