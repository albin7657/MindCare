import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Home2 from './pages/Home2';
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

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home onStartTest={() => setCurrentPage('questionnaire')} onNavigate={setCurrentPage} />;
      case 'home2':
        return <Home2 onStart={() => setCurrentPage('test-selection')} />;
      case 'test-selection':
        return <TestSelection onStartCombinedTest={() => setCurrentPage('questionnaire')} />;
      case 'questionnaire':
        return <Questionnaire onComplete={(results) => {
          setQuizResults(results);
          setCurrentPage('results');
        }} onBack={() => setCurrentPage('home')} />;
      case 'tests':
        return <Questionnaire onComplete={(results) => {
          setQuizResults(results);
          setCurrentPage('results');
        }} onBack={() => setCurrentPage('home')} />;
      case 'about':
        return <Home onStartTest={() => setCurrentPage('questionnaire')} onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
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
        return <Results results={quizResults} onRetake={() => setCurrentPage('questionnaire')} onHome={() => setCurrentPage('home')} />;
      default:
        return <Home onStartTest={() => setCurrentPage('questionnaire')} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      {currentPage !== 'admin-dashboard' && currentPage !== 'admin-login' && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      <main className={`main-content ${
        currentPage !== 'home' && 
        currentPage !== 'home2' && 
        currentPage !== 'test-selection' && 
        currentPage !== 'login' && 
        currentPage !== 'contact' ? 'with-padding' : ''
      }`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
