import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import About from './pages/About';
import TestSelection from './pages/TestSelection';
import Questionnaire from './pages/Questionnaire';
import Contact from './pages/Contact';
import Results from './pages/Results';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

import { buildAssessmentEntry } from './utils/assessment';
import {
  addUserHistoryEntry,
  clearCurrentUser,
  getCurrentUser,
  getUserHistory,
  setCurrentUser
} from './utils/userData';
import './App.css';

function App() {
  const initialUser = getCurrentUser();
  const [currentPage, setCurrentPage] = useState('home');
  const [quizResults, setQuizResults] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(initialUser);
  const [userHistory, setUserHistory] = useState(() => initialUser?.id ? getUserHistory(initialUser.id) : []);
  // when redirected to login for a specialized test, remember where to go after auth
  const [pendingPage, setPendingPage] = useState(null);

  const saveAttemptToServer = async (answers) => {
    try {
      const res = await fetch('http://localhost:5000/api/assessment-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass authenticatedUser if logged in; backend handles null/anonymous users
        body: JSON.stringify({ user: authenticatedUser || null, answers })
      });

      if (!res.ok) {
        console.error('Server save failed:', res.status);
        return null; // triggers client-side fallback
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error saving attempt:', err);
      return null; // triggers client-side fallback
    }
  };

  // central auth handler which also consumes pendingPage
  const handleAuth = (user) => {
    setCurrentUser(user);
    setAuthenticatedUser(user);
    setUserHistory(getUserHistory(user.id));
    if (user.role === 'admin') {
      setIsAdminAuthenticated(true);
      // admin always goes to dashboard regardless of pending
      setCurrentPage('admin-dashboard');
    } else if (pendingPage) {
      setCurrentPage(pendingPage);
      setPendingPage(null);
    } else {
      setCurrentPage('user-dashboard');
    }
  };

  const handleUserLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
    setAuthenticatedUser(null);
    setUserHistory([]);
    setCurrentPage('home');
  };

  const handleAssessmentComplete = async (answers) => {
    // Always try to save to server and use its computed results
    const serverResponse = await saveAttemptToServer(answers);

    let processedResults;
    if (serverResponse?.results) {
      // Server returned fully computed results (domain_scores, risk_level, etc.)
      processedResults = serverResponse.results;
    } else {
      // Fallback: compute client-side for anonymous / offline users
      const { calculateScores: calcScores } = await import('./utils/assessment');
      const domainScoresRaw = calcScores(answers);
      const domainScoresArr = Object.entries(domainScoresRaw).map(([key, val]) => ({
        domain_id: key,
        domain_name: key.charAt(0).toUpperCase() + key.slice(1),
        score: val.score,
        max_score: val.max,
        normalized_score: val.percentage
      }));
      const total_score = domainScoresArr.reduce((s, d) => s + d.score, 0);
      const maximum_total_score = domainScoresArr.reduce((s, d) => s + d.max_score, 0);
      const overall_normalized_score = maximum_total_score > 0
        ? (total_score / maximum_total_score) * 100
        : 0;
      processedResults = {
        total_score,
        maximum_total_score,
        overall_normalized_score,
        risk_level: overall_normalized_score < 40 ? 'Low Risk' : overall_normalized_score < 70 ? 'Medium Risk' : 'High Risk',
        domain_scores: domainScoresArr,
        recommendations: []
      };
    }

    setQuizResults(processedResults);

    if (authenticatedUser?.id) {
      const entry = buildAssessmentEntry(answers);
      const updatedHistory = addUserHistoryEntry(authenticatedUser.id, entry);
      setUserHistory(updatedHistory);
    }

    setCurrentPage('results');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStartTest={() => setCurrentPage('test-selection')} onNavigate={setCurrentPage} />;
      case 'home2':
        return <Home2 onStart={() => setCurrentPage('test-selection')} />;
      case 'test-selection':
        return <TestSelection onStartCombinedTest={() => setCurrentPage('questionnaire')} onStartSpecificTest={(testId) => setCurrentPage(`test-${testId}`)} />;
      case 'questionnaire':
        return <Questionnaire onComplete={handleAssessmentComplete} onBack={() => setCurrentPage('home')} />;
      case 'tests':
        return <TestSelection onStartCombinedTest={() => setCurrentPage('questionnaire')} onStartSpecificTest={(testId) => setCurrentPage(`test-${testId}`)} />;
      case 'test-stress':
      case 'test-anxiety':
      case 'test-depression':
      case 'test-burnout':
      case 'test-sleep':
        // make sure user is signed in before showing specialized test
        if (!currentUser && !authenticatedUser) {
          setPendingPage(currentPage);
          setCurrentPage('login');
          return null; // will re-render as login
        }
        return <Questionnaire onComplete={handleAssessmentComplete} onBack={() => setCurrentPage('test-selection')} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={setCurrentPage} onAuth={handleAuth} />;
      case 'user-dashboard':
        if (!authenticatedUser) {
          setCurrentPage('login');
          return <Login onNavigate={setCurrentPage} onAuth={handleAuth} />;
        }
        return (
          <UserDashboard
            user={authenticatedUser}
            history={userHistory}
            view="overview"
            onOpenTests={() => setCurrentPage('test-selection')}
            onStartCombinedTest={() => setCurrentPage('questionnaire')}
            onStartSpecificTest={(testId) => setCurrentPage(`test-${testId}`)}
          />
        );
      case 'user-analytics':
      case 'user-history':
      case 'user-recommendations':
        if (!authenticatedUser) {
          setCurrentPage('login');
          return <Login onNavigate={setCurrentPage} onAuth={handleAuth} />;
        }
        return (
          <UserDashboard
            user={authenticatedUser}
            history={userHistory}
            view={currentPage === 'user-analytics' ? 'analytics' : currentPage === 'user-history' ? 'history' : 'recommendations'}
            onOpenTests={() => setCurrentPage('test-selection')}
            onStartCombinedTest={() => setCurrentPage('questionnaire')}
            onStartSpecificTest={(testId) => setCurrentPage(`test-${testId}`)}
          />
        );
      case 'admin-login':
        return <AdminLogin onLogin={(user) => {
          setIsAdminAuthenticated(true);
          setCurrentUser(user);
          setCurrentPage('admin-dashboard');
        }} onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        if (!isAdminAuthenticated) {
          setCurrentPage('admin-login');
          return <AdminLogin onLogin={(user) => {
            setIsAdminAuthenticated(true);
            setCurrentUser(user);
            setCurrentPage('admin-dashboard');
          }} onNavigate={setCurrentPage} />;
        }
        return <AdminDashboard currentUser={currentUser} onLogout={() => {
          setIsAdminAuthenticated(false);
          setCurrentUser(null);
          setCurrentPage('home');
        }} />;
      case 'results':
        return (
          <Results
            results={quizResults}
            onRetake={() => setCurrentPage('questionnaire')}
            onHome={() => setCurrentPage('home')}
            onDashboard={authenticatedUser ? () => setCurrentPage('user-dashboard') : undefined}
          />
        );
      default:
        return <Home onStartTest={() => setCurrentPage('test-selection')} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      {currentPage !== 'admin-dashboard' && currentPage !== 'admin-login' && (
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentUser={authenticatedUser}
          isUserAuthenticated={Boolean(authenticatedUser)}
          onUserLogout={handleUserLogout}
          onLogout={handleUserLogout}
        />
      )}
      <main className={`main-content ${currentPage !== 'home' &&
        currentPage !== 'home2' &&
        currentPage !== 'test-selection' &&
        currentPage !== 'tests' &&
        currentPage !== 'login' &&
        currentPage !== 'about' &&
        currentPage !== 'contact' &&
        currentPage !== 'admin-login' &&
        currentPage !== 'admin-dashboard' ? 'with-padding' : ''
        }`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;