// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FormBuilder from './components/FormBuilder';
import { ThemeProvider } from './components/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form/new" element={<FormBuilder />} />
            <Route path="/form/:id" element={<FormBuilder />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;