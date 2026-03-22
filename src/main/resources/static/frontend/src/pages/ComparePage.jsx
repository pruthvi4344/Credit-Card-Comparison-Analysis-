import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ComparePicker from '../components/ComparePicker.jsx';
import ComparisonTable from '../components/ComparisonTable.jsx';

export default function ComparePage() {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
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
        setErr(e.message || 'Failed to load cards for comparison.');
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Decision Support</div>
        <div className="page-title">Card Comparison</div>
        <div className="page-sub">
          Select up to three cards and compare their fees, rates, and benefits side by side.
        </div>
      </div>

      <div className="stat-grid fade-up fade-up-1 compare-stat-grid">
        <div className="stat-card green">
          <div className="stat-val green">3</div>
          <div className="stat-lbl">Card Limit</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-val cyan">{selectedCards.length}</div>
          <div className="stat-lbl">Selected Now</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-val amber">CSV</div>
          <div className="stat-lbl">Data Source</div>
        </div>
      </div>

      <ErrorMessage message={err} />
      {loading && <Loader text="Loading card catalog for comparison..." />}

      {!loading && !err && (
        <>
          <ComparePicker cards={cards} selectedCards={selectedCards} onChange={setSelectedCards} />
          <ComparisonTable cards={selectedCards} />
        </>
      )}
    </div>
  );
}
