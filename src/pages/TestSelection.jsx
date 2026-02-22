import { useEffect, useState } from 'react';
import { FaBrain, FaHeartBroken, FaFire, FaBed, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './TestSelection.css';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const cardTransition = (index) => ({
  duration: 0.45,
  delay: index * 0.08,
  ease: 'easeOut',
});

function TestSelection({ onStartCombinedTest, onStartSpecificTest }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 160);
    return () => clearTimeout(timer);
  }, []);

  const specificTests = [
    {
      id: 'stress',
      name: 'Stress Assessment',
      description: 'Understand your current stress load and daily pressure patterns.',
      duration: '5–7 min',
      icon: <FaBrain />,
    },
    {
      id: 'anxiety',
      name: 'Anxiety Assessment',
      description: 'Identify anxiety intensity and common emotional triggers.',
      duration: '5–7 min',
      icon: <FaExclamationTriangle />,
    },
    {
      id: 'depression',
      name: 'Depression Assessment',
      description: 'Screen low mood patterns and loss of interest over time.',
      duration: '6–8 min',
      icon: <FaHeartBroken />,
    },
    {
      id: 'burnout',
      name: 'Burnout Assessment',
      description: 'Measure emotional exhaustion and academic fatigue signs.',
      duration: '4–6 min',
      icon: <FaFire />,
    },
    {
      id: 'sleep',
      name: 'Sleep Quality Assessment',
      description: 'Evaluate sleep patterns and how rest affects your wellbeing.',
      duration: '4–6 min',
      icon: <FaBed />,
    },
  ];

  return (
    <div className="test-selection-container">
      <div className="test-background loaded">
        <div className="test-background-surface" aria-hidden="true" />
        <div className="test-gradient-overlay"></div>
      </div>

      <div className={`test-content ${showContent ? 'visible' : ''}`}>
        {/* Combined Test Section */}
        <motion.div
          className="combined-test-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div className="combined-test-card">
            <div className="combined-test-overlay"></div>
            <h2 className="combined-test-title">Combined Mental Health Assessment</h2>
            <p className="combined-test-description">
              Take a comprehensive assessment covering all aspects of your mental wellbeing
            </p>
            <button className="combined-test-btn" onClick={onStartCombinedTest}>
              Begin Assessment
            </button>
          </motion.div>
        </motion.div>

        {/* Individual Tests Section */}
        <motion.div
          className="individual-tests-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h3 className="individual-tests-title">Choose a Specific Test</h3>
          <div className="individual-tests-grid">
            {specificTests.map((test, index) => (
              <motion.div
                key={test.id}
                className="test-card"
                role="button"
                tabIndex={0}
                onClick={() => onStartSpecificTest(test.id)}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
                transition={cardTransition(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    onStartSpecificTest(test.id);
                  }
                }}
              >
                <span className="test-icon">{test.icon}</span>
                <span className="test-name">{test.name}</span>
                <p className="test-description">{test.description}</p>
                <span className="test-time">⏱ {test.duration}</span>
                <button className="test-start-btn" onClick={() => onStartSpecificTest(test.id)}>
                  Start Test →
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TestSelection;
