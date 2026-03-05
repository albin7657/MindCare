import { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import '../components/Screen.css';
import './SpecializedTest.css';

function SleepTest({ onComplete, onBack }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/domains/questions-by-domains/Sleep');
                if (!response.ok) throw new Error('Failed to fetch questions');
                const data = await response.json();
                setQuestions(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Failed to load questions. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleSelect = (questionId, value, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: { points: value, option_id: optionId } }));
        setShowWarning(false);
    };

    const handleSubmit = () => {
        const allAnswered = questions.every(q => answers[q._id] !== undefined);
        if (!allAnswered) {
            setShowWarning(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        onComplete({ screen1: answers, screen2: {}, screen3: {}, optional: {} });
    };

    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;
    const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

    return (
        <div className="specialized-test-page">
            <div className="specialized-test-banner sleep-banner">
                <div className="specialized-test-banner-icon">🛏️</div>
                <div>
                    <h1 className="specialized-test-banner-title">Sleep Quality Assessment</h1>
                    <p className="specialized-test-banner-subtitle">
                        Evaluate sleep patterns and how rest affects your wellbeing.
                    </p>
                </div>
            </div>

            <div className="questionnaire-container">
                <div className="progress-bar-container card">
                    <div className="progress-info">
                        <span className="progress-text">
                            {answeredCount} of {totalCount} questions answered
                        </span>
                        <span className="progress-percentage">{progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="questionnaire-content card">
                    {showWarning && (
                        <div className="validation-warning">
                            ⚠️ Please answer all questions before submitting.
                        </div>
                    )}

                    {loading && <div className="loading-message">Loading questions...</div>}
                    {error && <div className="error-message">{error}</div>}

                    {!loading && !error && (
                        <>
                            <div className="screen-header">
                                <h2 className="screen-title">Sleep Quality Assessment</h2>
                                <p className="screen-description">
                                    Please answer the following {questions.length} questions about your sleep patterns.
                                </p>
                            </div>

                            <div className="questions-container">
                                {questions.map((question, index) => {
                                    const scale = question.options
                                        .sort((a, b) => a.points - b.points)
                                        .map(option => ({ value: option.points, label: option.option_text }));

                                    return (
                                        <QuestionCard
                                            key={question._id}
                                            questionNumber={index + 1}
                                            question={question.question_text}
                                            scale={scale}
                                            selectedValue={answers[question._id]?.points}
                                            isUnanswered={showWarning && answers[question._id] === undefined}
                                            onSelect={(value) => {
                                                const opt = question.options.find(o => o.points === value);
                                                handleSelect(question._id, value, opt?._id);
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            <div className="navigation-buttons">
                                <button className="btn btn-secondary" onClick={onBack}>
                                    ← Back
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Submit & View Results
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SleepTest;
