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
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [quizResults, setQuizResults] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // when redirected to login for a specialized test, remember where to go after auth
  const [pendingPage, setPendingPage] = useState(null);

  const saveAttemptToServer = async (results) => {
    try {
      const res = await fetch('http://localhost:5000/api/assessment-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, answers: results })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error saving attempt:', err);
      return { success: false };
    }
  };

  // central auth handler which also consumes pendingPage
  const handleAuth = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setIsAdminAuthenticated(true);
      // admin always goes to dashboard regardless of pending
      setCurrentPage('admin-dashboard');
    } else if (pendingPage) {
      setCurrentPage(pendingPage);
      setPendingPage(null);
    } else {
      setCurrentPage('home');
    }
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
        return <Questionnaire onComplete={async (results) => {
          const response = await saveAttemptToServer(results);
          if (response && response.success) {
            setQuizResults(response.results);
            setCurrentPage('results');
          } else {
            alert('Failed to save assessment. Please try again.');
          }
        }} onBack={() => setCurrentPage('home')} />;

      case 'tests': // fallback composite
        return <TestSelection onStartCombinedTest={() => setCurrentPage('questionnaire')} onStartSpecificTest={(testId) => setCurrentPage(`test-${testId}`)} />;
      case 'test-stress':
      case 'test-anxiety':
      case 'test-depression':
      case 'test-burnout':
      case 'test-sleep':
        // make sure user is signed in before showing specialized test
        if (!currentUser) {
          setPendingPage(currentPage);
          setCurrentPage('login');
          return null; // will re-render as login
        }
        return <Questionnaire onComplete={async (results) => {
          const response = await saveAttemptToServer(results);
          if (response && response.success) {
            setQuizResults(response.results);
            setCurrentPage('results');
          } else {
            alert('Failed to save assessment. Please try again.');
          }
        }} onBack={() => setCurrentPage('test-selection')} />;      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={setCurrentPage} onAuth={handleAuth} />;
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
        return <Results results={quizResults} onRetake={() => setCurrentPage('questionnaire')} onHome={() => setCurrentPage('home')} />;
      default:
        return <Home onStartTest={() => setCurrentPage('test-selection')} onNavigate={setCurrentPage} />;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="app">
      {currentPage !== 'admin-dashboard' && currentPage !== 'admin-login' && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} />
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