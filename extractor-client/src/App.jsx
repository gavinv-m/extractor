import { useState } from 'react';
import Upload from './Upload.jsx';
import DocumentPreview from './Viewer.jsx';
import EditablePanel from './components/editor/EditablePanel.jsx';

const VIEWS = ['upload', 'viewer'];

export default function App() {
  const [currentView, setCurrentView] = useState(VIEWS[0]);
  const [docData, setDocData] = useState({ pages: [], docUrl: null });

  const handleUploadSuccess = (data) => {
    setDocData({ pages: data.text.pages, docUrl: data.docUrl });
    setCurrentView('viewer');
  };

  const handleParagraphChange = (pageNumber, elementID, newValue) => {
    setDocData((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => {
        if (page.number === pageNumber) {
          return {
            ...page,
            elements: page.elements.map((element) =>
              element.id === elementID
                ? { ...element, content: newValue }
                : element
            ),
          };
        }
        return page;
      }),
    }));
  };

  return (
    <>
      {currentView === 'upload' && (
        <Upload onUploadSuccess={handleUploadSuccess}></Upload>
      )}
      {currentView === 'viewer' && (
        <div>
          <DocumentPreview docUrl={docData.docUrl}></DocumentPreview>
          <EditablePanel
            pages={docData.pages}
            onParagraphChange={handleParagraphChange}
          ></EditablePanel>
        </div>
      )}
    </>
  );
}
