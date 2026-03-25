import { useState } from 'react';
import api from '../services/api.js';
import SearchBox from '../components/SearchBox.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function HtmlParserPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setErr('');
    setResult(null);
    try {
      const data = await api.htmlParse(url);
      if (data?.error) {
        setErr(data.error);
      } else {
        setResult(data);
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Data Extraction</div>
        <div className="page-title">HTML Parser</div>
        <div className="page-sub">Fetch a live webpage, remove scripts and styles, and extract clean readable text.</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Parser Input</div>
        <div className="card-title">Parse HTML From URL</div>
        <div className="card-desc">Paste a page URL and the backend will use Jsoup to extract the visible page text.</div>
        <SearchBox
          value={url}
          onChange={setUrl}
          onSearch={run}
          placeholder="https://example.com/page"
          loading={loading}
          btnLabel="Parse HTML"
        />
        <ErrorMessage message={err} />
      </div>

      {loading && <Loader text="Parsing HTML page..." />}

      {!loading && result && (
        <div className="card fade-up fade-up-2">
          <div className="parser-head">
            <div>
              <div className="card-label">Parsed Result</div>
              <div className="card-title">{result.title || 'Untitled Page'}</div>
            </div>
            <div className="catalog-stats">
              <span className="badge badge-cyan">{result.wordCount || 0} words</span>
            </div>
          </div>

          <div className="parser-meta">
            <span className="parser-meta-label">Source URL</span>
            <a className="url" href={result.url} target="_blank" rel="noopener noreferrer">
              {result.url}
            </a>
          </div>

          <div className="parser-text-wrap">
            {result.text ? result.text : 'No visible text could be extracted from this page.'}
          </div>
        </div>
      )}
    </div>
  );
}
