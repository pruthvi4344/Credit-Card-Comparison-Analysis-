import FeatureCard from '../components/FeatureCard.jsx';

const features = [
  { id: 'crawler',    icon: '🕷', name: 'Web Crawler',       desc: 'Crawl credit card websites and collect raw HTML for indexing and analysis.', api: 'GET /api/crawl' },
  { id: 'search',     icon: '⌕',  name: 'Keyword Search',    desc: 'Inverted index search across all indexed pages for instant keyword retrieval.', api: 'GET /api/search' },
  { id: 'spellcheck', icon: '✓',  name: 'Spell Check',       desc: 'Correct misspelled words using Levenshtein edit distance algorithm.', api: 'GET /api/spellcheck' },
  { id: 'completion', icon: '◌',  name: 'Word Completion',   desc: 'Autocomplete prefix queries from the full indexed vocabulary.', api: 'GET /api/complete' },
  { id: 'frequency',  icon: '◈',  name: 'Frequency Counter', desc: 'Count word occurrences across all crawled pages with per-page breakdown.', api: 'GET /api/frequency' },
  { id: 'history',    icon: '◷',  name: 'Search History',    desc: 'Track and visualize all searched keywords with cumulative counts.', api: 'GET /api/search-frequency' },
  { id: 'ranking',    icon: '▲',  name: 'Page Ranking',      desc: 'Rank indexed web pages by keyword relevance and term frequency score.', api: 'GET /api/rank' },
  { id: 'regex',      icon: '∗',  name: 'Regex Tools',       desc: 'Validate user inputs and extract emails, phones and URLs using regex.', api: 'POST /api/regex' },
];

const stats = [
  { val: '8',    lbl: 'Modules',   cls: 'green' },
  { val: '10',   lbl: 'Endpoints', cls: 'cyan' },
  { val: 'NLP',  lbl: 'Powered',   cls: 'amber' },
  { val: 'LIVE', lbl: 'Status',    cls: 'green' },
];

export default function DashboardPage({ onNav }) {
  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">System Overview</div>
        <div className="page-title">Credit Card Search Engine</div>
        <div className="page-sub">University Research Project — Java Spring Boot + React</div>
      </div>

      <div className="stat-grid fade-up fade-up-1">
        {stats.map(s => (
          <div className={`stat-card ${s.cls}`} key={s.lbl}>
            <div className={`stat-val ${s.cls}`}>{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="section-lbl fade-up fade-up-2">System Modules</div>
      <div className="grid-auto fade-up fade-up-3">
        {features.map(f => (
          <FeatureCard
            key={f.id}
            icon={f.icon}
            name={f.name}
            desc={f.desc}
            api={f.api}
            onClick={() => onNav(f.id)}
          />
        ))}
      </div>

      <div className="divider" />

      <div className="section-lbl fade-up">API Reference</div>
      <div className="card fade-up fade-up-1">
        <div className="card-label">Backend Configuration</div>
        <div className="card-title">Spring Boot REST API</div>
        <div className="code">
{`Base URL  : http://localhost:8080
─────────────────────────────────────────────────────────
GET  /api/crawl                  → Trigger web crawler
GET  /api/search?keyword=VALUE   → Inverted index search
GET  /api/spellcheck?word=VALUE  → Spell correction
GET  /api/complete?prefix=VALUE  → Word autocomplete
GET  /api/frequency?word=VALUE   → Word frequency count
GET  /api/search-frequency       → Search history
GET  /api/rank?keyword=VALUE     → Page ranking
POST /api/regex/validate         → Regex validation
POST /api/regex/pattern          → Pattern extraction`}
        </div>
      </div>
    </div>
  );
}