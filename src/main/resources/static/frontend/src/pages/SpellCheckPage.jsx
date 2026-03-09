import { useState } from "react";
import SearchBox from "../components/SearchBox";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import SuggestionList from "../components/SuggestionList";
import { api } from "../services/api";

function normalizeSuggestions(data) {
  if (Array.isArray(data)) return data.map(String);
  if (typeof data === "string") return [data];
  if (data && typeof data === "object") {
    if (Array.isArray(data.suggestions)) return data.suggestions.map(String);
    return Object.values(data).map(String);
  }
  return [];
}

function SpellCheckPage() {
  const [word, setWord] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.spellCheck(word);
      setSuggestions(normalizeSuggestions(response));
    } catch (err) {
      setError(err.message || "Spell check failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Spell Check</h2>
        <p>Suggest corrected words using edit distance logic.</p>
      </div>
      <div className="panel">
        <SearchBox
          label="Enter a word"
          value={word}
          onChange={setWord}
          placeholder="e.g. travle"
          buttonText="Check"
          onSubmit={handleCheck}
        />
        {loading && <Loader text="Checking spelling..." />}
        <ErrorMessage message={error} />
        <SuggestionList items={suggestions} emptyMessage="No suggestions found." />
      </div>
    </section>
  );
}

export default SpellCheckPage;
