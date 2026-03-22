function parseNumber(value) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const match = String(value).replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function getTextBlob(card) {
  return [card.title, card.productValueProp, card.productBenefits, card.bank]
    .join(' ')
    .toLowerCase();
}

function buildReasons(card, preferences) {
  const reasons = [];
  const blob = getTextBlob(card);
  const annualFee = parseNumber(card.annualFees);
  const purchaseRate = parseNumber(card.purchaseInterestRate);
  const cashRate = parseNumber(card.cashInterestRate);

  if (preferences.goal !== 'general' && blob.includes(preferences.goal)) {
    reasons.push(`Matches ${preferences.goal} goal`);
  }

  if (preferences.feeFocus === 'high' && Number.isFinite(annualFee)) {
    reasons.push(`Annual fee looks competitive at ${card.annualFees}`);
  }

  if (preferences.rateFocus === 'high' && (Number.isFinite(purchaseRate) || Number.isFinite(cashRate))) {
    reasons.push(`Interest profile is relatively strong for balance carrying`);
  }

  if (preferences.bankPreference && card.bank === preferences.bankPreference) {
    reasons.push(`Matches preferred bank ${card.bank}`);
  }

  if (!reasons.length) {
    reasons.push('Balanced option based on the available fee, rate, and benefit data');
  }

  return reasons.slice(0, 3);
}

function scoreCard(card, preferences) {
  let score = 50;
  const annualFee = parseNumber(card.annualFees);
  const purchaseRate = parseNumber(card.purchaseInterestRate);
  const cashRate = parseNumber(card.cashInterestRate);
  const blob = getTextBlob(card);

  if (preferences.goal !== 'general') {
    if (blob.includes(preferences.goal)) {
      score += 26;
    } else {
      score -= 6;
    }
  }

  if (preferences.feeFocus === 'high') {
    score += Number.isFinite(annualFee) ? Math.max(0, 24 - annualFee / 8) : 0;
  } else if (preferences.feeFocus === 'medium') {
    score += Number.isFinite(annualFee) ? Math.max(0, 14 - annualFee / 14) : 0;
  }

  if (preferences.rateFocus === 'high') {
    const rateAverage = [purchaseRate, cashRate].filter(Number.isFinite);
    if (rateAverage.length) {
      const avg = rateAverage.reduce((sum, value) => sum + value, 0) / rateAverage.length;
      score += Math.max(0, 28 - avg);
    }
  } else if (preferences.rateFocus === 'medium') {
    const rateAverage = [purchaseRate, cashRate].filter(Number.isFinite);
    if (rateAverage.length) {
      const avg = rateAverage.reduce((sum, value) => sum + value, 0) / rateAverage.length;
      score += Math.max(0, 14 - avg / 2);
    }
  }

  if (preferences.bankPreference && card.bank === preferences.bankPreference) {
    score += 12;
  }

  if (blob.includes('bonus') || blob.includes('reward') || blob.includes('cash back') || blob.includes('travel')) {
    score += 6;
  }

  return Math.round(score);
}

export default function RecommendationPanel({ cards, preferences, onChange }) {
  const goalOptions = [
    { value: 'general', label: 'General use' },
    { value: 'travel', label: 'Travel rewards' },
    { value: 'cashback', label: 'Cashback' },
    { value: 'student', label: 'Student card' },
    { value: 'business', label: 'Business spending' },
    { value: 'avion', label: 'Avion / premium points' },
  ];

  const bankOptions = ['Any bank', ...new Set(cards.map((card) => card.bank).filter(Boolean))];

  const ranked = [...cards]
    .map((card) => ({
      card,
      score: scoreCard(card, preferences),
      reasons: buildReasons(card, preferences),
    }))
    .sort((a, b) => b.score - a.score);

  const topPick = ranked[0];

  return (
    <div className="card mb-6 fade-up fade-up-2">
      <div className="card-label">Recommendation</div>
      <div className="card-title">Personalized Fit Check</div>
      <div className="card-desc">
        Tell us what matters most and we will rank the selected cards by fee, interest, and benefit fit.
      </div>

      <div className="grid-3 compare-preferences-grid">
        <div className="field">
          <label>Primary goal</label>
          <select value={preferences.goal} onChange={(e) => onChange({ ...preferences, goal: e.target.value })}>
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Low annual fee importance</label>
          <select value={preferences.feeFocus} onChange={(e) => onChange({ ...preferences, feeFocus: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label>Low interest importance</label>
          <select value={preferences.rateFocus} onChange={(e) => onChange({ ...preferences, rateFocus: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Preferred bank</label>
        <select
          value={preferences.bankPreference || 'Any bank'}
          onChange={(e) => onChange({
            ...preferences,
            bankPreference: e.target.value === 'Any bank' ? '' : e.target.value,
          })}
        >
          {bankOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {!cards.length ? (
        <div className="empty compare-empty-inline">
          <div className="empty-title">Recommendation unlocks after selection</div>
          <div>Select cards first so we have something meaningful to rank.</div>
        </div>
      ) : (
        <div className="compare-recommendation-layout">
          <div className="compare-top-pick">
            <div className="compare-top-pick-label">Top recommendation</div>
            <div className="compare-top-pick-title">{topPick.card.title}</div>
            <div className="compare-top-pick-meta">
              <span className="badge badge-green">Score {topPick.score}</span>
              <span className="badge badge-cyan">{topPick.card.bank || 'Bank'}</span>
            </div>
            <div className="compare-reasons">
              {topPick.reasons.map((reason) => (
                <div key={reason} className="compare-reason-item">{reason}</div>
              ))}
            </div>
          </div>

          <div className="compare-rank-list">
            {ranked.map(({ card, score, reasons }, index) => (
              <div key={`${card.title}-${index}`} className="compare-rank-row">
                <div className="compare-rank-order">#{index + 1}</div>
                <div className="compare-rank-content">
                  <div className="compare-rank-title">{card.title}</div>
                  <div className="compare-rank-reasons">{reasons.join(' | ')}</div>
                </div>
                <div className="compare-rank-score">{score}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
