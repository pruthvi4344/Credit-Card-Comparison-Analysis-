import { useState } from "react";
import SearchBox from "../components/SearchBox";
import ResultsTable from "../components/ResultsTable";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { api } from "../services/api";

function normalizeRankings(data) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.rankings)
      ? data.rankings
      : Array.isArray(data?.data)
        ? data.data
        : data
          ? [data]
          : [];

  return list.map((item, index) => {
    if (typeof item === "string") {
      return { rank: index + 1, page: item, occurrences: "-" };
    }
    return {
      rank: item.rank ?? index + 1,
      page: item.url ?? item.page ?? item.title ?? "Page",
      occurrences: item.occurrences ?? item.score ?? item.count ?? "-"
    };
  });
}

function RankingPage() {
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRank = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.rankPages(keyword);
      setRows(normalizeRankings(response));
    } catch (err) {
      setError(err.message || "Failed to fetch rankings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Page Ranking</h2>
        <p>Rank pages based on keyword occurrence and relevance.</p>
      </div>
      <div className="panel">
        <SearchBox
          label="Ranking keyword"
          value={keyword}
          onChange={setKeyword}
          placeholder="e.g. rewards"
          buttonText="Rank Pages"
          onSubmit={handleRank}
        />
        {loading && <Loader text="Ranking pages..." />}
        <ErrorMessage message={error} />
        <ResultsTable
          columns={[
            { key: "rank", label: "Rank" },
            { key: "page", label: "Page" },
            { key: "occurrences", label: "Occurrences / Score" }
          ]}
          rows={rows}
          emptyMessage="No ranking results yet."
        />
      </div>
    </section>
  );
}

export default RankingPage;
