import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ManagerPanel.css';

const ManagerPanel = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chats');
        setChats(res.data);
      } catch (err) {
        console.error('Ошибка загрузки чатов:', err);
      }
    };
    
    loadChats();
    const interval = setInterval(loadChats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="manager-panel">
      <h2>Активные обращения</h2>
      <div className="chat-list">
        {chats.map(chat => (
          <div key={chat.chatId} className="chat-item">
            <Link to={`/chat/${chat.chatId}?role=manager`}>
              <div className="chat-header">
                <span className="user-email">{chat.participants.user}</span>
                <span className="chat-time">
                  {new Date(chat.createdAt).toLocaleString('ru-RU', {
                    timeZone: 'Asia/Irkutsk',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="chat-preview">
                {chat.originalMessage.substring(0, 60)}
                {chat.originalMessage.length > 60 && '...'}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerPanel;