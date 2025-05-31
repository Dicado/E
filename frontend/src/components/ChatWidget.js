import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';
import UploadButton from './UploadButton';
import '../styles/ChatWidget.css';

function ChatWidget() {
  const { chatId } = useParams();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [chatUserEmail, setChatUserEmail] = useState('');
  const [input, setInput] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [isChatClosed, setIsChatClosed] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role') || 'user';
    setUserRole(role);

    const email = sessionStorage.getItem('userEmail') || 'Guest';

    socket.emit('joinChat', { chatId, role, email });

    socket.on('chatHistory', (history) => {
      const filtered = history.filter(msg => msg.senderType !== 'system');
      setMessages(filtered);
    });

    socket.on('newMessage', (message) => {
      if (message.senderType !== 'system') {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('chatClosed', () => {
      setIsChatClosed(true);
    });

    return () => {
      socket.off('chatHistory');
      socket.off('newMessage');
      socket.off('chatClosed');
    };
  }, [chatId, location.search]);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chats/${chatId}`);
        const filtered = res.data.messages.filter(msg => msg.senderType !== 'system');
        setMessages(filtered);
        setChatUserEmail(res.data.participants.user);
      } catch (err) {
        console.error('Ошибка загрузки чата:', err);
      }
    };
    loadChatHistory();
  }, [chatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('sendMessage', { chatId, message: input, role: userRole });
    setInput('');
  };

  const handleFileUpload = (url) => {
    socket.emit('uploadFile', { chatId, fileUrl: url, role: userRole });
  };

  const filteredMessages = messages.filter(msg => msg.senderType !== 'system');

  return (
    <div className="terminal-ui">
      <div className="form-terminal">
        <div className="form-header">
          C:/CHAT_SESSION.TXT
          <img className="window-controls" src="/vibes/window_controls.png" alt="ctrl" />
        </div>
        <div className="form-body chat-body">
          <div className="chat-messages">
            {filteredMessages.map((msg, idx) => {
              console.log(msg);
              const isCurrentUser = msg.senderType === userRole;
              const align = isCurrentUser ? 'right' : 'left';
              const label = msg.senderType === 'manager' ? 'Менеджер' : chatUserEmail;
              const isFile = msg.type === 'file' || msg.content?.startsWith('/uploads/');

              return (
                <div key={idx} className={`message-row ${align}`}>
                  <div className="sender-label">{label}</div>
                  <div className="message-bubble">
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleString('ru-RU')}
                    </div>
                    {isFile ? (
                      <a
                        href={msg.content}
                        className="file-link"
                        download={msg.content.split('/').pop()} // включает оригинальное имя
                        target="_blank"
                        rel="noreferrer"
                      >
                        📎 {msg.content.split('-').slice(1).join('-')}
                      </a>

                    ) : (
                      <div className="message-text">{msg.content}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!isChatClosed && (
            <form className="chat-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введи сообщение..."
              />
              <button type="submit">ОТПРАВИТЬ</button>
              <UploadButton onUpload={handleFileUpload} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatWidget;