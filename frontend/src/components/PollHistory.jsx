import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import Teacher from './Teacher';
import Chat from './Chat';
function PollHistory() {
  const [results, setResults] = useState(null);
  const [poll, setPoll] = useState(null);
  const [timerEnded, setTimerEnded] = useState(false);
  const [newQuestion,setNewQuestion]=useState(false)


  useEffect(() => {
    socket.on('new_question', (data) => {
      setPoll(data);
      setResults({
        options: data.options.map((opt) => ({ ...opt, votes: 0 })),
        totalVotes: 0,
      });
      setTimerEnded(false);
      setTimeout(() => {
    setTimerEnded(true);
  }, data.duration * 1000);
    });

    socket.on('poll_result', (data) => {
      setResults(data);
    });



    return () => {
      socket.off('new_question');
      socket.off('poll_result');
      socket.off('poll_ended');


    };
  }, []);

  if(newQuestion) return <Teacher/>
  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto flex flex-col  h-screen justify-center">
        <h1 className='font-semibold text-xl'>Question</h1>

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
      <button
        className={`mt-4 pt-[17px] pb-[17px] pr-[70px] pl-[70px] rounded-[34px] text-white font-semibold text-[18px] ${
          timerEnded ? 'bg-[#8F64E1]' : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!timerEnded}
        onClick={()=>setNewQuestion(true)}
      >
        Ask New Question
      </button>
    <Chat/>

    </div>
  );
}

export default PollHistory;
