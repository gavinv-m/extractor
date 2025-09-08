import PDFViewer from './Viewers/PDFViewer';

// Exports to App.jsx
export default function Viewer({ text, docUrl }) {
  return <>{docUrl && <PDFViewer docUrl={docUrl}></PDFViewer>}</>;
}
