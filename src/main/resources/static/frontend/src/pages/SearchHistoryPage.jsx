import { useEffect, useState } from "react";
import ResultsTable from "../components/ResultsTable";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { api } from "../services/api";

function normalizeHistory(data) {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      keyword: item.keyword ?? item.word ?? String(item),
      count: item.count ?? item.frequency ?? "-"
    }));
  }

  if (data && typeof data === "object") {
    if (Array.isArray(data.history)) return normalizeHistory(data.history);
    return Object.entries(data).map(([keyword, count]) => ({
      keyword,
      count
    }));
  }

  return [];
}

function SearchHistoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.searchFrequency();
        setRows(normalizeHistory(response));
      } catch (err) {
        setError(err.message || "Failed to fetch search history.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Search Frequency</h2>
        <p>History of searched keywords and usage count.</p>
      </div>
      <div className="panel">
        {loading && <Loader text="Loading search frequency..." />}
        <ErrorMessage message={error} />
        {!loading && (
          <ResultsTable
            columns={[
              { key: "keyword", label: "Keyword" },
              { key: "count", label: "Count" }
            ]}
            rows={rows}
            emptyMessage="No search history available."
          />
        )}
      </div>
    </section>
  );
}

export default SearchHistoryPage;
