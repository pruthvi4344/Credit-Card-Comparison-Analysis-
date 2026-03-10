export default function SuggestionList({ items, onSelect, empty = 'No suggestions found' }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">◌</div>
        <div className="empty-title">{empty}</div>
      </div>
    );
  }
  return (
    <div className="chip-row fade-up">
      {items.map((item, i) => (
        <span
          key={i}
          className="chip"
          onClick={() => onSelect && onSelect(item)}
          title={`Use: ${item}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}