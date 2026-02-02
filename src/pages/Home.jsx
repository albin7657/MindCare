import { FaBrain, FaChartLine, FaLock, FaLightbulb } from 'react-icons/fa';
import './Home.css';

function Home({ onStartTest, onNavigate }) {
  return (
    <div className="home-container">
      <div className="hero-section card">
        <h1 className="hero-title">Welcome to MindCare</h1>
        <p className="hero-subtitle">
          Your Mental Wellness Companion
        </p>
        <p className="hero-description">
          Take a comprehensive mental health assessment to understand your stress, 
          anxiety, depression, burnout, and sleep patterns. Get personalized insights 
          to improve your wellbeing.
        </p>
        <button className="btn btn-primary btn-large" onClick={onStartTest}>
          Start Assessment
        </button>
      </div>

      <div className="features-grid">
        <div className="feature-card card">
          <div className="feature-icon"><FaBrain /></div>
          <h3>Comprehensive Assessment</h3>
          <p>20 carefully selected questions covering stress, anxiety, depression, burnout, and sleep quality</p>
        </div>
        
        <div className="feature-card card">
          <div className="feature-icon"><FaChartLine /></div>
          <h3>Instant Results</h3>
          <p>Get immediate feedback and understand your mental health status across multiple dimensions</p>
        </div>
        
        <div className="feature-card card">
          <div className="feature-icon"><FaLock /></div>
          <h3>Private & Secure</h3>
          <p>Your responses are completely confidential and only stored locally on your device</p>
        </div>
        
        <div className="feature-card card">
          <div className="feature-icon"><FaLightbulb /></div>
          <h3>Awareness Tool</h3>
          <p>Designed for educational purposes to increase awareness about mental health</p>
        </div>
      </div>

      <div className="info-section card">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Answer Questions</h4>
              <p>Complete 20 questions across 3 screens at your own pace</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Review Your Responses</h4>
              <p>Navigate back and forth to review or change your answers</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Get Your Results</h4>
              <p>Receive a detailed breakdown of your mental health indicators</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pages-section card">
        <h2>Pages</h2>
        <div className="pages-buttons">
          <button className="btn btn-primary" onClick={() => onNavigate('home2')}>
            BlueHome
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
