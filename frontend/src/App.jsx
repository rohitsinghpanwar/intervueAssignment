import React, { useState } from 'react';
import { useDispatch,useSelector  } from 'react-redux';
import {setUserType} from './redux/userTypeSlice.js'
import Teacher from './components/Teacher.jsx';
import Student from './components/Student.jsx';
function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch=useDispatch();
  const handleClick = (e) => {
    setSelectedUser(e.currentTarget.id);
  };
  const handleContinueClick=(e) => {
    dispatch(setUserType({userType:selectedUser}))
  };
   const userType = useSelector((state) => state.userType.userType);
   if (userType === 'student') return <Student />;
  if (userType === 'teacher') return <Teacher />;
  return (
    <div className=' flex flex-col items-center justify-center h-screen gap-5'>
      <h1 className='bg-gradient-to-r from-[#7765DA] to-[#4D0ACD] text-white rounded-full p-[9px] gap-[7px] font-semibold text-[14px]'>
        Intervue Poll
      </h1>
      <h1 className='font-normal text-[40px]'>
        Welcome to the <span className='font-semibold'>Live Polling System</span>
      </h1>
      <h2>Please select the role that best describes you to begin the live polling system</h2>
      <div className='flex gap-6 p-5'>
        <div
          className={`cursor-pointer border-[3px] pt-[15px] pb-[15px] pl-[25px] pr-[17px] shadow rounded-[10px] ${
            selectedUser === 'student' ? 'border-[#4D0ACD]' : 'border-[#D9D9D9]'
          }`}
          id='student'
          onClick={handleClick}
        >
          <h1 className='font-bold'>I'm a Student</h1>
          <h2>You will be able to answer the questions! Good luck.</h2>
        </div>

        <div
          className={`cursor-pointer border-[3px] pt-[15px] pb-[15px] pl-[25px] pr-[17px] shadow rounded-[10px] ${
            selectedUser === 'teacher' ? 'border-[#4D0ACD]' : 'border-[#D9D9D9]'
          }`}
          id='teacher'
          onClick={handleClick}
        >
          <h1 className='font-bold'>I'm a Teacher</h1>
          <h2>Submit questions and view live poll results in real-time</h2>
        </div>
      </div>

      <button
        className='bg-gradient-to-r from-[#7765DA] to-[#1D68BD] text-white font-semibold text-[18px] pt-[17px] pb-[17px] pl-[70px] pr-[70px] gap-[17px] rounded-[34px]'
        disabled={!selectedUser}
       onClick={handleContinueClick}>
        Continue
      </button>
    </div>
  );
}

export default App;
