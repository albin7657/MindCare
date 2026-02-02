import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import TestSelection from './pages/TestSelection';
import Questionnaire from './pages/Questionnaire';
import Contact from './pages/Contact';
import Results from './pages/Results';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [quizResults, setQuizResults] = useState(null);

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
        return <Home onStartTest={() => setCurrentPage('questionnaire')} onNavigate={setCurrentPage} />;
      case 'about':
        return <Home onStartTest={() => setCurrentPage('questionnaire')} onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      case 'results':
        return <Results results={quizResults} onRetake={() => setCurrentPage('questionnaire')} onHome={() => setCurrentPage('home')} />;
      default:
        return <Home onStartTest={() => setCurrentPage('questionnaire')} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className={`main-content ${currentPage !== 'home2' && currentPage !== 'test-selection' ? 'with-padding' : ''}`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
