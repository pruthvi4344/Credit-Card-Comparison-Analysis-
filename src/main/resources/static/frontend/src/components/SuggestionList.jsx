function SuggestionList({ items, emptyMessage = "No suggestions yet." }) {
  if (!items || items.length === 0) {
    return <p className="muted-text">{emptyMessage}</p>;
  }

  return (
    <ul className="suggestion-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export default SuggestionList;
