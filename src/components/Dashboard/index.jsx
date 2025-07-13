import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Trash2, Moon, Sun, Eye, Pencil } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Modal = ({ isOpen, onClose, onSubmit, title, setTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Create a New Form</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter form title"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-black text-black dark:text-white"
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    setForms(savedForms);
  }, []);

  const createNewForm = () => {
    const title = newFormTitle.trim() || 'Untitled Form';
    const newForm = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formData: {
        title,
        description: '',
        fields: [],
      },
    };
    const updatedForms = [...forms, newForm];
    setForms(updatedForms);
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    localStorage.setItem('formBuilderData', JSON.stringify(newForm.formData));
    setNewFormTitle('');
    setShowModal(false);
  };

  const deleteForm = (id) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    const updatedForms = forms.filter((form) => form.id !== id);
    setForms(updatedForms);
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">📋 My Forms</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
            >
              <Plus size={16} />
              Create Form
            </button>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setNewFormTitle('');
          }}
          onSubmit={createNewForm}
          title={newFormTitle}
          setTitle={setNewFormTitle}
        />

        {/* Forms grid */}
        {forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <FileText size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No forms found</h3>
            <p className="text-gray-500 dark:text-gray-400">Start by creating your first form</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-black dark:text-white truncate">{form.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Last edited: {formatDate(form.updatedAt)}
                  </p>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex gap-4">
                    <Link
                      to={`/form/${form.id}`}
                      className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Link>
                    <Link
                      to={`/forms/view/${form.id}`}
                      target="_blank"
                      className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Link>
                  </div>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Delete form"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
