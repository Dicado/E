import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackWidget from './components/FeedbackWidget';
import ChatWidget from './components/ChatWidget';
import ManagerPanel from './components/ManagerPanel';

function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Заглушка-использование, чтобы не было warning
    if (!booted) {
      setBooted(true);
    }
  }, [booted]);

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<FeedbackWidget />} />
            <Route path="/chat/:chatId" element={<ChatWidget />} />
            <Route path="/manager/chat/:chatId" element={<ChatWidget />} />
            <Route path="/manager" element={<ManagerPanel />} />
          </Routes>
        </Router>
    </>
  );
}

export default App;