import ParagraphElement from './ParagraphElement';
import Heading from './Heading';
import TableElement from './TableElement';

// Exports to App.jsx
export default function EditablePanel({ pages }) {
  return (
    <>
      {pages.map((page) => (
        <div key={page.id}>
          {page.elements.map((element) => {
            if (element.type === 'paragraph' && element.role !== '') {
              return <Heading key={element.id} content={element.content} />;
            } else if (element.type === 'paragraph') {
              return (
                <ParagraphElement key={element.id} content={element.content} />
              );
            } else if (element.type === 'table') {
              return (
                <TableElement
                  key={element.id}
                  rows={element.tableRows}
                  cols={element.tableCols}
                  cells={element.tableCells}
                />
              );
            }
            return null;
          })}
        </div>
      ))}
    </>
  );
}
