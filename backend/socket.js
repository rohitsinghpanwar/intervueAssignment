import { response } from "express";

let currentPoll = null;
let pollTimer = null;
let studentResponses = {};

export function socketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User Connected', socket.id);

    socket.on('join', ({ name }) => {
      console.log(`Student ${name} joined with socket id ${socket.id}`);
    });

    socket.on('create_poll', ({ question, options, duration = 60 }) => {
      console.log("New Poll created by Teacher");
      currentPoll = {
        question,
        options: options.map(opt => ({ ...opt, votes: 0 })), // add votes field
        responses: {},
        createdAt: Date.now(),
        duration
      };
      studentResponses = {};
      io.emit('new_question', { ...currentPoll });

      if (pollTimer) clearTimeout(pollTimer);
      pollTimer = setTimeout(() => endPoll(io), duration * 1000);
    });

    socket.on('submit_answer', (optionIndex) => {
      if (!currentPoll) return;
      if (studentResponses[socket.id] !== undefined) return;
      studentResponses[socket.id] = optionIndex;
      currentPoll.options[optionIndex].votes += 1;
      currentPoll.responses[socket.id] = optionIndex;
      const resultData = computePollResults(currentPoll); 
      io.emit('poll_result', resultData);
    });
    socket.on("new_message",(data)=>{
      io.emit("recieve_message",data);
      console.log(data)
    })
    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
      delete studentResponses[socket.id];
    });
  });
}

function computePollResults(poll) {
  const voteCount = {};
  poll.options.forEach((_, idx) => (voteCount[idx] = 0));

  Object.values(poll.responses).forEach((vote) => {
    if (vote !== null && voteCount.hasOwnProperty(vote)) {
      voteCount[vote]++;
    }
  });

  const resultOptions = poll.options.map((opt, idx) => ({
    text: opt.text,
    votes: voteCount[idx],
    right: opt.right || false,
  }));

  const totalVotes = Object.values(voteCount).reduce((a, b) => a + b, 0);

  return { options: resultOptions, totalVotes };
}

function endPoll(io) {
  if (!currentPoll) return;

  const totalVotes = currentPoll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  io.emit('poll_result', {
    question: currentPoll.question,
    options: currentPoll.options,
    totalVotes,
  });

  currentPoll = null;
  studentResponses = {};
  pollTimer = null;
}
