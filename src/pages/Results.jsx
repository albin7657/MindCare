import { FaExclamationTriangle } from 'react-icons/fa';
import { calculateScores } from '../utils/assessment';
import './Results.css';

function Results({ results, onRetake, onHome, onDashboard }) {
  if (!results) {
    return (
      <div className="results-container">
        <div className="results-header card">
          <h1 className="results-title">No Results Available</h1>
          <p className="results-subtitle">Take an assessment first to view your insights.</p>
          <div className="results-actions">
            <button className="btn btn-primary" onClick={onRetake}>Start Assessment</button>
            <button className="btn btn-secondary" onClick={onHome}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  const scores = calculateScores(results);

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
                    background: data.level.color
                  }}
                ></div>
              </div>
              <div className="result-level" style={{ color: data.level.color }}>
                {data.level.label}
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
          {onDashboard && (
            <button className="btn btn-secondary" onClick={onDashboard}>
              View My Dashboard
            </button>
          )}
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
