import { useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function CrawlerPage() {
  const [phase, setPhase] = useState('idle'); // idle | crawling | done | error
  const [urls, setUrls] = useState([]);
  const [err, setErr] = useState('');

  const start = async () => {
    setPhase('crawling'); setErr(''); setUrls([]);
    try {
      const data = await api.crawl();
      const list = Array.isArray(data)
        ? data
        : data?.urls || data?.crawledUrls || data?.pages || data?.results ||
          (typeof data === 'string' ? [data] : []);
      setUrls(list);
      setPhase('done');
    } catch (e) {
      setErr(e.message);
      setPhase('error');
    }
  };

  const urlStr = (u) => (typeof u === 'string' ? u : u?.url || JSON.stringify(u));

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Data Collection</div>
        <div className="page-title">Web Crawler</div>
        <div className="page-sub">Trigger the backend crawler to index credit card web pages</div>
      </div>

      <div className="card mb-6 fade-up fade-up-1">
        <div className="card-label">Crawler Control</div>
        <div className="card-title">Start Crawling Session</div>
        <div className="card-desc">
          Initiates the backend crawler. It will visit configured credit card pages, extract HTML,
          and build the inverted index used by Search and Ranking.
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={start}
          disabled={phase === 'crawling'}
          style={{ marginBottom: 0 }}
        >
          {phase === 'crawling'
            ? <><span className="spinner-sm" /> Crawling in progress...</>
            : '🕷  Start Crawling'}
        </button>

        <ErrorMessage message={err} />
      </div>

      {phase === 'crawling' && <Loader text="Crawling websites..." />}

      {phase === 'done' && (
        <div className="fade-up">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
            <div className="section-lbl" style={{ margin:0, flex:1 }}>Crawled Pages</div>
            <span className="badge badge-green">✓ {urls.length} indexed</span>
          </div>

          {urls.length === 0 ? (
            <div className="card">
              <div className="empty">
                <div className="empty-icon">🕷</div>
                <div className="empty-title">Crawl complete — no URLs returned</div>
                <div>Check backend logs for details</div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding:0 }}>
              {urls.map((u, i) => (
                <div className="crawl-item" key={i}>
                  <span className="crawl-num">{i + 1}</span>
                  <span className={`rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n'}`}>
                    {i < 3 ? ['①','②','③'][i] : '#'}
                  </span>
                  <a className="url" href={urlStr(u)} target="_blank" rel="noopener noreferrer">
                    {urlStr(u)}
                  </a>
                  <span className="badge badge-green" style={{ marginLeft:'auto' }}>Indexed</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}