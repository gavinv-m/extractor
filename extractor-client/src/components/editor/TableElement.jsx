import EditableText from './EditableText';

// Exports to EditablePanel
export default function TableElement({ rows, cols, cells }) {
  const tableRows = [];

  //   Cells is flat array, split into rows
  for (let i = 0; i < rows; i++) {
    tableRows.push(cells.slice(i * cols, (i + 1) * cols));
  }

  return (
    <table>
      <tbody>
        {tableRows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <EditableText value={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
