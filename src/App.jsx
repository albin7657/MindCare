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
  const [authenticatedUser, setAuthenticatedUser] = useState(initialUser);
  const [userHistory, setUserHistory] = useState(() => initialUser?.id ? getUserHistory(initialUser.id) : []);

  const handleUserAuthenticated = (user) => {
    setAuthenticatedUser(user);
    setCurrentUser(user);
    setUserHistory(getUserHistory(user.id));
    setCurrentPage('user-dashboard');
  };

  const handleUserLogout = () => {
    clearCurrentUser();
    setAuthenticatedUser(null);
    setUserHistory([]);
    setCurrentPage('home');
  };

  const handleAssessmentComplete = (results) => {
    setQuizResults(results);

    if (authenticatedUser?.id) {
      const entry = buildAssessmentEntry(results);
      const updatedHistory = addUserHistoryEntry(authenticatedUser.id, entry);
      setUserHistory(updatedHistory);
    }

    setCurrentPage('results');
  };

  const renderPage = () => {
    switch(currentPage) {
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
        return <Questionnaire onComplete={handleAssessmentComplete} onBack={() => setCurrentPage('test-selection')} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={setCurrentPage} onAuthSuccess={handleUserAuthenticated} />;
      case 'user-dashboard':
        if (!authenticatedUser) {
          setCurrentPage('login');
          return <Login onNavigate={setCurrentPage} onAuthSuccess={handleUserAuthenticated} />;
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
          return <Login onNavigate={setCurrentPage} onAuthSuccess={handleUserAuthenticated} />;
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
        return <AdminLogin onLogin={() => {
          setIsAdminAuthenticated(true);
          setCurrentPage('admin-dashboard');
        }} onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        if (!isAdminAuthenticated) {
          setCurrentPage('admin-login');
          return <AdminLogin onLogin={() => {
            setIsAdminAuthenticated(true);
            setCurrentPage('admin-dashboard');
          }} onNavigate={setCurrentPage} />;
        }
        return <AdminDashboard onLogout={() => {
          setIsAdminAuthenticated(false);
          setCurrentPage('home');
        }} />;
      case 'results':
        return (
          <Results
            results={quizResults}
            onRetake={() => setCurrentPage('questionnaire')}
            onHome={() => setCurrentPage('home')}
            onDashboard={authenticatedUser ? () => setCurrentPage('user-dashboard') : null}
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
        />
      )}
      <main className={`main-content ${
        currentPage !== 'home' && 
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
