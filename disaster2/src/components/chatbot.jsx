"use client"

import React, { useState, useEffect, useRef } from "react"
import { SendIcon, BotIcon, UserIcon, RefreshCcwIcon, AlertTriangleIcon, ShieldIcon } from "lucide-react"
import { marked } from "marked"
import { v4 as uuidv4 } from "uuid"
import { createPortal } from "react-dom"
import "./chatbot.css"

const API_URL = "http://localhost:3001"

// Modal component for displaying the summary
const SummaryModal = ({ summary, onClose }) => {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            <ShieldIcon />
            Chat Summary
          </h2>
        </div>
        <div className="modal-body">
          <p className="modal-text">{summary}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-close-button">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

const MemoizedMessage = React.memo(({ message }) => {
  const isUser = message.role === "user"
  const content = isUser ? message.text : marked(message.text || "")

  return (
    
    <div className={`message ${isUser ? "user" : ""}`}>
      <div className={`message-avatar ${isUser ? "user" : "bot"}`}>{isUser ? <UserIcon /> : <BotIcon />}</div>
      <div className={`message-content ${isUser ? "user" : "bot"}`}>
        {isUser ? (
          <p className="message-text">{message.text}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} className="message-text" />
        )}
      </div>
    </div>
  )
})

MemoizedMessage.displayName = "MemoizedMessage"

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [summary, setSummary] = useState("")
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    let currentUserId = localStorage.getItem("chatbotUserId")
    if (!currentUserId) {
      currentUserId = uuidv4()
      localStorage.setItem("chatbotUserId", currentUserId)
    }
    setUserId(currentUserId)

    const initializeSession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sessions/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUserId }),
        })
        const data = await response.json()
        setSessionId(data.sessionId)
        localStorage.setItem("chatbotSessionId", data.sessionId)
        setMessages(data.messages)
      } catch (error) {
        console.error("Error initializing session:", error)
      }
    }

    initializeSession()
  }, [])

  useEffect(() => {
    const fetchSessionHistory = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`${API_URL}/api/sessions/${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            setMessages(data.messages)
          }
        } catch (error) {
          console.error("Error fetching session history:", error)
        }
      }
    }

    fetchSessionHistory()
  }, [sessionId])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !userId || !sessionId) return

    setIsLoading(true)
    const userMessage = {
      text: input,
      role: "user",
      timestamp: new Date().toISOString(),
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId,
          message: input,
          chatHistory: messages,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      const botMessage = {
        text: data.response,
        role: "model",
        timestamp: new Date().toISOString(),
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = {
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: "model",
        timestamp: new Date().toISOString(),
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleNewSession = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/sessions/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      const data = await response.json()
      setSessionId(data.sessionId)
      localStorage.setItem("chatbotSessionId", data.sessionId)
      setMessages([])
    } catch (error) {
      console.error("Error starting new session:", error)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleQuickQuestion = (question) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    
    <div className="chatbot-container">
      <div className="chatbot-wrapper">
        {/* Header */}
        
        <div className="chatbot-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <AlertTriangleIcon />
              </div>
              <div>
                <h1 className="header-title">Disaster Management Assistant</h1>
                <p className="header-subtitle">Get help with emergency preparedness and response</p>
              </div>
            </div>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span className="status-text">{userId ? `ID: ${userId.slice(0, 8)}...` : "Connecting..."}</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-container">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-screen">
                <div className="welcome-icon">
                  <ShieldIcon />
                </div>
                <h2 className="welcome-title">Welcome to Disaster Management Assistant</h2>
                <p className="welcome-description">
                  I'm here to help you prepare for emergencies, understand disaster protocols, and provide guidance
                  during critical situations. How can I assist you today?
                </p>
                <div className="quick-actions">
                  <button
                    onClick={() => handleQuickQuestion("What should I include in an emergency kit?")}
                    className="quick-action-btn emergency-kit"
                  >
                    <div className="quick-action-content">
                      <div className="quick-action-icon">
                        <ShieldIcon />
                      </div>
                      <span className="quick-action-text">Emergency Kit</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("How do I prepare for earthquakes?")}
                    className="quick-action-btn earthquake"
                  >
                    <div className="quick-action-content">
                      <div className="quick-action-icon">
                        <AlertTriangleIcon />
                      </div>
                      <span className="quick-action-text">Earthquake Prep</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("What to do during a flood?")}
                    className="quick-action-btn flood"
                  >
                    <div className="quick-action-content">
                      <div className="quick-action-icon">
                        <div className="flood-icon"></div>
                      </div>
                      <span className="quick-action-text">Flood Response</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("Fire evacuation procedures")}
                    className="quick-action-btn fire"
                  >
                    <div className="quick-action-content">
                      <div className="quick-action-icon">
                        <div className="fire-icon"></div>
                      </div>
                      <span className="quick-action-text">Fire Safety</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <MemoizedMessage key={index} message={message} />
            ))}

            {isLoading && (
              <div className="loading-message">
                <div className="message-avatar bot">
                  <BotIcon />
                </div>
                <div className="loading-content">
                  <div className="loading-dots-container">
                    <div className="loading-dots">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                    <span className="loading-text">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <form onSubmit={handleSendMessage} className="input-form">
              <div className="input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input-field"
                  placeholder="Ask about disaster preparedness, emergency procedures..."
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="send-button">
                  <SendIcon />
                </button>
              </div>
              <button
                type="button"
                onClick={handleNewSession}
                disabled={isLoading || !userId}
                className="new-session-button"
                title="Start New Session"
              >
                <RefreshCcwIcon />
                <span className="new-session-text">New</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
