import { useState } from 'react';
import Upload from './Upload.jsx';
import Viewer from './Viewer.jsx';

const VIEWS = ['upload', 'viewer'];

export default function App() {
  const [currentView, setCurrentView] = useState(VIEWS[0]);
  const [extractedData, setExtractedData] = useState(null);

  const handleUploadSuccess = (data) => {
    setExtractedData(data);
    setCurrentView('viewer');
  };
  return (
    <>
      {currentView === 'upload' && (
        <Upload onUploadSuccess={handleUploadSuccess}></Upload>
      )}
      {currentView === 'viewer' && <Viewer data={extractedData}></Viewer>}
    </>
  );
}
