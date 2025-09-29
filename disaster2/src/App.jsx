// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import your components
import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { ServicesSection } from "./components/services-section";
import { PreparednessSection } from "./components/peparedness-section";
import { EmergencyContacts } from "./components/emergency-contacts";
import { ResourcesSection } from "./components/resources-section";
import { Footer } from "./components/footer";

// Import the new chat page
import ChatPage from './components/pages/ChatPage';


// Main website component
function MainWebsite() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <PreparednessSection />
      <EmergencyContacts />
      <ResourcesSection />
      <Footer />
      
      {/* Floating Chat Button - Opens in New Page */}
      <Link 
        to="/chat" 
        className="chatbot-toggle-button" 
        aria-label="Open Emergency Chat Assistant"
        title="Get Emergency Help"
      >
        <MessageSquare size={32} />
        <span className="button-pulse"></span>
      </Link>
    </div>
  );
}

// Main App with Routes
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainWebsite />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
