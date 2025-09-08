import { useState } from 'react';
import Upload from './Upload.jsx';
import Viewer from './Viewer.jsx';

const VIEWS = ['upload', 'viewer'];

export default function App() {
  const [currentView, setCurrentView] = useState(VIEWS[0]);
  const [docData, setDocData] = useState({ text: null, docUrl: null });

  const handleUploadSuccess = (data) => {
    setDocData({ text: data.text, docUrl: data.docUrl });
    setCurrentView('viewer');
  };

  return (
    <>
      {currentView === 'upload' && (
        <Upload onUploadSuccess={handleUploadSuccess}></Upload>
      )}
      {currentView === 'viewer' && (
        <Viewer text={docData.text} docUrl={docData.docUrl}></Viewer>
      )}
    </>
  );
}
