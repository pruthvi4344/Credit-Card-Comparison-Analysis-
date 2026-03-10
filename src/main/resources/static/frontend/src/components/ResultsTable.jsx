export default function ResultsTable({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">◌</div>
        <div className="empty-title">No results</div>
        <div>Try a different query</div>
      </div>
    );
  }
  return (
    <div className="table-wrap fade-up">
      <table>
        <thead>
          <tr>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map(c => (
                <td key={c.key}>
                  {c.render ? c.render(row[c.key], row, i) : (row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}