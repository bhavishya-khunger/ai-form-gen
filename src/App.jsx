// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FormBuilder from './components/FormBuilder';
import { ThemeProvider } from './components/context/ThemeContext';
import Form from './components/FormBuilder/Form';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form/new" element={<FormBuilder />} />
            <Route path="/form/:id" element={<FormBuilder />} />
            <Route path="/forms/view/:id" element={<Form />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;