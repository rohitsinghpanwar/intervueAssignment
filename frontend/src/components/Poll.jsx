import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import clock from '../assets/timer.png';

function Poll() {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);

  useEffect(() => {
    socket.on('new_question', (data) => {
      setPoll(data);
      setSelectedOption(null);
      setHasSubmitted(false);
      setResults(null);
      setTimer(data.duration);
      setQuestionNumber((prev) => prev + 1);

      let interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);

            if (!hasSubmitted && selectedOption === null) {
              socket.emit('submit_answer', null);
              setHasSubmitted(true);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('poll_result', (data) => {
      setResults(data);
    });

    return () => {
      socket.off('new_question');
      socket.off('poll_result');
    };
  }, [hasSubmitted, selectedOption]);

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert('Please select an option');
      return;
    }

    socket.emit('submit_answer', selectedOption);
    setHasSubmitted(true);
  };

  if (!poll) return <div className='flex flex-col justify-center items-center h-screen gap-5'>
    <h1 className="bg-gradient-to-r from-[#7765DA] to-[#4D0ACD] text-white rounded-full px-4 py-2 font-semibold text-sm">
        Intervue Poll
    </h1>
<svg
  className="w-15 h-15 animate-spin text-[#500ECE]"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 50 50"
  fill="none"
>
  <circle
    className="opacity-100"
    cx="25"
    cy="25"
    r="20"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    strokeDasharray="130" 
    strokeDashoffset="31.4"  
  />
</svg>

    <p className='text-[33px] font-semibold'>Wait for the teacher to ask questions..</p></div>;

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold">Question {questionNumber}</h1>
        <div className="flex items-center space-x-2">
          <img src={clock} alt="timer" className="w-6 h-6" />
          <p className="text-[#CB1206]">{timer}s</p>
        </div>
      </div>

      <div className="border-[#AF8FF1] border rounded-[10px]">
        <h1 className="text-white text-2xl font-bold bg-gradient-to-r from-[#343434] to-[#6E6E6E] p-4 rounded-t-[10px]">
          {poll.question}
        </h1>

        <div className="space-y-4 pt-[18px] pb-[18px] pr-[16px] pl-[16px]">
          {poll.options.map((opt, index) => {
            const isSelected = selectedOption === index;
            const isDisabled = hasSubmitted || timer === 0;
            const percent =
              hasSubmitted && results && results.totalVotes > 0
                ? Math.round((results.options[index].votes / results.totalVotes) * 100)
                : 0;

            return (
              <div
                key={index}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg relative
                  border-2 transition-all duration-300
                  ${isSelected ? 'border-[#8F64E1]' : 'border-[#8D8D8D30] bg-[#F6F6F6]'}
                  ${isDisabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={() => !isDisabled && setSelectedOption(index)}
              >
                {/* Result bar (if submitted) */}
                {hasSubmitted && results && (
                  <div
                    className="absolute top-0 left-0 h-full bg-[#6766D5] rounded-lg -z-10"
                    style={{ width: `${percent}%` }}
                  />
                )}

                <div className="flex items-center space-x-4 z-10">
                  <div
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-full font-semibold text-white
                      ${isSelected ? 'bg-[#8F64E1]' : 'bg-[#8D8D8D]'}
                    `}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`font-medium ${isSelected ? 'text-[#2D2D2D]' : 'text-[#333]'}`}
                  >
                    {opt.text}
                  </span>
                </div>

                {hasSubmitted && results && (
                  <span className="font-semibold z-10">{percent}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!hasSubmitted && (
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white rounded-[34px] pt-[17px] pb-[17px] pr-[70px] pl-[70px]"
          disabled={hasSubmitted || timer === 0}
        >
          Submit
        </button>
      )}

      {hasSubmitted && results && (
        <div className="font-semibold mt-4">
          Waiting for the teacher to ask a new question...
        </div>
      )}
    </div>
  );
}

export default Poll;
