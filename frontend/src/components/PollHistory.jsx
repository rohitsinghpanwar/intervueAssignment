import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import chatIcon from '../assets/chat.png';

function PollHistory() {
  const [results, setResults] = useState(null);
  const [poll, setPoll] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);

  useEffect(() => {
    socket.on('new_question', (data) => {
      setPoll(data);
      setResults({
        options: data.options.map((opt) => ({ ...opt, votes: 0 })),
        totalVotes: 0,
      });
      setTimerEnded(false);
    });

    socket.on('poll_result', (data) => {
      setResults(data);
    });

    socket.on('poll_ended', () => {
      setTimerEnded(true);
    });

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('new_question');
      socket.off('poll_result');
      socket.off('poll_ended');
      socket.off('receive_message', handleReceive);
    };
  }, []);

  const handleAskNewQuestion = () => {
    alert("Ready to ask a new question!");
    // Redirect or show teacher panel logic can go here
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("new_message", message);
    setMessages((prev) => [...prev, message]); // optionally add own message
    setMessage('');
  };

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      {/* Question and Options */}
      {poll && results && (
        <div className="border rounded shadow">
          <h1 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white p-2 rounded-t">
            {poll.question}
          </h1>
          <div className="space-y-3 p-3">
            {results.options.map((opt, index) => {
              const percent =
                results.totalVotes > 0
                  ? Math.round((opt.votes / results.totalVotes) * 100)
                  : 0;

              return (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden px-4 py-2 bg-[#F5F5F5]"
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-[#8F64E1] transition-all duration-500"
                    style={{ width: `${percent}%`, zIndex: 0 }}
                  />
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="font-medium">{opt.text}</span>
                    <span className="font-semibold">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Toggle and Panel */}
      {showChat && (
        <div className="border mt-4 p-3 rounded space-y-2">
          <div className="max-h-40 overflow-y-auto space-y-1 bg-gray-100 p-2 rounded">
            {messages.map((msg, index) => (
              <div key={index} className="bg-white px-3 py-1 rounded shadow-sm">
                {msg}
              </div>
            ))}
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
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Chat Icon */}
      <img
        src={chatIcon}
        className="w-12 h-12 mt-4 cursor-pointer"
        alt="Chat Icon"
        onClick={() => setShowChat(!showChat)}
      />

      {/* Ask New Question Button */}
      <button
        className={`mt-4 pt-[17px] pb-[17px] pr-[70px] pl-[70px] rounded-[34px] text-white font-semibold text-[18px] ${
          timerEnded ? 'bg-[#8F64E1]' : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!timerEnded}
        onClick={handleAskNewQuestion}
      >
        Ask New Question
      </button>
    </div>
  );
}

export default PollHistory;
