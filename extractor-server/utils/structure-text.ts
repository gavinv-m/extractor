import { v4 as uuidv4 } from 'uuid';

interface PageElement {
  id: string;
  type: string;
  content?: string;
  role?: string;
  tableRows?: number;
  tableCols?: number;
  tableCells?: string[];
}

interface Page {
  id: string;
  number: number;
  elements: PageElement[];
}

// Exports to process.ts
export default function structureForClient(ocrResult: any) {
  const schema = {
    pages: [] as Page[],
  };

  const parsedSections: number[] = [];

  const parseSection = (section: any, index: number) => {
    // Check if section already parsed, prevent reparsing
    if (parsedSections.includes(index)) return;
    parsedSections.push(index);

    section.elements.forEach((element: string) => {
      const elementParts: string[] = element.split('/');
      if (elementParts.length < 3) return; // guard

      // Represents types like paragraphs, figures, tables
      const type: string = elementParts[1];
      const typeNumber: number = Number(elementParts[2]);

      if (type === 'paragraphs') {
        const paragraphText: string =
          ocrResult.paragraphs[typeNumber].content || '';
        const paragraphRole: string =
          ocrResult.paragraphs[typeNumber].role || '';
        const pageNumber: number =
          ocrResult.paragraphs[typeNumber].boundingRegions[0].pageNumber ?? 1;

        // Add or find page
        let page = schema.pages.find((p) => p.number === pageNumber);
        if (!page) {
          page = { id: uuidv4(), number: pageNumber, elements: [] };
          schema.pages.push(page);
        }

        // Add an element
        page.elements.push({
          id: uuidv4(),
          type: 'paragraph',
          content: paragraphText,
          role: paragraphRole,
        });
      }

      if (type === 'tables') {
        const table: any = ocrResult.tables[typeNumber];
        if (!table) return;

        const pageNumber: number =
          table.cells[0].boundingRegions[0].pageNumber ?? 1;

        // Add or find page
        let page = schema.pages.find((p) => p.number === pageNumber);
        if (!page) {
          page = { id: uuidv4(), number: pageNumber, elements: [] };
          schema.pages.push(page);
        }

        const tableRows: number = table.rowCount;
        const tableCols: number = table.columnCount;
        const tableCells: string[] = table.cells.map(
          (cell: { content: string }) => cell.content
        );

        // Add table element
        page.elements.push({
          id: uuidv4(),
          type: 'table',
          tableRows,
          tableCols,
          tableCells,
        });
      }

      if (type === 'sections') {
        const subSection = ocrResult.sections?.[typeNumber];
        if (subSection) {
          parseSection(subSection, typeNumber);
        }
      }
    });
  };

  // Loop through root sections defensively
  if (Array.isArray(ocrResult.sections)) {
    ocrResult.sections.forEach((section: any, i: number) =>
      parseSection(section, i)
    );
  }
  return schema;
}
