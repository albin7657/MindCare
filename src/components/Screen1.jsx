import { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import './Screen.css';

function Screen1({ answers, onUpdate, showValidation }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/domains/questions-by-domains/Stress,Anxiety');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2 className="screen-title">Stress & Anxiety Assessment</h2>
        </div>
        <div className="loading-message">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <h2 className="screen-title">Stress & Anxiety Assessment</h2>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2 className="screen-title">Stress & Anxiety Assessment</h2>
        <p className="screen-description">
          Please answer the following {questions.length} questions about your stress and anxiety levels.
        </p>
      </div>

      <div className="questions-container">
        {questions.map((question, index) => {
          // Transform options from database format to QuestionCard format
          const scale = question.options
            .sort((a, b) => a.points - b.points) // Sort by points value
            .map(option => ({
              value: option.points,
              label: option.option_text
            }));

          return (
            <QuestionCard
              key={question._id}
              questionNumber={index + 1}
              question={question.question_text}
              scale={scale}
              selectedValue={answers[`q${index + 1}`]}
              onSelect={(value) => onUpdate({ [`q${index + 1}`]: value })}
              isUnanswered={showValidation && answers[`q${index + 1}`] === undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Screen1;

