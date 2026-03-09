import { useState } from "react";
import SearchBox from "../components/SearchBox";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { api } from "../services/api";

function parseFrequency(data) {
  if (typeof data === "number") return data;
  if (typeof data === "string") {
    const num = Number(data);
    return Number.isNaN(num) ? null : num;
  }
  if (data && typeof data === "object") {
    const keys = ["count", "frequency", "value", "total"];
    for (const key of keys) {
      if (data[key] !== undefined) {
        const num = Number(data[key]);
        if (!Number.isNaN(num)) return num;
      }
    }
  }
  return null;
}

function FrequencyPage() {
  const [word, setWord] = useState("");
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.frequencyCount(word);
      setCount(parseFrequency(response));
    } catch (err) {
      setError(err.message || "Frequency lookup failed.");
      setCount(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Frequency Counter</h2>
        <p>Measure how often a word appears in indexed content.</p>
      </div>
      <div className="panel">
        <SearchBox
          label="Word to analyze"
          value={word}
          onChange={setWord}
          placeholder="e.g. cashback"
          buttonText="Count"
          onSubmit={handleCheck}
        />
        {loading && <Loader text="Calculating frequency..." />}
        <ErrorMessage message={error} />
        {count !== null && (
          <div className="stat-card">
            <h3>{word}</h3>
            <p>{count} occurrences</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FrequencyPage;
