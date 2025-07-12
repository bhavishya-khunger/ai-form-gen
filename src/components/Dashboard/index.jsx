import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Trash2, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Modal = ({ isOpen, onClose, onSubmit, title, setTitle }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Create New Form</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter form title"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-black text-black dark:text-white mb-4"
        />
        <div className="flex justify-end gap-2">
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
        fields: []
      }
    };

    const updatedForms = [...forms, newForm];
    setForms(updatedForms);
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    localStorage.setItem('formBuilderData', JSON.stringify(newForm.formData));
    setNewFormTitle('');
    setShowModal(false);
  };

  const deleteForm = (id) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    const updatedForms = forms.filter((form) => form.id !== id);
    setForms(updatedForms);
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-black dark:text-white">📄 My Forms</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:scale-[1.03] transition"
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

        {/* Empty state or cards */}
        {forms.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center transition-colors">
            <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">No forms yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first form to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-lg text-black dark:text-white truncate group-hover:underline">
                    {form.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Last edited: {formatDate(form.updatedAt)}
                  </p>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <Link
                    to={`/form/${form.id}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
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
