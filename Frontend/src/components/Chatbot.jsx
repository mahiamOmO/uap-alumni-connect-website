import React, { useState, useRef, useEffect } from 'react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your UAP CSE Alumni Connect assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage)
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('alumni') || input.includes('directory')) {
      return "You can browse our alumni directory to connect with fellow graduates. Visit the Alumni Directory page to search by batch, company, or skills. Would you like me to help you find specific alumni?"
    }
    
    if (input.includes('job') || input.includes('career') || input.includes('employment')) {
      return "We have many job opportunities posted by alumni and partner companies. Check out our Job Opportunities page for current openings. You can also post job opportunities if you're hiring!"
    }
    
    if (input.includes('event') || input.includes('workshop') || input.includes('meeting')) {
      return "We regularly host events, workshops, and networking sessions. Visit our Events page to see upcoming activities and register for them. Don't miss our annual alumni meetup!"
    }
    
    if (input.includes('mentor') || input.includes('guidance') || input.includes('advice')) {
      return "Our mentorship program connects current students with experienced alumni. You can find mentors or become a mentor yourself. Visit the Mentorship page to get started!"
    }
    
    if (input.includes('community') || input.includes('discussion') || input.includes('forum')) {
      return "Join our community discussions to share experiences, ask questions, and connect with other members. The Community page has various discussion topics and forums."
    }
    
    if (input.includes('resource') || input.includes('study') || input.includes('material')) {
      return "We have a comprehensive resource library with study materials, industry insights, and academic resources shared by alumni. Check out the Resources page!"
    }
    
    if (input.includes('login') || input.includes('register') || input.includes('sign up')) {
      return "To access all features, you'll need to create an account or login. Click the Login button in the navigation to get started!"
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! Welcome to UAP CSE Alumni Connect. I'm here to help you navigate our platform and answer any questions you might have!"
    }
    
    if (input.includes('help') || input.includes('support')) {
      return "I can help you with information about alumni directory, job opportunities, events, mentorship, community discussions, and resources. What would you like to know more about?"
    }
    
    // Default responses
    const defaultResponses = [
      "That's an interesting question! I can help you with information about our alumni network, job opportunities, events, and more. Could you be more specific?",
      "I'm here to help you navigate the UAP CSE Alumni Connect platform. You can ask me about alumni directory, jobs, events, mentorship, or community features.",
      "Let me help you find what you're looking for. You can explore our alumni directory, job board, upcoming events, or join community discussions. What interests you most?",
      "I'd be happy to assist you! Our platform offers alumni networking, job opportunities, events, mentorship programs, and resource sharing. What would you like to explore?"
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-robot text-sm"></i>
              </div>
              <div>
                <h3 className="font-semibold">Alumni Assistant</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        {isOpen ? (
          <i className="fas fa-times text-xl"></i>
        ) : (
          <i className="fas fa-comments text-xl"></i>
        )}
      </button>
    </div>
  )
}

export default Chatbot
