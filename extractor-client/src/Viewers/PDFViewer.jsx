import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.93/build/pdf.worker.min.mjs`;

export default function PDFViewer({ docUrl, width = 500 }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <div>
      <Document file={{ url: docUrl }} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={width} />
      </Document>

      <p>
        Page {pageNumber} of {numPages}
      </p>

      <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
        Previous
      </button>
      <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
        Next
      </button>
    </div>
  );
}
