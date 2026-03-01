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

  const {
    total_score,
    maximum_total_score,
    overall_normalized_score,
    risk_level,
    domain_scores,
    recommendations
  } = results;

  const getRiskColor = (level) => {
    if (level.includes('Low')) return '#4CAF50';
    if (level.includes('Medium')) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="results-container">
      <div className="results-header card">
        <h1 className="results-title">Your Assessment Results</h1>
        <p className="results-subtitle">
          Overall Status: <strong style={{ color: getRiskColor(risk_level) }}>{risk_level}</strong>
        </p>
        <div className="overall-percentage">
          Normalized Score: {overall_normalized_score.toFixed(1)}%
        </div>
      </div>

      <div className="results-grid">
        {domain_scores.map((domain) => {
          const color = getRiskColor(domain.normalized_score < 40 ? 'Low' : domain.normalized_score < 70 ? 'Medium' : 'High');

          return (
            <div key={domain.domain_id} className="result-card card">
              <h3 className="result-category">{domain.domain_name}</h3>
              <div className="result-score">
                <span className="score-value">{domain.score}</span>
                <span className="score-max">/ {domain.max_score}</span>
              </div>
              <div className="result-bar">
                <div
                  className="result-bar-fill"
                  style={{
                    width: `${domain.normalized_score}%`,
                    background: color
                  }}
                ></div>
              </div>
              <div className="result-percentage">
                {domain.normalized_score.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className="recommendations-section card">
          <h2 className="section-title">Recommendations</h2>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-item">
                <FaExclamationTriangle className="recommendation-icon" />
                <div className="recommendation-content">
                  <strong>Specialized Test Recommended: {rec.test_name}</strong>
                  <p>{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
