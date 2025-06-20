import React, { useEffect, useState } from 'react';
import Poll from './Poll';
import socket from '../socket/socket';
function Student() {
  const [studentName, setStudentName] = useState('');
  const [pupil,setPupil]=useState()

  useEffect(() => {
    const savedPupil = sessionStorage.getItem('pupil');
    if (savedPupil) {
      setPupil(savedPupil)
      socket.emit('join', { name: savedPupil });
    }
  }, []);

  const handleChange = (e) => {
    setStudentName(e.target.value);
  };

  const handleContinue = () => {
    const trimmedName = studentName.trim();
    if (!trimmedName) {
      alert("Please enter your good name!");
      return;
    }
    sessionStorage.setItem('pupil', trimmedName);
    setPupil(trimmedName)
    setStudentName(trimmedName);
    socket.emit('join', { name: trimmedName });
  };

  if (pupil) return <Poll />;

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="bg-gradient-to-r from-[#7765DA] to-[#4D0ACD] text-white rounded-full px-4 py-2 font-semibold text-sm">
        Intervue Poll
      </h1>

      <div>
        <h1 className="text-4xl font-normal">
          Let's <span className="font-semibold">Get Started</span>
        </h1>
        <h2 className="text-gray-600">
          If you’re a student, you’ll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates.
        </h2>
      </div>

      <div>
        <label className="font-semibold block mb-2">Enter Your Name</label>
        <input
          type="text"
          value={studentName}
          onChange={handleChange}
          placeholder="e.g., Rohit"
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <button
        onClick={handleContinue}
        className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white font-semibold text-[18px] pt-[17px] pb-[17px] pl-[70px] pr-[70px] gap-[10px] rounded-[34px] "
      >
        Continue
      </button>
    </div>
  );
}

export default Student;
