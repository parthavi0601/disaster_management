// src/pages/ChatPage.jsx
import React from 'react';


import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../chatbot';

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    <div className="chat-page-container">
      {/* Navigation Header */}
      <header className="chat-page-header">
        <div className="header-left">
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
            aria-label="Go back to main site"
          >
            <ArrowLeft size={20} />
            <span>Back to Site</span>
          </button>
        </div>
        
     
     
      </header>

      {/* Full-Screen Chatbot */}
      <main className="chat-page-main">
        <Chatbot />
      </main>
    </div>
  );
}
