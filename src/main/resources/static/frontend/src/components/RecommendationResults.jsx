function feeValue(value) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }
  const match = String(value).replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function rateValue(value) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }
  const match = String(value).replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function feeMatches(range, fee) {
  if (range === 'any' || !Number.isFinite(fee)) {
    return true;
  }
  if (range === 'free') {
    return fee === 0;
  }
  if (range === 'low') {
    return fee > 0 && fee < 100;
  }
  if (range === 'medium') {
    return fee >= 100 && fee < 200;
  }
  if (range === 'premium') {
    return fee >= 200;
  }
  return true;
}

function scoreCard(card, preferences) {
  const textBlob = [
    card.title,
    card.productValueProp,
    card.productBenefits,
    card.bank,
  ].join(' ').toLowerCase();

  const fee = feeValue(card.annualFees);
  const purchaseRate = rateValue(card.purchaseInterestRate);
  const cashRate = rateValue(card.cashInterestRate);
  let score = 40;

  if (preferences.goal && textBlob.includes(preferences.goal)) {
    score += 30;
  }

  if (preferences.bankPreference && card.bank === preferences.bankPreference) {
    score += 14;
  }

  if (feeMatches(preferences.feeRange, fee)) {
    score += 20;
  } else if (preferences.feeRange !== 'any') {
    score -= 10;
  }

  if (preferences.rateFocus === 'high') {
    if (Number.isFinite(purchaseRate)) {
      score += Math.max(0, 18 - purchaseRate);
    }
    if (Number.isFinite(cashRate)) {
      score += Math.max(0, 18 - cashRate / 1.5);
    }
  } else if (preferences.rateFocus === 'medium') {
    if (Number.isFinite(purchaseRate)) {
      score += Math.max(0, 12 - purchaseRate / 2);
    }
  }

  if (textBlob.includes('travel') || textBlob.includes('reward') || textBlob.includes('cash back') || textBlob.includes('student')) {
    score += 6;
  }

  return Math.round(score);
}

function buildReason(card, preferences) {
  const reasons = [];
  const textBlob = [card.title, card.productValueProp, card.productBenefits].join(' ').toLowerCase();

  if (preferences.goal && textBlob.includes(preferences.goal)) {
    reasons.push(`Strong match for ${preferences.goal} usage`);
  }
  if (preferences.bankPreference && card.bank === preferences.bankPreference) {
    reasons.push(`From preferred bank ${card.bank}`);
  }
  if (feeMatches(preferences.feeRange, feeValue(card.annualFees))) {
    reasons.push(`Fee fits ${preferences.feeRange} preference`);
  }
  if (preferences.rateFocus !== 'low' && Number.isFinite(rateValue(card.purchaseInterestRate))) {
    reasons.push(`Purchase rate listed at ${card.purchaseInterestRate}`);
  }

  return reasons.slice(0, 2);
}

export default function RecommendationResults({ results, preferences, generated }) {
  if (!generated) {
    return (
      <div className="card fade-up fade-up-2">
        <div className="empty">
          <div className="empty-title">Recommendations will appear here</div>
          <div>Submit the questionnaire to generate your top card matches.</div>
        </div>
      </div>
    );
  }

  const rankedResults = [...results]
    .map((card) => ({
      card,
      score: scoreCard(card, preferences),
      reasons: buildReason(card, preferences),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="fade-up fade-up-3">
      <div className="section-lbl">Recommended Cards</div>
      <div className="recommendation-grid">
        {rankedResults.map(({ card, score, reasons }, index) => (
          <article className="recommendation-card" key={`${card.title}-${index}`}>
            <div className="recommendation-rank-bar">
              <span>Recommendation #{index + 1}</span>
              <span className="badge badge-green">Score {score}</span>
            </div>

            <div className="recommendation-image-wrap">
              {card.imageUrl ? (
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="recommendation-image"
                  loading="lazy"
                />
              ) : (
                <div className="catalog-image-fallback">No Image</div>
              )}
            </div>

            <div className="recommendation-body">
              <h3 className="recommendation-title">{card.title}</h3>

              <div className="recommendation-meta-row">
                <span className="badge badge-cyan">{card.bank || 'Bank'}</span>
                <span className="badge badge-green">{card.annualFees || 'Fee N/A'}</span>
              </div>

              <div className="catalog-chip-row">
                <span className="catalog-chip">Purchase {card.purchaseInterestRate || 'N/A'}</span>
                <span className="catalog-chip">Cash {card.cashInterestRate || 'N/A'}</span>
              </div>

              <div className="recommendation-benefit">
                {card.productBenefits || card.productValueProp || 'No benefit summary available.'}
              </div>

              {reasons.length > 0 && (
                <div className="recommendation-reasons">
                  {reasons.map((reason) => (
                    <span key={reason} className="badge badge-cyan">{reason}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
