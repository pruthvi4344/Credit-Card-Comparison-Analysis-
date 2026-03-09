import { useState } from "react";
import SearchBox from "../components/SearchBox";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import ResultsTable from "../components/ResultsTable";
import { api } from "../services/api";

function normalizeRows(data) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.data)
        ? data.data
        : data
          ? [data]
          : [];

  return list.map((item, index) => {
    if (typeof item === "string") {
      return {
        rank: index + 1,
        page: item,
        score: "-"
      };
    }
    return {
      rank: item.rank ?? index + 1,
      page: item.url ?? item.page ?? item.title ?? "Result",
      score: item.score ?? item.frequency ?? "-"
    };
  });
}

function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.searchIndex(keyword);
      setRows(normalizeRows(response));
    } catch (err) {
      setError(err.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Search</h2>
        <p>Keyword search powered by inverted indexing.</p>
      </div>
      <div className="panel">
        <SearchBox
          label="Search keyword"
          value={keyword}
          onChange={setKeyword}
          placeholder="e.g. travel"
          buttonText="Search"
          onSubmit={handleSearch}
        />
        {loading && <Loader text="Fetching search results..." />}
        <ErrorMessage message={error} />
        <ResultsTable
          columns={[
            { key: "rank", label: "Rank" },
            { key: "page", label: "Page" },
            { key: "score", label: "Score" }
          ]}
          rows={rows}
          emptyMessage="No results yet."
        />
      </div>
    </section>
  );
}

export default SearchPage;
