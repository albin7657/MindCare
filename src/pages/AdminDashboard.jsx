import { useState, useEffect } from 'react';
import { FaUsers, FaChartBar, FaQuestionCircle, FaCog, FaSignOutAlt, FaPlus, FaTrash, FaEdit, FaHistory, FaCalculator, FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import './AdminDashboard.css';

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [domains, setDomains] = useState([]);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ domainId: '', text: '', weight: 1 });
  const [newDomain, setNewDomain] = useState({ name: '', color: '#3498db' });
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null); // For navigating to domain detail view
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [newOption, setNewOption] = useState({ value: '', label: '' });
  
  // Scoring thresholds (editable)
  const [scoringThresholds, setScoringThresholds] = useState({
    low: { max: 24.99, label: 'Low', color: '#48bb78' },
    mild: { min: 25, max: 49.99, label: 'Mild', color: '#f6ad55' },
    moderate: { min: 50, max: 74.99, label: 'Moderate', color: '#ed8936' },
    high: { min: 75, label: 'High', color: '#FF8F8F' }
  });
  const [editingThresholds, setEditingThresholds] = useState(false);
  
  // Test history (empty by default)
  const [testHistory, setTestHistory] = useState([]);

  // Alert management
  const [alert, setAlert] = useState(null);

  // Auto-dismiss alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch domains from backend on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/domains');
        if (!res.ok) throw new Error('Failed fetching domains');
        const data = await res.json();

        const mapped = await Promise.all(data.map(async (d) => {
          const domainId = d._id || d.id;
          let questions = [];
          try {
            const qRes = await fetch(`http://localhost:5000/api/questions/domain/${domainId}`);
            if (qRes.ok) {
              const qData = await qRes.json();
              questions = await Promise.all(qData.map(async (q) => {
                const qId = q._id || q.id;
                let options = [];
                try {
                  const oRes = await fetch(`http://localhost:5000/api/options/question/${qId}`);
                  if (oRes.ok) options = await oRes.json();
                } catch (e) {
                  console.error('Failed fetching options for question', qId, e);
                }
                return { id: qId, text: q.question_text || q.text || '', weight: q.weight || 1, options };
              }));
            }
          } catch (e) {
            console.error('Failed fetching questions for domain', domainId, e);
          }

          return {
            id: domainId,
            name: d.domain_name || d.name,
            color: d.color || '#3498db',
            questions
          };
        }));

        setDomains(mapped);
      } catch (err) {
        console.error('Error fetching domains:', err);
      }
    };

    fetchDomains();
  }, []);

  // When a domain is selected, fetch its questions from backend
  useEffect(() => {
    if (!selectedDomain) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/questions/domain/${selectedDomain}`);
        if (!res.ok) throw new Error('Failed fetching questions');
        const data = await res.json();

        const questions = await Promise.all(data.map(async (q) => {
          const qId = q._id || q.id;
          let options = [];
          try {
            const oRes = await fetch(`http://localhost:5000/api/options/question/${qId}`);
            if (oRes.ok) options = await oRes.json();
          } catch (e) {
            console.error('Failed fetching options for question', qId, e);
          }
          return { id: qId, text: q.question_text || q.text || '', weight: q.weight || 1, options };
        }));

        setDomains(prev => prev.map(d => {
          if (d.id === selectedDomain) {
            return { ...d, questions };
          }
          return d;
        }));
      } catch (err) {
        console.error('Error fetching questions for domain', selectedDomain, err);
      }
    };

    fetchQuestions();
  }, [selectedDomain]);

  // Test history sorting and filtering state
  const [sortBy, setSortBy] = useState('date'); // 'date', 'userId', 'avgScore'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'low', 'mild', 'moderate', 'high'

  // Mock data for testing statistics
  const mockStats = {
    totalTests: 0,
    todayTests: 0,
    weekTests: 0,
    monthTests: 0,
    avgStressScore: 0,
    avgAnxietyScore: 0,
    avgDepressionScore: 0,
    avgBurnoutScore: 0,
    avgSleepScore: 0
  };

  const handleEditQuestion = (domainId, index) => {
    const domain = domains.find(d => d.id === domainId);
    setEditingQuestion({ 
      domainId, 
      index, 
      text: domain.questions[index].text,
      weight: domain.questions[index].weight
    });
  };

  const handleSaveQuestion = () => {
    (async () => {
      if (!editingQuestion) return;
      const { domainId, index, text, weight } = editingQuestion;
      try {
        const domain = domains.find(d => d.id === domainId);
        const q = domain?.questions?.[index];
        if (q && q.id) {
          const res = await fetch(`http://localhost:5000/api/questions/${q.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question_text: text, weight: parseFloat(weight) || 1 })
          });
          if (!res.ok) throw new Error('Failed to update question');
          const updated = await res.json();
          setDomains(prev => prev.map(d => {
            if (d.id === domainId) {
              const updatedQuestions = [...d.questions];
              updatedQuestions[index] = { ...updatedQuestions[index], id: updated._id || updated.id, text: updated.question_text || text, weight: updated.weight || parseFloat(weight) || 1 };
              return { ...d, questions: updatedQuestions };
            }
            return d;
          }));
        } else {
          setDomains(prev => prev.map(d => {
            if (d.id === domainId) {
              const updatedQuestions = [...d.questions];
              updatedQuestions[index] = { text, weight: parseFloat(weight) || 1 };
              return { ...d, questions: updatedQuestions };
            }
            return d;
          }));
        }
        setEditingQuestion(null);
      } catch (err) {
        console.error('Save question error', err);
        setAlert({ type: 'error', message: 'Failed to save question' });
      }
    })();
  };

  const handleAddQuestion = () => {
    (async () => {
      if (!newQuestion.text.trim()) return setAlert({ type: 'error', message: 'Enter question text' });
      try {
        const res = await fetch('http://localhost:5000/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain_id: newQuestion.domainId, question_text: newQuestion.text, weight: newQuestion.weight })
        });

        if (!res.ok) {
          const error = await res.json();
          return setAlert({ type: 'error', message: error.error || 'Failed to create question' });
        }
        const created = await res.json();

        setDomains(prev => prev.map(d => {
          if (d.id === newQuestion.domainId) {
            const q = { id: created._id || created.id, text: created.question_text || created.text, weight: created.weight || 1, options: created.options || [] };
            return { ...d, questions: [...d.questions, q] };
          }
          return d;
        }));

        setNewQuestion({ domainId: '', text: '', weight: 1 });
        setAlert({ type: 'success', message: 'Question added successfully' });
      } catch (err) {
        console.error('Add question error', err);
        setAlert({ type: 'error', message: 'Failed to add question' });
      }
    })();
  };

  const handleDeleteQuestion = (domainId, index) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    (async () => {
      try {
        const domain = domains.find(d => d.id === domainId);
        if (!domain) return;
        const question = domain.questions[index];
        if (!question || !question.id) {
          setDomains(prev => prev.map(d => d.id === domainId ? { ...d, questions: d.questions.filter((_, i) => i !== index) } : d));
          return;
        }

        const res = await fetch(`http://localhost:5000/api/questions/${question.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete question');

        setDomains(prev => prev.map(d => d.id === domainId ? { ...d, questions: d.questions.filter(q => q.id !== question.id) } : d));
        setAlert({ type: 'success', message: 'Question deleted successfully' });
      } catch (err) {
        console.error('Delete question error', err);
        setAlert({ type: 'error', message: 'Failed to delete question' });
      }
    })();
  };

  const handleAddDomain = () => {
    (async () => {
      if (!newDomain.name.trim()) return setAlert({ type: 'error', message: 'Enter domain name' });
      try {
        const res = await fetch('http://localhost:5000/api/domains', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain_name: newDomain.name, color: newDomain.color })
        });
        if (!res.ok) {
          const error = await res.json();
          return setAlert({ type: 'error', message: error.error || 'Failed to create domain' });
        }
        const created = await res.json();
        const d = { id: created._id || created.id, name: created.domain_name || created.name || newDomain.name, color: created.color || newDomain.color, questions: [] };
        setDomains(prev => [...prev, d]);
        setNewDomain({ name: '', color: '#3498db' });
        setShowAddDomain(false);
        setAlert({ type: 'success', message: 'Domain added successfully' });
      } catch (err) {
        console.error('Add domain error', err);
        setAlert({ type: 'error', message: 'Failed to add domain' });
      }
    })();
  };

  const handleDeleteDomain = (domainId) => {
    if (!window.confirm('Are you sure you want to delete this entire domain and all its questions?')) return;

    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/domains/${domainId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete domain');
        setDomains(prev => prev.filter(d => d.id !== domainId));
        setAlert({ type: 'success', message: 'Domain deleted successfully' });
      } catch (err) {
        console.error('Delete domain error', err);
        setAlert({ type: 'error', message: 'Failed to delete domain' });
      }
    })();
  };

  const calculateMaxScore = (domain) => {
    return domain.questions.reduce((sum, q) => sum + (q.weight * 4), 0);
  };

  const getScoreLevel = (percentage) => {
    if (percentage < scoringThresholds.mild.min) return scoringThresholds.low;
    if (percentage < scoringThresholds.moderate.min) return scoringThresholds.mild;
    if (percentage < scoringThresholds.high.min) return scoringThresholds.moderate;
    return scoringThresholds.high;
  };

  const handleSaveThresholds = () => {
    setEditingThresholds(false);
  };

  const toggleQuestionExpand = (domainId, index) => {
    const key = `${domainId}-${index}`;
    setExpandedQuestion(expandedQuestion === key ? null : key);
  };

  const handleAddOption = (domainId, questionIndex) => {
    (async () => {
      if (!newOption.label.trim() || newOption.value === '') return setAlert({ type: 'error', message: 'Enter option text and points' });
      try {
        const domain = domains.find(d => d.id === domainId);
        if (!domain) return;
        const question = domain.questions[questionIndex];
        if (!question || !question.id) return setAlert({ type: 'error', message: 'Question not found' });

        const res = await fetch('http://localhost:5000/api/options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_id: question.id,
            option_text: newOption.label,
            points: parseInt(newOption.value) || 0
          })
        });
        if (!res.ok) {
          const error = await res.json();
          return setAlert({ type: 'error', message: error.error || 'Failed to create option' });
        }
        const created = await res.json();

        setDomains(prev => prev.map(d => {
          if (d.id === domainId) {
            const updatedQuestions = [...d.questions];
            updatedQuestions[questionIndex] = {
              ...updatedQuestions[questionIndex],
              options: [...(updatedQuestions[questionIndex].options || []), created]
            };
            return { ...d, questions: updatedQuestions };
          }
          return d;
        }));
        setNewOption({ value: '', label: '' });
        setAlert({ type: 'success', message: 'Option added successfully' });
      } catch (err) {
        console.error('Add option error', err);
        setAlert({ type: 'error', message: 'Failed to add option' });
      }
    })();
  };

  const handleDeleteOption = (domainId, questionIndex, optionId) => {
    if (!window.confirm('Delete this option?')) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/options/${optionId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete option');

        setDomains(prev => prev.map(d => {
          if (d.id === domainId) {
            const updatedQuestions = [...d.questions];
            updatedQuestions[questionIndex] = {
              ...updatedQuestions[questionIndex],
              options: updatedQuestions[questionIndex].options.filter(opt => opt._id !== optionId)
            };
            return { ...d, questions: updatedQuestions };
          }
          return d;
        }));
        setAlert({ type: 'success', message: 'Option deleted successfully' });
      } catch (err) {
        console.error('Delete option error', err);
        setAlert({ type: 'error', message: 'Failed to delete option' });
      }
    })();
  };

  const getQuestionOptions = (domainId, questionIndex) => {
    const domain = domains.find(d => d.id === domainId);
    if (!domain) return [];
    const question = domain.questions[questionIndex];
    return question?.options || [];
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h2 className="section-title">Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#13283A' }}>
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Tests Taken</h3>
            <p className="stat-number">{mockStats.totalTests}</p>
            <span className="stat-label">All time</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#6F8CAB' }}>
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>Today's Tests</h3>
            <p className="stat-number">{mockStats.todayTests}</p>
            <span className="stat-label">Last 24 hours</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EDDCB4', color: '#13283A' }}>
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>This Week</h3>
            <p className="stat-number">{mockStats.weekTests}</p>
            <span className="stat-label">Last 7 days</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4A9B8E' }}>
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p className="stat-number">{mockStats.monthTests}</p>
            <span className="stat-label">Last 30 days</span>
          </div>
        </div>
      </div>

      <h3 className="subsection-title">Average Scores by Domain</h3>
      <div className="scores-grid">
        {domains.map((domain) => {
          const maxScore = calculateMaxScore(domain);
          const avgScore = mockStats[`avg${domain.name.replace(/\s+/g, '')}Score`] || 0;
          const percentage = maxScore > 0 ? (avgScore / maxScore) * 100 : 0;
          
          return (
            <div key={domain.id} className="score-item">
              <span className="score-label">{domain.name}</span>
              <span className="score-value">{avgScore.toFixed(1)}/{maxScore}</span>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${percentage}%`, background: domain.color }}></div>
              </div>
              <span className="score-sublabel">{domain.questions.length} questions</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderQuestions = () => {
    // If a domain is selected, show the domain detail view
    if (selectedDomain) {
      const domain = domains.find(d => d.id === selectedDomain);
      if (!domain) {
        setSelectedDomain(null);
        return null;
      }

      return (
        <div className="domain-detail-view">
          <div className="domain-detail-header">
            <button className="btn-back" onClick={() => {
              setSelectedDomain(null);
              setEditingQuestion(null);
              setExpandedQuestion(null);
            }}>
              <FaArrowLeft /> Back to Domains
            </button>
            <h2 className="domain-detail-title" style={{ borderLeftColor: domain.color }}>
              <span className="domain-color-badge" style={{ backgroundColor: domain.color }}></span>
              {domain.name}
            </h2>
            <button 
              className="btn-delete-domain" 
              onClick={() => {
                if (window.confirm(`Delete entire ${domain.name} domain and all its questions?`)) {
                  handleDeleteDomain(domain.id);
                  setSelectedDomain(null);
                }
              }}
              title="Delete entire domain"
            >
              <FaTrash /> Delete Domain
            </button>
          </div>

          <div className="domain-stats-bar">
            <div className="domain-stat">
              <strong>{domain.questions.length}</strong> Questions
            </div>
            <div className="domain-stat">
              <strong>{calculateMaxScore(domain)}</strong> Max Score
            </div>
          </div>

          <div className="questions-list">
            {domain.questions.map((question, index) => {
              const questionKey = `${domain.id}-${index}`;
              const isExpanded = expandedQuestion === questionKey;
              const options = getQuestionOptions(domain.id, index);
              
              return (
                <div key={index} className={`question-item ${isExpanded ? 'question-item-expanded' : ''}`}>
                  {editingQuestion?.domainId === domain.id && editingQuestion?.index === index ? (
                    <div className="question-edit">
                      <textarea
                        value={editingQuestion.text}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                        className="question-textarea"
                        placeholder="Question text"
                      />
                      <div className="weight-input-group">
                        <label>Weightage:</label>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={editingQuestion.weight}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, weight: e.target.value })}
                          className="weight-input"
                        />
                      </div>
                      <div className="question-actions">
                        <button className="btn-save" onClick={handleSaveQuestion}>Save</button>
                        <button className="btn-cancel" onClick={() => setEditingQuestion(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="question-main-row" onClick={() => toggleQuestionExpand(domain.id, index)} style={{ cursor: 'pointer' }}>
                        <span className="question-number">Q{index + 1}</span>
                        <span className="question-text">{question.text}</span>
                        <span className="question-weight" title="Weight multiplier">×{question.weight}</span>
                        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                      <div className="question-controls" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-edit" onClick={() => handleEditQuestion(domain.id, index)}>
                          <FaEdit />
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteQuestion(domain.id, index)}>
                          <FaTrash />
                        </button>
                      </div>
                      
                      {isExpanded && (
                        <div className="question-options-container">
                          <div className="options-header">
                            <h4>Answer Options ({options.length} options)</h4>
                          </div>
                          
                          <div className="options-list">
                            {options.map((option, optIdx) => (
                              <div key={optIdx} className="option-item">
                                <span className="option-value-badge">{option.points || option.value || 0}</span>
                                <span className="option-label-display">{option.option_text || option.label || ''}</span>
                                <button 
                                  className="btn-option-delete" 
                                  onClick={() => handleDeleteOption(domain.id, index, option._id || option.id)}
                                  title="Delete option"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="add-option-form">
                            <input
                              type="number"
                              value={newOption.value}
                              onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                              placeholder="Points"
                              className="option-value-input"
                            />
                            <input
                              type="text"
                              value={newOption.label}
                              onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                              placeholder="Option Text"
                              className="option-label-input"
                            />
                            <button 
                              className="btn-add-option" 
                              onClick={() => handleAddOption(domain.id, index)}
                            >
                              <FaPlus /> Add Option
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="add-question-section-inline">
            <h3 className="subsection-title">Add New Question to {domain.name}</h3>
            <div className="add-question-form">
              <textarea
                value={newQuestion.domainId === domain.id ? newQuestion.text : ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, domainId: domain.id, text: e.target.value })}
                placeholder="Enter new question text..."
                className="question-textarea"
              />
              <div className="weight-input-group">
                <label>Weightage:</label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={newQuestion.domainId === domain.id ? newQuestion.weight : 1}
                  onChange={(e) => setNewQuestion({ ...newQuestion, domainId: domain.id, weight: e.target.value })}
                  className="weight-input"
                />
                <span className="weight-help">Max contribution: {((newQuestion.domainId === domain.id ? newQuestion.weight : 1) * 4).toFixed(1)} points</span>
              </div>
              <button className="btn btn-primary" onClick={() => {
                if (newQuestion.text.trim()) {
                  handleAddQuestion();
                  setNewQuestion({ domainId: domain.id, text: '', weight: 1 });
                }
              }}>
                <FaPlus /> Add Question
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default view: Show domain list
    return (
      <div className="questions-section">
        <h2 className="section-title">Domain Management</h2>
        <p className="section-subtitle">Select a domain to view and edit its questions</p>
        
        <div className="add-domain-container">
          {showAddDomain ? (
            <div className="add-domain-form">
              <input
                type="text"
                value={newDomain.name}
                onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                placeholder="Domain name (e.g., Resilience)"
                className="domain-input"
              />
              <input
                type="color"
                value={newDomain.color}
                onChange={(e) => setNewDomain({ ...newDomain, color: e.target.value })}
                className="color-input"
                title="Choose domain color"
              />
              <button className="btn-save" onClick={handleAddDomain}>Add Domain</button>
              <button className="btn-cancel" onClick={() => setShowAddDomain(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowAddDomain(true)}>
              <FaPlus /> Add New Domain
            </button>
          )}
        </div>

        <div className="domains-grid">
          {domains.map((domain) => (
            <div 
              key={domain.id} 
              className="domain-card" 
              onClick={() => setSelectedDomain(domain.id)}
              style={{ borderTopColor: domain.color }}
            >
              <div className="domain-card-header">
                <span className="domain-color-badge-large" style={{ backgroundColor: domain.color }}></span>
                <h3 className="domain-card-title">{domain.name}</h3>
              </div>
              <div className="domain-card-stats">
                <div className="domain-card-stat">
                  <FaQuestionCircle style={{ color: domain.color }} />
                  <span><strong>{domain.questions.length}</strong> Questions</span>
                </div>
                <div className="domain-card-stat">
                  <FaCalculator style={{ color: domain.color }} />
                  <span><strong>{calculateMaxScore(domain)}</strong> Max Score</span>
                </div>
              </div>
              <div className="domain-card-footer">
                <span className="domain-card-link" style={{ color: domain.color }}>
                  View & Edit Questions →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScoring = () => (
    <div className="scoring-section">
      <h2 className="section-title">Scoring Logic</h2>
      
      <div className="scoring-info">
        <div className="scoring-card">
          <h3>Scale Values</h3>
          <ul className="scoring-list">
            <li><strong>0</strong> - Never</li>
            <li><strong>1</strong> - Rarely</li>
            <li><strong>2</strong> - Sometimes</li>
            <li><strong>3</strong> - Often</li>
            <li><strong>4</strong> - Almost Always</li>
          </ul>
          <p className="scoring-note">
            Each question response (0-4) is multiplied by its weightage to calculate the final score.
          </p>
        </div>

        <div className="scoring-card">
          <h3>Domain Calculations</h3>
          {domains.map(domain => (
            <div key={domain.id} className="calculation-item">
              <h4 style={{ color: domain.color }}>{domain.name}</h4>
              <p>{domain.questions.length} questions with individual weightages</p>
              <p className="formula">Max Score: {calculateMaxScore(domain)}</p>
              <div className="weightage-breakdown">
                {domain.questions.map((q, idx) => (
                  <div key={idx} className="weight-item">
                    <span>Q{idx + 1}: ×{q.weight}</span>
                    <span className="weight-max">Max: {(q.weight * 4).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="scoring-card">
          <div className="scoring-header">
            <h3>Level Classification Thresholds</h3>
            {!editingThresholds ? (
              <button className="btn-edit" onClick={() => setEditingThresholds(true)}>
                <FaEdit /> Edit Thresholds
              </button>
            ) : (
              <button className="btn-save" onClick={handleSaveThresholds}>
                Save Changes
              </button>
            )}
          </div>
          
          {editingThresholds ? (
            <div className="threshold-editor">
              <div className="threshold-input-group">
                <label style={{ color: scoringThresholds.low.color }}>
                  <strong>{scoringThresholds.low.label}:</strong> Less than
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={scoringThresholds.mild.min}
                  onChange={(e) => setScoringThresholds({
                    ...scoringThresholds,
                    low: { ...scoringThresholds.low, max: parseFloat(e.target.value) - 0.01 },
                    mild: { ...scoringThresholds.mild, min: parseFloat(e.target.value) }
                  })}
                  className="threshold-input"
                />
                <span>%</span>
              </div>
              
              <div className="threshold-input-group">
                <label style={{ color: scoringThresholds.mild.color }}>
                  <strong>{scoringThresholds.mild.label}:</strong>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={scoringThresholds.mild.min}
                  onChange={(e) => setScoringThresholds({
                    ...scoringThresholds,
                    low: { ...scoringThresholds.low, max: parseFloat(e.target.value) - 0.01 },
                    mild: { ...scoringThresholds.mild, min: parseFloat(e.target.value) }
                  })}
                  className="threshold-input"
                />
                <span>% -</span>
                <input
                  type="number"
                  step="0.01"
                  value={scoringThresholds.mild.max}
                  onChange={(e) => setScoringThresholds({
                    ...scoringThresholds,
                    mild: { ...scoringThresholds.mild, max: parseFloat(e.target.value) },
                    moderate: { ...scoringThresholds.moderate, min: parseFloat(e.target.value) + 0.01 }
                  })}
                  className="threshold-input"
                />
                <span>%</span>
              </div>
              
              <div className="threshold-input-group">
                <label style={{ color: scoringThresholds.moderate.color }}>
                  <strong>{scoringThresholds.moderate.label}:</strong>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={scoringThresholds.moderate.min}
                  onChange={(e) => setScoringThresholds({
                    ...scoringThresholds,
                    mild: { ...scoringThresholds.mild, max: parseFloat(e.target.value) - 0.01 },
                    moderate: { ...scoringThresholds.moderate, min: parseFloat(e.target.value) }
                  })}
                  className="threshold-input"
                />
                <span>% -</span>
                <input
                  type="number"
                  step="0.01"
                  value={scoringThresholds.moderate.max}
                  onChange={(e) => setScoringThresholds({
                    ...scoringThresholds,
                    moderate: { ...scoringThresholds.moderate, max: parseFloat(e.target.value) },
                    high: { ...scoringThresholds.high, min: parseFloat(e.target.value) + 0.01 }
                  })}
                  className="threshold-input"
                />
                <span>%</span>
              </div>
              
              <div className="threshold-input-group">
                <label style={{ color: scoringThresholds.high.color }}>
                  <strong>{scoringThresholds.high.label}:</strong> Greater than or equal to
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={scoringThresholds.high.min}
                  onChange={(e) => setScoringThresholds({
                    ...scoringThresholds,
                    moderate: { ...scoringThresholds.moderate, max: parseFloat(e.target.value) - 0.01 },
                    high: { ...scoringThresholds.high, min: parseFloat(e.target.value) }
                  })}
                  className="threshold-input"
                />
                <span>%</span>
              </div>
            </div>
          ) : (
            <ul className="scoring-list">
              <li>
                <strong style={{ color: scoringThresholds.low.color }}>
                  {scoringThresholds.low.label}:
                </strong> &lt; {scoringThresholds.low.max.toFixed(2)}%
              </li>
              <li>
                <strong style={{ color: scoringThresholds.mild.color }}>
                  {scoringThresholds.mild.label}:
                </strong> {scoringThresholds.mild.min.toFixed(2)}% - {scoringThresholds.mild.max.toFixed(2)}%
              </li>
              <li>
                <strong style={{ color: scoringThresholds.moderate.color }}>
                  {scoringThresholds.moderate.label}:
                </strong> {scoringThresholds.moderate.min.toFixed(2)}% - {scoringThresholds.moderate.max.toFixed(2)}%
              </li>
              <li>
                <strong style={{ color: scoringThresholds.high.color }}>
                  {scoringThresholds.high.label}:
                </strong> ≥ {scoringThresholds.high.min.toFixed(2)}%
              </li>
            </ul>
          )}
          <p className="scoring-note">
            Formula: (User Score / Max Score) × 100 = Percentage
          </p>
        </div>
      </div>
    </div>
  );

  const renderTestHistory = () => {
    // Apply filtering
    let filteredData = testHistory.filter(test => {
      // Filter by domain
      if (filterDomain !== 'all' && !test.domains.map(d => d.toLowerCase()).includes(filterDomain.toLowerCase())) {
        return false;
      }
      
      // Filter by status
      if (filterStatus !== 'all') {
        const scoreEntries = Object.entries(test.scores);
        const avgPercentage = scoreEntries.reduce((sum, [domain, score]) => sum + score, 0) / scoreEntries.length;
        const level = getScoreLevel(avgPercentage);
        if (level.label.toLowerCase() !== filterStatus.toLowerCase()) {
          return false;
        }
      }
      
      return true;
    });

    // Apply sorting
    filteredData = [...filteredData].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'userId') {
        comparison = a.userId.localeCompare(b.userId);
      } else if (sortBy === 'avgScore') {
        const avgA = Object.values(a.scores).reduce((sum, score) => sum + score, 0) / Object.values(a.scores).length;
        const avgB = Object.values(b.scores).reduce((sum, score) => sum + score, 0) / Object.values(b.scores).length;
        comparison = avgA - avgB;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return (
    <div className="test-history-section">
      <h2 className="section-title">Test Submission History</h2>
      
      <div className="history-stats">
        <div className="history-stat-card">
          <FaUsers />
          <div>
            <h3>{testHistory.length}</h3>
            <p>Total Submissions</p>
          </div>
        </div>
        <div className="history-stat-card">
          <FaHistory />
          <div>
            <h3>{testHistory.filter(t => t.date.startsWith('2026-02-05')).length}</h3>
            <p>Today's Tests</p>
          </div>
        </div>
        <div className="history-stat-card">
          <FaChartBar />
          <div>
            <h3>{new Set(testHistory.map(t => t.userId)).size}</h3>
            <p>Unique Users</p>
          </div>
        </div>
      </div>

      {/* Sorting and Filtering Controls */}
      <div className="history-controls">
        <div className="control-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="history-select">
            <option value="date">Date & Time</option>
            <option value="userId">User ID</option>
            <option value="avgScore">Average Score</option>
          </select>
          
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="history-select">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="control-group">
          <label>Filter by Domain:</label>
          <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} className="history-select">
            <option value="all">All Domains</option>
            {domains.map(domain => (
              <option key={domain.id} value={domain.name}>{domain.name}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="history-select">
            <option value="all">All Statuses</option>
            <option value="low">Low</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="test-history-table-container">
        <table className="test-history-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>User ID</th>
              <th>Domains Tested</th>
              <th>Scores</th>
              <th>Overall Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No test submissions match the selected filters</td>
              </tr>
            ) : (
              filteredData.map((test) => {
              const scoreEntries = Object.entries(test.scores);
              const avgPercentage = scoreEntries.reduce((sum, [domain, score]) => sum + score, 0) / scoreEntries.length;
              const level = getScoreLevel(avgPercentage);
              
              return (
                <tr key={test.id}>
                  <td className="date-cell">{test.date}</td>
                  <td className="user-cell">{test.userId}</td>
                  <td className="domains-cell">
                    <div className="domain-tags">
                      {test.domains.map((domain, idx) => (
                        <span key={idx} className="domain-tag">{domain}</span>
                      ))}
                    </div>
                  </td>
                  <td className="scores-cell">
                    <div className="score-details">
                      {scoreEntries.map(([domain, score]) => (
                        <div key={domain} className="score-chip">
                          <span className="score-domain">{domain}:</span>
                          <span className="score-value">{score}%</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="status-cell">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: level.color, color: 'white' }}
                    >
                      {level.label}
                    </span>
                    <span className="avg-score">{avgPercentage.toFixed(1)}%</span>
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  };

  return (
    <div className="admin-dashboard">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <span className="alert-message">{alert.message}</span>
          <button className="alert-close" onClick={() => setAlert(null)}>×</button>
        </div>
      )}
      <div className="admin-sidebar">
        <div className="admin-brand">
          <h2>MindCare Admin</h2>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartBar /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> Test History
          </button>
          <button 
            className={`nav-item ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <FaQuestionCircle /> Questions
          </button>
          <button 
            className={`nav-item ${activeTab === 'scoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('scoring')}
          >
            <FaCalculator /> Scoring Logic
          </button>
        </nav>

        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="admin-main">
        <div className="admin-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'history' && renderTestHistory()}
          {activeTab === 'questions' && renderQuestions()}
          {activeTab === 'scoring' && renderScoring()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
