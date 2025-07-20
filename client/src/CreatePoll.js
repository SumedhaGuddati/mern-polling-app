import React, { useState } from 'react';
import { createPoll } from './pollService';
import { useNavigate } from 'react-router-dom';
import './App.css';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    if (options.length >= 10) {
      alert('You can add up to 10 options only.');
      return;
    }
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedOptions = options.map(opt => opt.trim()).filter(Boolean);
    if (!question.trim() || trimmedOptions.length < 2) {
      return alert('Please enter a question and at least two non-empty options.');
    }

    await createPoll({ question, options: trimmedOptions });
    navigate('/');
  };

  return (
    <div className="create-poll-form">
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
          />
        ))}

        <div className="button-group">
          <button
            type="button"
            className="btn add-btn"
            onClick={handleAddOption}
          >
            + Add Option
          </button>
          <button
            type="submit"
            className="btn submit-btn"
          >
            Submit Poll
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePoll;
