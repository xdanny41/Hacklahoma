import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const optionStrategies = [
  { id: 1, name: 'Long Call', description: 'A bullish strategy that gives you the right to buy.' },
  { id: 2, name: 'Covered Call', description: 'A neutral to slightly bullish strategy that involves holding a long position and selling call options.' },
  { id: 3, name: 'Long Put', description: 'A bearish strategy that gives you the right to sell at a predetermined strike price.' },
  { id: 4, name: 'Protective Put', description: 'A defensive strategy where you buy a put to hedge against potential losses in your long stock position.' },
  { id: 5, name: 'Bull Put Spread', description: 'A bullish strategy that involves selling a put and buying a lower-strike put to reduce risk.' },
  { id: 6, name: 'Bear Put Spread', description: 'A bearish strategy that involves buying a put and selling a lower-strike put to offset the cost.' },
  { id: 7, name: 'Iron Condor', description: 'A non-directional, four-legged strategy combining a bull put spread and a bear call spread to profit in range-bound markets.' },
  { id: 8, name: 'Iron Butterfly', description: 'A limited risk, four-legged strategy that involves selling an at-the-money straddle and buying out-of-the-money options for hedging.' },
  { id: 9, name: 'Straddle', description: 'A strategy that involves buying both a call and a put with the same strike and expiration to profit from significant moves in either direction.' },
  { id: 10, name: 'Strangle', description: 'A strategy that involves buying out-of-the-money call and put options to benefit from large price movements in the underlying asset.' },
];


const ChatInterface = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() !== '') {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="border rounded p-3 h-90 d-flex flex-column">
      <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '70vh' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === 'bot' ? 'text-primary' : 'text-secondary'}`}>
            <strong style={{fontFamily:'Lora'}}>{msg.sender === 'bot' ? 'InvestMe AI' : 'You'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button className="btn btn-primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

const LearningCenter = () => {
  const [messages, setMessages] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const convertMessages = (msgs) => {
    return msgs.map(msg => ({
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text,
    }));
  };

  const callConversationAPI = async (conversationMessages) => {
    try {
      const response = await axios.post('http://localhost:5000/api/openai/learningcenter/conversation', {
        messages: conversationMessages
      });
      return response.data.result;
    } catch (error) {
      console.error('API call failed:', error);
      return "Sorry, there was an error processing your request.";
    }
  };
  

  const handleCardClick = async (strategy) => {
    setSelectedStrategy(strategy);
    const userMessage = { sender: 'user', text: strategy.name };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const conversationHistory = convertMessages(newMessages);
    const botResponseText = await callConversationAPI(conversationHistory);
    const botMessage = { sender: 'bot', text: botResponseText };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSendMessage = async (msgText) => {
    const userMsg = { sender: 'user', text: msgText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    const conversationHistory = convertMessages(newMessages);
    const botResponseText = await callConversationAPI(conversationHistory);
    const botMessage = { sender: 'bot', text: botResponseText };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="container-fluid">
      <div className="row g-0" style={{ height: '100vh', marginTop:'20px' }}>
  
      <div className="col-md-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
  <h3 className="mt-3" style={{color:'white',fontFamily:'Lora'}}>Options Strategies</h3>
  {optionStrategies.map(strategy => (
    <div
      key={strategy.id}
      className="card m-3"
      onClick={() => handleCardClick(strategy)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body">
        <h5 className="card-title" style={{fontFamily:'Lora'}}>{strategy.name}</h5>
        <p className="card-text">{strategy.description}</p>
      </div>
    </div>
  ))}
</div>


        <div className="col-md-8">
          <h3 className="mt-3" style={{color:'white', fontFamily:'Lora'}}>Chat with InvestMe AI</h3>
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default LearningCenter;
