// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FormBuilder from './components/FormBuilder';
import { ThemeProvider } from './components/context/ThemeContext';
import Form from './components/FormBuilder/Form';
import LandingPage from './components/LandingPage';
import AuthForm from './components/Auth';
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './utils/ProtectedRoute.jsx'
import FormResponses from './components/Dashboard/FormResponses.jsx';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
          <Toaster />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/form/new" element={<FormBuilder />} />
            <Route path="/form/:id" element={<FormBuilder />} />
            <Route path="/forms/view/:id" element={<Form />} />
            <Route path="/responses/:id" element={<FormResponses />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;