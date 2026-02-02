import { useState } from 'react';
import Screen1 from '../components/Screen1';
import Screen2 from '../components/Screen2';
import Screen3 from '../components/Screen3';
import './Questionnaire.css';

function Questionnaire({ onComplete, onBack }) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  const [answers, setAnswers] = useState({
    screen1: {},
    screen2: {},
    screen3: {},
    optional: {}
  });

  const updateAnswers = (screen, data) => {
    setAnswers(prev => ({
      ...prev,
      [screen]: { ...prev[screen], ...data }
    }));
  };

  const handleNext = () => {
    if (!isScreenComplete()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
      window.scrollTo(0, 0);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
      window.scrollTo(0, 0);
    } else {
      onBack();
    }
  };

  const isScreenComplete = () => {
    const currentAnswers = answers[`screen${currentScreen}`];
    const requiredQuestions = currentScreen === 1 ? 8 : currentScreen === 2 ? 8 : 4;
    return Object.keys(currentAnswers).length === requiredQuestions;
  };

  return (
    <div className="questionnaire-container">
      <div className="progress-bar-container card">
        <div className="progress-info">
          <span className="progress-text">Screen {currentScreen} of 3</span>
          <span className="progress-percentage">{Math.round((currentScreen / 3) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentScreen / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="questionnaire-content card">
        {showWarning && (
          <div className="validation-warning">
            ⚠️ Please answer all questions before proceeding to the next screen.
          </div>
        )}
        
        {currentScreen === 1 && (
          <Screen1 
            answers={answers.screen1} 
            onUpdate={(data) => { updateAnswers('screen1', data); setShowWarning(false); }}
            showValidation={showWarning}
          />
        )}
        {currentScreen === 2 && (
          <Screen2 
            answers={answers.screen2} 
            onUpdate={(data) => { updateAnswers('screen2', data); setShowWarning(false); }}
            showValidation={showWarning}
          />
        )}
        {currentScreen === 3 && (
          <Screen3 
            answers={answers.screen3} 
            optionalData={answers.optional}
            onUpdate={(data) => { updateAnswers('screen3', data); setShowWarning(false); }}
            onOptionalUpdate={(data) => updateAnswers('optional', data)}
            showValidation={showWarning}
          />
        )}

        <div className="navigation-buttons">
          <button 
            className="btn btn-secondary"
            onClick={handlePrevious}
          >
            {currentScreen === 1 ? '← Back to Home' : '← Previous'}
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
          >
            {currentScreen === 3 ? 'Submit & View Results' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
