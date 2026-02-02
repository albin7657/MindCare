import QuestionCard from './QuestionCard';
import './Screen.css';

function Screen3({ answers, optionalData, onUpdate, onOptionalUpdate, showValidation }) {
  const questions = [
    "How often do you have difficulty falling asleep at night?",
    "How often do you wake up during the night and struggle to fall asleep again?",
    "How often do you feel sleepy or drowsy during classes or study hours?",
    "During the past month, how would you rate your sleep quality overall?"
  ];

  const scale = [
    { value: 0, label: 'Not during the past month' },
    { value: 1, label: 'Less than once a week' },
    { value: 2, label: 'Once or twice a week' },
    { value: 3, label: 'Three or more times a week' }
  ];

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2 className="screen-title">Sleep Quality Assessment</h2>
        <p className="screen-description">
          Please answer the following 4 questions about your sleep patterns.
        </p>
      </div>

      <div className="questions-container">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            questionNumber={index + 17}
            question={question}
            scale={scale}
            selectedValue={answers[`q${index + 17}`]}
            onSelect={(value) => onUpdate({ [`q${index + 17}`]: value })}
            isUnanswered={showValidation && answers[`q${index + 17}`] === undefined}
          />
        ))}
      </div>

      <div className="optional-section">
        <h3 className="optional-title">Optional Information</h3>
        <p className="optional-description">
          The following fields are completely optional and will not affect your results.
        </p>

        <div className="optional-fields">
          <div className="form-group">
            <label htmlFor="gender">Gender (Optional)</label>
            <select
              id="gender"
              value={optionalData.gender || ''}
              onChange={(e) => onOptionalUpdate({ gender: e.target.value })}
              className="form-input"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location (Optional)</label>
            <input
              id="location"
              type="text"
              value={optionalData.location || ''}
              onChange={(e) => onOptionalUpdate({ location: e.target.value })}
              placeholder="e.g., City, Country"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (Optional)</label>
            <input
              id="email"
              type="email"
              value={optionalData.email || ''}
              onChange={(e) => onOptionalUpdate({ email: e.target.value })}
              placeholder="your.email@example.com"
              className="form-input"
            />
            <div className="checkbox-group">
              <input
                id="emailCopy"
                type="checkbox"
                checked={optionalData.emailCopy || false}
                onChange={(e) => onOptionalUpdate({ emailCopy: e.target.checked })}
              />
              <label htmlFor="emailCopy">Email me a copy of my results</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Screen3;
