import { useState } from "react";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { api } from "../services/api";

function toList(data) {
  if (Array.isArray(data)) return data;
  if (typeof data === "string") return [data];
  if (data && typeof data === "object") {
    const keys = ["urls", "results", "pages", "data", "parsedContent"];
    for (const key of keys) {
      if (Array.isArray(data[key])) return data[key];
    }
    return Object.values(data).flatMap((value) =>
      Array.isArray(value) ? value : [String(value)]
    );
  }
  return [];
}

function CrawlerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const handleCrawl = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.crawl();
      setItems(toList(response));
    } catch (err) {
      setError(err.message || "Crawl failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Web Crawler</h2>
        <p>Trigger crawler and inspect crawled URLs or parsed output.</p>
      </div>
      <div className="panel">
        <button className="primary-btn" onClick={handleCrawl} disabled={loading}>
          Start Crawling
        </button>
        {loading && <Loader text="Crawling pages..." />}
        <ErrorMessage message={error} />
        <ul className="result-list">
          {items.map((item, index) => (
            <li key={`${index}-${item}`}>{String(item)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CrawlerPage;
