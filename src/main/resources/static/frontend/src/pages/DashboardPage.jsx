import FeatureCard from '../components/FeatureCard.jsx';

const features = [
  { id: 'allcards', icon: '\u25ab', name: 'All Cards', desc: 'Browse the full credit card catalog loaded from the CSV dataset.', api: 'GET /api/cards' },
  { id: 'compare', icon: '\u21c4', name: 'Compare Cards', desc: 'Select up to three cards, compare fees and benefits, and get a personalized recommendation.', api: 'GET /api/cards' },
  { id: 'recommendations', icon: '\u2605', name: 'Recommendations', desc: 'Answer a short questionnaire and get the top credit card matches from the catalog.', api: 'GET /api/cards' },
  { id: 'analytics', icon: '\u25a3', name: 'Bank Analytics', desc: 'Analyze card counts, fee averages, interest rates, and dominant categories by bank.', api: 'GET /api/analytics/banks' },
  { id: 'crawler', icon: '\ud83d\udd77', name: 'Web Crawler', desc: 'Crawl credit card websites and collect raw HTML for indexing and analysis.', api: 'GET /api/crawl' },
  { id: 'parser', icon: '\u25a4', name: 'HTML Parser', desc: 'Parse a live webpage with Jsoup and extract clean visible text for analysis.', api: 'GET /api/html/parse' },
  { id: 'search', icon: '\u2315', name: 'Keyword Search', desc: 'Inverted index search across all indexed pages for instant keyword retrieval.', api: 'GET /api/search' },
  { id: 'spellcheck', icon: '\u2713', name: 'Spell Check', desc: 'Correct misspelled words using Levenshtein edit distance algorithm.', api: 'GET /api/spellcheck' },
  { id: 'completion', icon: '\u25cc', name: 'Word Completion', desc: 'Autocomplete prefix queries from the full indexed vocabulary.', api: 'GET /api/complete' },
  { id: 'frequency', icon: '\u25c8', name: 'Frequency Counter', desc: 'Count word occurrences across all crawled pages with per-page breakdown.', api: 'GET /api/frequency' },
  { id: 'history', icon: '\u25f7', name: 'Search History', desc: 'Track and visualize all searched keywords with cumulative counts.', api: 'GET /api/search-frequency' },
  { id: 'ranking', icon: '\u25b2', name: 'Page Ranking', desc: 'Rank indexed web pages by keyword relevance and term frequency score.', api: 'GET /api/rank' },
  { id: 'regex', icon: '\u2217', name: 'Regex Tools', desc: 'Validate user inputs and extract emails, phones and URLs using regex.', api: 'POST /api/regex' },
];

const stats = [
  { val: '13', lbl: 'Modules', cls: 'green' },
  { val: '14', lbl: 'Endpoints', cls: 'cyan' },
  { val: 'CSV', lbl: 'Catalog', cls: 'amber' },
  { val: 'LIVE', lbl: 'Status', cls: 'green' },
];

export default function DashboardPage({ onNav }) {
  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">System Overview</div>
        <div className="page-title">Credit Card Search Engine</div>
        <div className="page-sub">University Research Project - Java Spring Boot + React</div>
      </div>

      <div className="stat-grid fade-up fade-up-1">
        {stats.map((s) => (
          <div className={`stat-card ${s.cls}`} key={s.lbl}>
            <div className={`stat-val ${s.cls}`}>{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="section-lbl fade-up fade-up-2">System Modules</div>
      <div className="grid-auto fade-up fade-up-3">
        {features.map((f) => (
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
---------------------------------------------------------
GET  /api/crawl                  -> Trigger web crawler
GET  /api/cards                  -> View all cards from CSV
GET  /api/analytics/banks        -> Bank analytics dashboard
GET  /api/html/parse?url=VALUE   -> Parse HTML and extract text
GET  /api/search?keyword=VALUE   -> Inverted index search
GET  /api/spellcheck?word=VALUE  -> Spell correction
GET  /api/complete?prefix=VALUE  -> Word autocomplete
GET  /api/frequency?word=VALUE   -> Word frequency count
GET  /api/search-frequency       -> Search history
GET  /api/rank?keyword=VALUE     -> Page ranking
POST /api/regex/validate         -> Regex validation
POST /api/regex/pattern          -> Pattern extraction`}
        </div>
      </div>
    </div>
  );
}
