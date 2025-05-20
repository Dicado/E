import React from 'react';

function FeedbackMessage({ type, message }) {
  if (!message) return null;
  const className = type === 'success' ? 'success-message' : 'error-message';
  return <div className={className}>{message}</div>;
}

export default FeedbackMessage;