import EditableText from './EditableText';

// Exports to EditablePanel
export default function TableElement({
  rows,
  cols,
  cells,
  pageNumber,
  tableID,
  onCellChange,
}) {
  const table = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => '')
  );

  cells.forEach((cell) => {
    table[cell.rowIndex][cell.columnIndex] = cell;
  });

  const handleChange = (cellId, newValue) => {
    onCellChange(pageNumber, tableID, cellId, newValue);
  };

  return (
    <>
      {table.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, colIndex) => {
            if (!cell) return null;
            return (
              <td
                key={cell.id}
                rowSpan={cell.rowSpan || 1}
                colSpan={cell.colSpan || 1}
              >
                <EditableText
                  value={cell.content}
                  onChange={(newValue) => handleChange(cell.id, newValue)}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
