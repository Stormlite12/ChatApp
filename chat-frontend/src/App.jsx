import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend server. 
// Use the actual IP address if your backend is not running on localhost.
const socket = io('http://localhost:3000');

function App() {
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // This effect listens for incoming messages from the server
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('newMessage');
    };
  }, []);

  const handleJoin = () => {
    if (name.trim() !== '') {
      setHasJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() !== '') {
      // Send the message to the server
      socket.emit('sendMessage', {
        text: currentMessage,
        name: name,
      });
      setCurrentMessage('');
    }
  };

  if (!hasJoined) {
    return (
      <div className="join-screen">
        <h1>Join Chat</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.name === name ? 'sent' : 'received'}`}>
            <strong>{msg.name}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
