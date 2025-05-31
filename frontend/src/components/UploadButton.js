import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UploadButton.css';

function UploadButton({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.url) {
        onUpload(response.data.url);
      } else {
        console.error('Файл не был сохранён на сервере');
      }
    } catch (err) {
      console.error('Ошибка при загрузке файла:', err);
      alert('Ошибка загрузки файла. Попробуйте снова.');
    } finally {
      setUploading(false);
      e.target.value = ''; // сброс input-а
    }
  };

  return (
    <label className="upload-button" title="Загрузить файл">
      {uploading ? '⏳' : '📎'}
      <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
    </label>
  );
}

export default UploadButton;
