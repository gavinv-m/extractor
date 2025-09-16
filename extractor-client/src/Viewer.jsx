import PDFViewer from './Viewers/PDFViewer';

// Exports to App.jsx
export default function DocumentPreview({ docUrl }) {
  if (!docUrl) return null;

  const extension = docUrl.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return <PDFViewer docUrl={docUrl} />;
  } else if (
    ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'].includes(extension || '')
  ) {
    return (
      <div>
        <img src={docUrl} alt="Preview" />
      </div>
    );
  } else {
    return <p>Unsupported preview format</p>;
  }
}
