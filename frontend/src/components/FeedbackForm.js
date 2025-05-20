import React from 'react';

function FeedbackForm({
  email,
  message,
  onEmailChange,
  onMessageChange,
  onSubmit,
  isSubmitting,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={onEmailChange}
          placeholder="Введите ваш email"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Сообщение:</label>
        <textarea
          id="message"
          value={message}
          onChange={onMessageChange}
          placeholder="Введите ваше сообщение"
          required
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
}

export default FeedbackForm;