const sections = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⊞', badge: 'HOME' },
    ],
  },
  {
    label: 'Data',
    items: [
      { id: 'crawler',    label: 'Web Crawler',  icon: '🕷', badge: 'GET' },
      { id: 'search',     label: 'Search',       icon: '⌕',  badge: 'GET' },
    ],
  },
  {
    label: 'NLP',
    items: [
      { id: 'spellcheck',  label: 'Spell Check',  icon: '✓', badge: 'GET' },
      { id: 'completion',  label: 'Completion',   icon: '◌', badge: 'GET' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { id: 'frequency',  label: 'Frequency',     icon: '◈', badge: 'GET' },
      { id: 'history',    label: 'Search History',icon: '◷', badge: 'GET' },
      { id: 'ranking',    label: 'Page Ranking',  icon: '▲', badge: 'GET' },
    ],
  },
  {
    label: 'Validation',
    items: [
      { id: 'regex', label: 'Regex Tools', icon: '∗', badge: 'POST' },
    ],
  },
];

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="sidebar">
      {sections.map(sec => (
        <div key={sec.label}>
          <div className="sidebar-section">{sec.label}</div>
          {sec.items.map(item => (
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