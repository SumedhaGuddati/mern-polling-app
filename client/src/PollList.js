import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import Chart from 'chart.js/auto';
import { format } from 'date-fns';

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [filter, setFilter] = useState('recent');

  // Fetch polls from backend
  const fetchPolls = useCallback(async () => {
    const res = await fetch('/api/polls');
    const data = await res.json();
    setPolls(data);
    renderCharts(data);
  }, []);

  // Voting handler
  const vote = async (pollId, optionIndex) => {
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    if (votedPolls.includes(pollId)) {
      alert('You have already voted on this poll.');
      return;
    }

    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, optionIndex }),
      });

      // Update local state
      setUserVotes((prev) => ({ ...prev, [pollId]: optionIndex }));
      localStorage.setItem('votedPolls', JSON.stringify([...votedPolls, pollId]));

      fetchPolls(); // refresh chart
    } catch (err) {
      console.error('Voting failed:', err);
    }
  };

  // Render vote chart
  const renderCharts = (pollData) => {
    pollData.forEach((poll) => {
      const canvasId = `chart-${poll._id}`;
      const ctx = document.getElementById(canvasId)?.getContext('2d');
      if (!ctx) return;

      if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
      }

      const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
      const fractions =
        totalVotes === 0
          ? poll.options.map(() => 0)
          : poll.options.map((o) => o.votes / totalVotes);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: poll.options.map((o) => o.text),
          datasets: [
            {
              label: 'Vote Share',
              data: fractions,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 1,
              ticks: {
                stepSize: 0.2,
                callback: (value) => value.toFixed(1),
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Share: ${(context.raw * 100).toFixed(1)}%`;
                },
              },
            },
          },
        },
      });
    });
  };

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto'}}>
      <h1 style={{ textAlign: 'center' }}>🗳️ All Polls</h1>
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
          <label htmlFor="filter">Sort By: </label>
          <select id="filter" value={filter}  onChange={(e) => setFilter(e.target.value)} style={{ padding: '5px', fontSize: '16px' }}>
              <option value="recent">🆕 Recent</option>
              <option value="mostVoted">🔥 Most Voted</option>
          </select>
    </div>
    {[...polls].sort((a, b) => {
        if (filter === 'recent') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (filter === 'mostVoted') {
          const totalVotesA = a.options.reduce((sum, o) => sum + o.votes, 0);
          const totalVotesB = b.options.reduce((sum, o) => sum + o.votes, 0);
          return totalVotesB - totalVotesA;
        }
        return 0;
    })
    .map((poll) =>{
        const hasVoted = JSON.parse(localStorage.getItem('votedPolls') || '[]').includes(poll._id);
        return (
          <div key={poll._id} className="poll-container">
            <h3>{poll.question}</h3>
            <p style={{ fontSize: '14px', color: 'gray' }}> Created on: {format(new Date(poll.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
            <div>
              {poll.options.map((option, idx) => {
                const isSelected = userVotes[poll._id] === idx;
                return (
                  <button
                    key={idx}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => vote(poll._id, idx)}
                    disabled={hasVoted}
                  >{option.text}</button>
                );
              })}
            </div>

            {hasVoted && (
              <p style={{ color: 'green', marginTop: '8px' }}>
                You have already voted.
              </p>
            )}

            <canvas id={`chart-${poll._id}`} height="150"></canvas>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
                  Total Votes: {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}
            </p>
            </div>
        );
      })}
    </div>
  );
};

export default PollList;
