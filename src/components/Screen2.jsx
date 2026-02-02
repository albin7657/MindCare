import QuestionCard from './QuestionCard';
import './Screen.css';

function Screen2({ answers, onUpdate, showValidation }) {
  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "I felt that I had nothing to look forward to",
    "Feeling tired or having little energy",
    "I feel mentally exhausted",
    "Everything I do requires a great deal of effort",
    "I struggle to find any enthusiasm for my work",
    "I have trouble staying focused"
  ];

  const scale = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Almost Always' }
  ];

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2 className="screen-title">Depression & Burnout Assessment</h2>
        <p className="screen-description">
          Please answer the following 8 questions about your mood and energy levels.
        </p>
      </div>

      <div className="questions-container">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            questionNumber={index + 9}
            question={question}
            scale={scale}
            selectedValue={answers[`q${index + 9}`]}
            onSelect={(value) => onUpdate({ [`q${index + 9}`]: value })}
            isUnanswered={showValidation && answers[`q${index + 9}`] === undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default Screen2;
