import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Moon, Sun, Eye, Pencil, Loader2, Download, Copy } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_SERVER_URI;

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch forms from API
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/forms/myforms`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setForms(response.data);
      } catch (error) {
        toast.error('Failed to fetch forms');
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const createNewForm = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/forms`,
        {
          title: 'Untitled Form',
          description: '',
          fields: []
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const newForm = response.data;
      setForms([...forms, newForm]);
      navigate(`/form/${newForm._id}`);
      toast.success('Form created successfully!');
    } catch (error) {
      toast.error('Failed to create form');
      console.error('Error creating form:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  // Function to copy form link to clipboard
  const handleCopyLink = (formId) => {
    const link = `${window.location.origin}/forms/view/${formId}`;
    navigator.clipboard.writeText(link)
      .then(() => toast.success('Link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Your Forms
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {forms.length} {forms.length === 1 ? 'form' : 'forms'} created
            </p>
          </div>

          <div className="flex gap-3 items-center">

            <button
              onClick={createNewForm}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-all hover:shadow-md"
            >
              <Plus size={18} />
              <span>New Form</span>
            </button>
          </div>
        </div>

        {/* Forms grid */}
        {forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <FileText size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No forms yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
              Get started by creating your first form to collect responses
            </p>
            <button
              onClick={createNewForm}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium"
            >
              <Plus size={18} />
              Create Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form._id}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {form.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {form.description || 'No description'}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created: {formatDate(form.createdAt)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {form.fields?.length || 0} fields
                    </span>
                  </div>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div className="flex gap-4">
                    {form.isEditable && <Link
                      to={`/form/${form._id}`}
                      className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                      <Pencil size={16} className="mr-2" />
                      Edit
                    </Link>}
                    <Link
                      to={`/forms/view/${form._id}`}
                      target="_blank"
                      className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                      <Eye size={16} className="mr-2" />
                      View
                    </Link>
                    <Link
                      to={`/responses/${form._id}`}
                      target="_blank"
                      className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Responses
                    </Link>
                    <p
                      onClick={() => handleCopyLink(form._id)}
                      className="flex cursor-pointer items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                      <Copy size={16} className="mr-2" />
                      Link
                    </p>
                  </div>
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