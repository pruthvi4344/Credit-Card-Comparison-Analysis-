import { useState } from "react";
import SearchBox from "../components/SearchBox";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import SuggestionList from "../components/SuggestionList";
import { api } from "../services/api";

function normalizeCompletions(data) {
  if (Array.isArray(data)) return data.map(String);
  if (typeof data === "string") return [data];
  if (data && typeof data === "object") {
    if (Array.isArray(data.completions)) return data.completions.map(String);
    if (Array.isArray(data.suggestions)) return data.suggestions.map(String);
    return Object.values(data).map(String);
  }
  return [];
}

function WordCompletionPage() {
  const [prefix, setPrefix] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    if (!prefix.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.completeWord(prefix);
      setItems(normalizeCompletions(response));
    } catch (err) {
      setError(err.message || "Word completion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Word Completion</h2>
        <p>Autocomplete words from entered prefixes.</p>
      </div>
      <div className="panel">
        <SearchBox
          label="Enter prefix"
          value={prefix}
          onChange={setPrefix}
          placeholder="e.g. tra"
          buttonText="Complete"
          onSubmit={handleComplete}
        />
        {loading && <Loader text="Generating completions..." />}
        <ErrorMessage message={error} />
        <SuggestionList items={items} emptyMessage="No completion suggestions found." />
      </div>
    </section>
  );
}

export default WordCompletionPage;
