function ResultsTable({ columns, rows, emptyMessage = "No data available." }) {
  if (!rows || rows.length === 0) {
    return <p className="muted-text">{emptyMessage}</p>;
  }

  return (
    <div className="table-wrap">
      <table className="results-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${Object.values(row).join("-")}`}>
              {columns.map((column) => (
                <td key={`${column.key}-${index}`}>
                  {row[column.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
