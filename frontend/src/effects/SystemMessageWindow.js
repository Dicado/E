import React, { useEffect, useState } from 'react';

const messages = [
  '🖥️ Подключение к системе поддержки...',
  '📡 Инициализация обратной связи...',
  '✅ Установлен безопасный канал связи.',
  '⌨️ Введите сообщение...',
];

const SystemMessageWindow = () => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        if (charIndex < messages[index].length) {
          setText((prev) => prev + messages[index][charIndex]);
          setCharIndex(charIndex + 1);
        } else {
          setText((prev) => prev + '\n');
          setIndex(index + 1);
          setCharIndex(0);
        }
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [index, charIndex]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        left: 60,
        width: 360,
        height: 160,
        background: '#000',
        border: '2px solid lime',
        padding: '15px',
        color: 'lime',
        fontFamily: 'Courier New', monospace,
        fontSize: '14px',
        whiteSpace: 'pre-line',
        zIndex: 10,
      }}
    >
      {text}
    </div>
  );
};

export default SystemMessageWindow;