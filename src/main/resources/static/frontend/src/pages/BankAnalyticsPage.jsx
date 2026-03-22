import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

export default function BankAnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [sortBy, setSortBy] = useState('cardCount');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setErr('');
      try {
        const data = await api.bankAnalytics();
        setSummary(data);
      } catch (e) {
        setErr(e.message || 'Failed to load bank analytics.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const banks = useMemo(() => {
    const list = Array.isArray(summary?.banks) ? [...summary.banks] : [];
    return list.sort((a, b) => {
      if (sortBy === 'bank') {
        return (a.bank || '').localeCompare(b.bank || '');
      }
      return Number(b[sortBy] || 0) - Number(a[sortBy] || 0);
    });
  }, [summary, sortBy]);

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Analytics</div>
        <div className="page-title">Bank Analytics Dashboard</div>
        <div className="page-sub">See card volume, fee averages, rate averages, and dominant card categories by bank.</div>
      </div>

      <ErrorMessage message={err} />
      {loading && <Loader text="Computing bank analytics from CSV data..." />}

      {!loading && !err && summary && (
        <>
          <div className="stat-grid fade-up fade-up-1 analytics-stat-grid">
            <div className="stat-card green">
              <div className="stat-val green">{summary.totalBanks}</div>
              <div className="stat-lbl">Banks</div>
            </div>
            <div className="stat-card cyan">
              <div className="stat-val cyan">{summary.totalCards}</div>
              <div className="stat-lbl">Cards</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-val amber">{formatMoney(summary.averageAnnualFeeAcrossBanks)}</div>
              <div className="stat-lbl">Avg Fee</div>
            </div>
            <div className="stat-card green">
              <div className="stat-val green">{formatPercent(summary.averagePurchaseRateAcrossBanks)}</div>
              <div className="stat-lbl">Avg Purchase Rate</div>
            </div>
          </div>

          <div className="card mb-6 fade-up fade-up-2">
            <div className="card-label">Breakdown</div>
            <div className="card-title">Per-Bank Metrics</div>
            <div className="card-desc">Sort the banks to compare card inventory, annual fee patterns, and rate positioning.</div>

            <div className="analytics-toolbar">
              <div className="field analytics-sort-field">
                <label>Sort by</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="cardCount">Card count</option>
                  <option value="averageAnnualFee">Average annual fee</option>
                  <option value="averagePurchaseRate">Average purchase rate</option>
                  <option value="premiumCardCount">Premium cards</option>
                  <option value="freeCardCount">Free cards</option>
                  <option value="bank">Bank name</option>
                </select>
              </div>
            </div>

            <div className="analytics-grid">
              {banks.map((bank) => (
                <article key={bank.bank} className="analytics-card">
                  <div className="analytics-card-head">
                    <div>
                      <div className="analytics-card-title">{bank.bank}</div>
                      <div className="analytics-card-sub">Top category: {bank.mostCommonCategory}</div>
                    </div>
                    <span className="badge badge-cyan">{bank.cardCount} cards</span>
                  </div>

                  <div className="analytics-metric-grid">
                    <div className="analytics-metric">
                      <span className="analytics-metric-label">Avg annual fee</span>
                      <span className="analytics-metric-value">{formatMoney(bank.averageAnnualFee)}</span>
                    </div>
                    <div className="analytics-metric">
                      <span className="analytics-metric-label">Avg purchase rate</span>
                      <span className="analytics-metric-value">{formatPercent(bank.averagePurchaseRate)}</span>
                    </div>
                    <div className="analytics-metric">
                      <span className="analytics-metric-label">Avg cash rate</span>
                      <span className="analytics-metric-value">{formatPercent(bank.averageCashRate)}</span>
                    </div>
                    <div className="analytics-metric">
                      <span className="analytics-metric-label">Free cards</span>
                      <span className="analytics-metric-value">{bank.freeCardCount}</span>
                    </div>
                    <div className="analytics-metric">
                      <span className="analytics-metric-label">Premium cards</span>
                      <span className="analytics-metric-value">{bank.premiumCardCount}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
