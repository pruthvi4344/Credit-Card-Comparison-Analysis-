const sections = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '\u2318', badge: 'HOME' },
    ],
  },
  {
    label: 'Data',
    items: [
      { id: 'allcards', label: 'All Cards', icon: '\u25ab', badge: 'CSV' },
      { id: 'compare', label: 'Compare', icon: '\u21c4', badge: 'NEW' },
      { id: 'recommendations', label: 'Recommendations', icon: '\u2605', badge: 'FIT' },
      { id: 'analytics', label: 'Bank Analytics', icon: '\u25a3', badge: 'INSIGHT' },
      { id: 'crawler', label: 'Web Crawler', icon: '\ud83d\udd77', badge: 'GET' },
      { id: 'search', label: 'Search', icon: '\u2315', badge: 'GET' },
    ],
  },
  {
    label: 'NLP',
    items: [
      { id: 'spellcheck', label: 'Spell Check', icon: '\u2713', badge: 'GET' },
      { id: 'completion', label: 'Completion', icon: '\u25cc', badge: 'GET' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { id: 'frequency', label: 'Frequency', icon: '\u25c8', badge: 'GET' },
      { id: 'history', label: 'Search History', icon: '\u25f7', badge: 'GET' },
      { id: 'ranking', label: 'Page Ranking', icon: '\u25b2', badge: 'GET' },
    ],
  },
  {
    label: 'Validation',
    items: [
      { id: 'regex', label: 'Regex Tools', icon: '\u2217', badge: 'POST' },
    ],
  },
];

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="sidebar">
      {sections.map((sec) => (
        <div key={sec.label}>
          <div className="sidebar-section">{sec.label}</div>
          {sec.items.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => onNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              <span className="nav-badge">{item.badge}</span>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
