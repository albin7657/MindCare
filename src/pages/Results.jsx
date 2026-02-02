import { FaExclamationTriangle } from 'react-icons/fa';
import './Results.css';

function Results({ results, onRetake, onHome }) {
  const calculateScores = () => {
    // Calculate individual category scores
    const stressScore = [1, 2, 3, 4].reduce((sum, q) => sum + (results.screen1[`q${q}`] || 0), 0);
    const anxietyScore = [5, 6, 7, 8].reduce((sum, q) => sum + (results.screen1[`q${q}`] || 0), 0);
    const depressionScore = [9, 10, 11, 12].reduce((sum, q) => sum + (results.screen2[`q${q}`] || 0), 0);
    const burnoutScore = [13, 14, 15, 16].reduce((sum, q) => sum + (results.screen2[`q${q}`] || 0), 0);
    const sleepScore = [17, 18, 19, 20].reduce((sum, q) => sum + (results.screen3[`q${q}`] || 0), 0);

    return {
      stress: { score: stressScore, max: 16 },
      anxiety: { score: anxietyScore, max: 16 },
      depression: { score: depressionScore, max: 16 },
      burnout: { score: burnoutScore, max: 16 },
      sleep: { score: sleepScore, max: 12 }
    };
  };

  const getLevel = (score, max) => {
    const percentage = (score / max) * 100;
    if (percentage < 25) return { label: 'Low', color: '#4CAF50' };
    if (percentage < 50) return { label: 'Mild', color: '#FFC107' };
    if (percentage < 75) return { label: 'Moderate', color: '#FF9800' };
    return { label: 'High', color: '#F44336' };
  };

  const scores = calculateScores();

  return (
    <div className="results-container">
      <div className="results-header card">
        <h1 className="results-title">Your Assessment Results</h1>
        <p className="results-subtitle">
          Here's a breakdown of your mental health indicators
        </p>
      </div>

      <div className="results-grid">
        {Object.entries(scores).map(([category, data]) => {
          const level = getLevel(data.score, data.max);
          const percentage = (data.score / data.max) * 100;

          return (
            <div key={category} className="result-card card">
              <h3 className="result-category">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className="result-score">
                <span className="score-value">{data.score}</span>
                <span className="score-max">/ {data.max}</span>
              </div>
              <div className="result-bar">
                <div 
                  className="result-bar-fill" 
                  style={{ 
                    width: `${percentage}%`,
                    background: level.color
                  }}
                ></div>
              </div>
              <div className="result-level" style={{ color: level.color }}>
                {level.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="results-info card">
        <h2>Important Information</h2>
        <div className="info-box">
          <p>
            <FaExclamationTriangle style={{ marginRight: '8px', verticalAlign: 'middle' }} /> <strong>This is an awareness tool only.</strong> These results are not a clinical diagnosis 
            and should not be used as a substitute for professional medical advice.
          </p>
          <p>
            If you're experiencing significant distress or mental health concerns, please consider 
            reaching out to a qualified mental health professional or counselor.
          </p>
        </div>
        
        <div className="results-actions">
          <button className="btn btn-secondary" onClick={onRetake}>
            Retake Assessment
          </button>
          <button className="btn btn-primary" onClick={onHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
