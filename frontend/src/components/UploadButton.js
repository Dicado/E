import React from 'react';
import axios from 'axios';
import '../styles/UploadButton.css';

function UploadButton({ onUpload }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(response.data.url);
    } catch (err) {
      console.error('Ошибка при загрузке файла:', err);
    }
  };

  return (
    <label className="upload-button">
      📎
      <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
    </label>
  );
}

export default UploadButton;
