import QuestionCard from './QuestionCard';
import './Screen.css';

function Screen1({ answers, onUpdate, showValidation }) {
  const questions = [
    "In the last month, how often have you felt nervous and stressed?",
    "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    "You feel that too many demands are being made on you",
    "You have many worries",
    "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)",
    "I felt I was close to panic",
    "In the last three months, have you found that it's hard to stop yourself from worrying?",
    "Feeling afraid, as if something awful might happen"
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
        <h2 className="screen-title">Stress & Anxiety Assessment</h2>
        <p className="screen-description">
          Please answer the following 8 questions about your stress and anxiety levels.
        </p>
      </div>

      <div className="questions-container">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            questionNumber={index + 1}
            question={question}
            scale={scale}
            selectedValue={answers[`q${index + 1}`]}
            onSelect={(value) => onUpdate({ [`q${index + 1}`]: value })}
            isUnanswered={showValidation && answers[`q${index + 1}`] === undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default Screen1;
