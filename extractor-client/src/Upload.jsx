import { useState } from 'react';

// Exports to App.jsx
export default function Upload({ onUploadSuccess }) {
  const [option, setOption] = useState('all');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    let pagesToCrop = [];

    if (option === 'single') {
      const singlePage = parseInt(e.target.singlePage.value);
      if (!isNaN(singlePage)) pagesToCrop = [singlePage];
    } else if (option === 'range') {
      const startPage = parseInt(e.target.startPage.value);
      const endPage = parseInt(e.target.endPage.value);
      if (!isNaN(startPage) && !isNaN(endPage) && endPage >= startPage) {
        pagesToCrop = Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        );
      }
    } else if (option === 'multiple') {
      const multiplePages = e.target.multiplePages.value
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      pagesToCrop = multiplePages;
    } else {
      pagesToCrop = 'all'; // handle all pages on server
    }

    formData.append('pagesToCrop', JSON.stringify(pagesToCrop));

    const response = await fetch('http://localhost:3000/process', {
      mode: 'cors',
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    onUploadSuccess(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          accept="application/pdf"
          name="uploaded_filex"
          onChange={handleFileChange}
        />

        {/* Radio buttons */}
        <div>
          {['single', 'range', 'multiple', 'all'].map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="pageOption"
                value={type}
                checked={option === type}
                onChange={(e) => setOption(e.target.value)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>

        {/* Conditional inputs */}
        {option === 'single' && (
          <input
            type="number"
            name="singlePage"
            placeholder="Enter page number"
          />
        )}

        {option === 'range' && (
          <div>
            <input type="number" name="startPage" placeholder="Start page" />
            <input type="number" name="endPage" placeholder="End page" />
          </div>
        )}

        {option === 'multiple' && (
          <input
            type="text"
            name="multiplePages"
            placeholder="Enter pages (e.g. 1,3,5)"
          />
        )}

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
