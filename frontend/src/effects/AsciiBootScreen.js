import React, { useEffect, useState } from 'react';

const ascii = [
  '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
  '██ПОДКЛЮЧЕНИЕ К СИСТЕМЕ ОБРАТНОЙ СВЯЗИ███',
  '█▒▒▒Инициализация интерфейса...',
  '█▒▒▒Загрузка модулей безопасности...',
  '█▒▒▒Установка соединения с менеджером...',
  '█▒▒▒СТАТУС: ГОТОВ',
  '█▒▒▒>>ВХОД В ФОРМУ ОБРАЩЕНИЯ',
  '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
];

const AsciiBootScreen = ({ onFinish }) => {
  const [shownLines, setShownLines] = useState([]);
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setShownLines((prev) => [...prev, ascii[i]]);
      i++;
      if (i >= ascii.length) {
        clearInterval(interval);
        setTimeout(onFinish, 1000); // Пауза после загрузки
      }
    }, 300);
    return () => clearInterval(interval);
  }, [onFinish]);
  return (
    <div
      style={{
        backgroundColor: '#000',
        color: 'lime',
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        height: '100vh',
        width: '100vw',
        padding: '40px',
        boxSizing: 'border-box',
        zIndex: 20,
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <pre>{shownLines.join('\n')}</pre>
    </div>
  );
};

export default AsciiBootScreen;