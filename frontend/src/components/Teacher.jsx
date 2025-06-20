import React, { useState } from 'react';
import socket from '../socket/socket.js';
import PollHistory from './PollHistory.jsx';
function Teacher() {
  const [question, setQuestion] = useState('');
  const [show,setShow]=useState(false)
  const [options, setOptions] = useState([
    { text: '', right: false }
  ]);
  const [duration, setDuration] = useState(60);

  const handleOptionTextChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].right = value === 'yes';
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: '', right: false }]);
    } else {
      alert('You can only have 5 Options for a question');
    }
  };

  const handleSubmit = () => {
    if (!question.trim() || options.some(opt => !opt.text.trim())) {
      alert('Please fill out all fields');
      return;
    }

    const hasCorrect = options.some(opt => opt.right);
    if (!hasCorrect) {
      alert('Please mark at least one correct option.');
      return;
    }

    const pollData = {
      question,
      options,
      duration,
    };
    socket.emit('create_poll', pollData);
    setQuestion('');
    setOptions([
      { text: '', right: false },
      { text: '', right: false }
    ]);
    setDuration(60);
    setShow(true)
  };
  if(show)return <PollHistory/>

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto  ">
      <h1 className="bg-gradient-to-r from-[#7765DA] to-[#4D0ACD] text-white rounded-full px-4 py-2 font-semibold text-sm text-center">
        Intervue Poll
      </h1>

      <div>
        <h1 className="text-4xl font-normal">
          Let's <span className="font-semibold">Get Started</span>
        </h1>
        <h2 className="text-gray-600">
          You’ll have the ability to create and manage polls, ask questions, and monitor responses in real-time.
        </h2>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold">Enter Your Question</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border rounded p-1"
          >
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>120 seconds</option>
          </select>
        </div>

        <textarea
          rows={4}
          placeholder="Type your question..."
          className="w-full border p-2 rounded mb-4 bg-[#F2F2F2]"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="flex justify-between">
          <h2 className="font-semibold">Edit Options</h2>
          <h2 className="font-semibold">Is it right?</h2>
        </div>

        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <h2 className='bg-gradient-to-l from-[#8F64E1] to-[#4E377B] w-11 text-center rounded-full font-semibold text-white' >{idx + 1}</h2>
              <input
                type="text"
                value={opt.text}
                onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="w-full border p-2 rounded bg-[#F2F2F2]"
              />

              <label className="flex items-center space-x-2">
                <span>Yes</span>
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={opt.right === true}
                  onChange={() => handleCorrectChange(idx, 'yes')}
                  className="w-4 h-4 accent-[#4F0DCE]"
                />
              </label>

              <label className="flex items-center space-x-2">
                <span>No</span>
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={opt.right === false}
                  onChange={() => handleCorrectChange(idx, 'no')}
                  className="w-4 h-4 accent-[#4F0DCE]"
                />
              </label>
            </div>
          ))}
        </div>


        <div className="mt-5 flex justify-between">
        <button
          onClick={addOption}
          className="mt-2 text-sm text-[#7451B6] border rounded p-2"
        >
          + Add another option
        </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#7765DA] to-[#1D68BD] text-white font-semibold text-[18px] pt-[17px] pb-[17px] pl-[70px] pr-[70px] gap-[10px] rounded-[34px]"
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default Teacher;
