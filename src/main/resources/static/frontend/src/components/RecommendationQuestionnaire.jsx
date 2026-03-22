export default function RecommendationQuestionnaire({ preferences, onChange, onSubmit }) {
  return (
    <div className="card mb-6 fade-up fade-up-1">
      <div className="card-label">Questionnaire</div>
      <div className="card-title">Personalized Recommendations</div>
      <div className="card-desc">
        Answer a few questions so we can rank the credit cards that best match your needs.
      </div>

      <div className="grid-2 recommendation-form-grid">
        <div className="field">
          <label>Primary card use</label>
          <select
            value={preferences.goal}
            onChange={(e) => onChange({ ...preferences, goal: e.target.value })}
          >
            <option value="travel">Travel rewards</option>
            <option value="cashback">Cashback</option>
            <option value="student">Student spending</option>
            <option value="business">Business spending</option>
            <option value="everyday">Everyday purchases</option>
            <option value="avion">Premium rewards</option>
          </select>
        </div>

        <div className="field">
          <label>Preferred annual fee range</label>
          <select
            value={preferences.feeRange}
            onChange={(e) => onChange({ ...preferences, feeRange: e.target.value })}
          >
            <option value="free">Free ($0)</option>
            <option value="low">Low ($1-$99)</option>
            <option value="medium">Mid-range ($100-$199)</option>
            <option value="premium">Premium ($200+)</option>
            <option value="any">Any fee</option>
          </select>
        </div>

        <div className="field">
          <label>Importance of low interest</label>
          <select
            value={preferences.rateFocus}
            onChange={(e) => onChange({ ...preferences, rateFocus: e.target.value })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="field">
          <label>Preferred bank</label>
          <select
            value={preferences.bankPreference}
            onChange={(e) => onChange({ ...preferences, bankPreference: e.target.value })}
          >
            <option value="">Any bank</option>
            <option value="RBC">RBC</option>
            <option value="CIBC">CIBC</option>
            <option value="TD">TD</option>
            <option value="BMO">BMO</option>
            <option value="Scotiabank">Scotiabank</option>
          </select>
        </div>
      </div>

      <div className="recommendation-action-row">
        <button type="button" className="btn btn-cyan btn-lg" onClick={onSubmit}>
          Get My Recommendations
        </button>
      </div>
    </div>
  );
}
