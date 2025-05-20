import React, { useState } from 'react';

const ErrorPopUp = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#ff0033',
        border: '3px solid white',
        padding: '20px',
        color: '#fff',
        fontFamily: 'Courier New', monospace,
        width: 300,
        textAlign: 'center',
        zIndex: 10,
        boxShadow: '0 0 10px red',
      }}
    >
      <p><strong>FATAL ERROR</strong></p>
      <p>Чат перегружен вниманием</p>
      <button
        onClick={() => setVisible(false)}
        style={{
          marginTop: 10,
          background: '#000',
          color: '#fff',
          border: '2px solid white',
          padding: '8px 16px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        CLOSE
      </button>
    </div>
  );
};

export default ErrorPopUp;