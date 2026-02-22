import { useEffect, useState } from 'react';
import { FaBrain, FaHeartBroken, FaFire, FaBed, FaExclamationTriangle } from 'react-icons/fa';
import './TestSelection.css';
import combinedImage from '../assets/home_images/combined.jpg';

function TestSelection({ onStartCombinedTest }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = combinedImage;
    img.onload = () => {
      setImageLoaded(true);
      setTimeout(() => setShowContent(true), 300);
    };
  }, []);

  const specificTests = [
    { id: 'stress', name: 'Stress Test', icon: <FaBrain /> },
    { id: 'anxiety', name: 'Anxiety Test', icon: <FaExclamationTriangle /> },
    { id: 'depression', name: 'Depression Test', icon: <FaHeartBroken /> },
    { id: 'burnout', name: 'Burnout Test', icon: <FaFire /> },
    { id: 'sleep', name: 'Sleep Quality Test', icon: <FaBed /> },
  ];

  return (
    <div className="test-selection-container">
      <div className={`test-background ${imageLoaded ? 'loaded' : ''}`}>
        <img src={combinedImage} alt="Combined Test" className="test-background-image" />
        <div className="test-gradient-overlay"></div>
      </div>

      <div className={`test-content ${showContent ? 'visible' : ''}`}>
        {/* Combined Test Section */}
        <div className="combined-test-section">
          <div className="combined-test-card">
            <div className="combined-test-overlay"></div>
            <h2 className="combined-test-title">Combined Mental Health Assessment</h2>
            <p className="combined-test-description">
              Take a comprehensive assessment covering all aspects of your mental wellbeing
            </p>
            <button className="combined-test-btn" onClick={onStartCombinedTest}>
              Begin Assessment
            </button>
          </div>
        </div>

        {/* Individual Tests Section */}
        <div className="individual-tests-section">
          <h3 className="individual-tests-title">Or Choose a Specific Test</h3>
          <div className="individual-tests-grid">
            {specificTests.map((test, index) => (
              <button
                key={test.id}
                className="test-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {/* Coming soon */}}
              >
                <span className="test-icon">{test.icon}</span>
                <span className="test-name">{test.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestSelection;
