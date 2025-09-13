import PDFViewer from './Viewers/PDFViewer';

// Exports to App.jsx
export default function DocumentPreview({ docUrl }) {
  return <>{docUrl && <PDFViewer docUrl={docUrl}></PDFViewer>}</>;
}
