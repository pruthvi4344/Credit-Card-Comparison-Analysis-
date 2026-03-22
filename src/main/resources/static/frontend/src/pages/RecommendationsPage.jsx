import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import RecommendationQuestionnaire from '../components/RecommendationQuestionnaire.jsx';
import RecommendationResults from '../components/RecommendationResults.jsx';

const defaultPreferences = {
  goal: 'travel',
  feeRange: 'free',
  rateFocus: 'high',
  bankPreference: '',
};

export default function RecommendationsPage() {
  const [cards, setCards] = useState([]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [generated, setGenerated] = useState(false);
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
        setErr(e.message || 'Failed to load cards for recommendations.');
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (preferences.bankPreference && card.bank !== preferences.bankPreference) {
        return false;
      }
      return true;
    });
  }, [cards, preferences.bankPreference]);

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Personalization</div>
        <div className="page-title">Personalized Recommendations</div>
        <div className="page-sub">
          Answer a few questions to get tailored credit card recommendations from the project dataset.
        </div>
      </div>

      <ErrorMessage message={err} />
      {loading && <Loader text="Loading recommendation dataset..." />}

      {!loading && !err && (
        <>
          <RecommendationQuestionnaire
            preferences={preferences}
            onChange={setPreferences}
            onSubmit={() => setGenerated(true)}
          />
          <RecommendationResults
            results={filteredCards}
            preferences={preferences}
            generated={generated}
          />
        </>
      )}
    </div>
  );
}
