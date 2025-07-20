import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PollList from './PollList';
import CreatePoll from './CreatePoll';
import './App.css';

function App() {
  return (
    <Router>
      {/* Header spans full width */}
      <header className="full-header">
        <div className="header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Title and Subtitle on the left */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="title" style={{ color: '#e2e2e2', margin: 0 }}>Polling App</h1>
            <h2 style={{ fontWeight: 'normal', color: '#e2e2e2', margin: 0, fontSize: '18px' }}>Voice your opinion. See what others think.</h2>
        </div>
        {/* Nav on the right */}
        <nav>
          <Link to="/" className="nav-link">All Polls</Link>
          <Link to="/create" className="nav-link">Create Poll</Link>
        </nav>
        </div>
      </header>

      {/* Main content is centered */}
      <div className="main-container">
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/create" element={<CreatePoll />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
