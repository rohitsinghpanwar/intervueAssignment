import React, { useState, useEffect } from 'react';
import socket from '../socket/socket';
import chatIcon from '../assets/chat.png';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [myId, setMyId] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setMyId(socket.id);
    });

    const handleReceive = ({ text, sender, name }) => {
      setMessages((prev) => [...prev, { text, sender, name }]);
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, []);

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("new_message", message);
    setMessage('');
  };

  return (
    <div className='absolute bottom-10 right-10 '>
      {showChat && (
        <div className="border mt-4 p-3 rounded space-y-2 w-full max-w-md mx-auto bg-white">
          <h1 className="text-lg font-semibold mb-2">Chat</h1>
          <div className="max-h-60 overflow-y-auto space-y-1 p-2 rounded bg-gray-50">
            {messages.map((msg, index) => {
              const isMe = msg.sender === myId;
              return (
                <div key={index} className={`w-full flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg max-w-[80%] ${isMe ? 'bg-[#8F64E1] text-white' : 'bg-white text-black'}`}>
                    {!isMe && (
                      <div className="text-xs font-semibold text-gray-500 mb-1">{msg.name}</div>
                    )}
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex mt-2 space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              onChange={handleInput}
              value={message}
              className="flex-1 border rounded px-3 py-1"
            />
            <button
              onClick={sendMessage}
              className="bg-[#8F64E1] text-white px-4 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <img
        src={chatIcon}
        className="w-12 h-12 mt-4 cursor-pointer "
        alt="Chat Icon"
        onClick={() => setShowChat(!showChat)}
      />
    </div>
  );
}

export default Chat;
