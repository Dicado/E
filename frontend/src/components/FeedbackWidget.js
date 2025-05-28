import React, { useState, useEffect, useCallback } from 'react';
import '../styles/FeedbackWidget.css';
import FeedbackForm from './FeedbackForm';
import FeedbackMessage from './FeedbackMessage';
import { validateEmail, validateMessage } from '../utils/validators';
import { createFeedbackTask } from '../utils/api';


function FeedbackWidget() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 // Заглушка-использование
  const simulateSubmit = useCallback(() => {
    if (!isSubmitting) {
      console.log('simulateSubmit called (заглушка)');
    }
  }, [isSubmitting]);

  useEffect(() => {
    console.debug('FeedbackForm компонент доступен:', !!FeedbackForm);
    simulateSubmit();
  }, [simulateSubmit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!validateEmail(email)) {
      setErrorMessage('Пожалуйста, введите корректный email');
      return;
    }
    if (!validateMessage(message)) {
      setErrorMessage('Пожалуйста, введите сообщение');
      return;
    }
    setIsSubmitting(true);
    try {
      await createFeedbackTask(email, message);
      setSuccessMessage('Сообщение успешно отправлено!');
      setEmail('');
      setMessage('');
    } catch (error) {
      setErrorMessage(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="terminal-ui">
      <form className="form-terminal" onSubmit={handleSubmit}>
        <div className="form-header">
          C:/SEND_FEEDBACK.TXT
          <img className="window-controls" src="/vibes/window_controls.png" alt="controls" />
        </div>
        <div className="form-body">
          <label>EMAIL</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>MESSAGE</label>
          <textarea
            rows="5"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ ЗАПРОС'}
          </button>
        </div>

        <FeedbackMessage type="success" message={successMessage} />
        <FeedbackMessage type="error" message={errorMessage} />

      </form>
    </div>
  );
}

export default FeedbackWidget;