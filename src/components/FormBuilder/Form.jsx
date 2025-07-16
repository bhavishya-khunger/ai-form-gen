import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AlertCircle, Upload } from "lucide-react";
import Markdown from "react-markdown";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { isTokenValid } from '../../utils/ProtectedRoute';

const API_BASE_URL = import.meta.env.VITE_SERVER_URI;

const Form = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/forms/${id}`);
        setFormData(response.data.form);
        setIsOpen(response.data.form.accepting || false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-gray-600"><h2 className="text-xl font-semibold">Loading form...</h2></div>;
  if (error) return <div className="text-center mt-10 text-gray-600"><h2 className="text-xl font-semibold">Error loading form</h2><p className="mt-2">{error}</p></div>;
  if (!formData) return <div className="text-center mt-10 text-gray-600"><h2 className="text-xl font-semibold">Form not found.</h2><p className="mt-2">Please check the form link or go back to the homepage.</p></div>;

  return <Preview isOpen={isOpen} setIsOpen={setIsOpen} isSubmitted={isSubmitted} formData={formData} fields={formData.fields} formId={id} setIsSubmitted={setIsSubmitted} />;
};

const themeColors = {
  rose: {
    bg: "bg-rose-100",
    border: "border-rose-700",
    button: "bg-rose-600 hover:bg-rose-700",
  }
};

const getRandomThemeKey = () => {
  const themeKeys = Object.keys(themeColors);
  const randomIndex = Math.floor(Math.random() * themeKeys.length);
  return themeKeys[randomIndex];
};

const Preview = ({ isOpen, setIsOpen, isSubmitted, formData, fields, formId, setIsSubmitted }) => {
  const [formValues, setFormValues] = useState({});
  const [otherInputs, setOtherInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileNames, setFileNames] = useState({});

  // Use useEffect to check login status once on mount
  const [boolLogin, setBoolLogin] = useState(false);
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      const token_expires_at = localStorage.getItem('token_expires_at');
      const isValid = isTokenValid(token, token_expires_at);
      setBoolLogin(isValid);
    };

    checkLogin();
  }, []);

  const handleChange = (e, field, option = null) => {
    const file = e?.target?.files?.[0];
    if (file) setFileNames(prev => ({ ...prev, [field.id]: file.name }));

    let value;
    switch (field.type) {
      case 'mcq':
      case 'dropdown':
        value = option || e.target.value;
        break;
      case 'checkbox':
        const prev = formValues[field.label] || [];
        value = e.target.checked ? [...prev, option] : prev.filter(item => item !== option);
        break;
      case 'slider':
        value = Number(e.target.value);
        break;
      case 'file':
        value = file;
        break;
      default:
        value = e.target.value;
    }

    setFormValues(prev => ({ ...prev, [field.label]: value }));
  };

  const handleOtherChange = (label, value) => {
    setOtherInputs(prev => ({ ...prev, [label]: value }));
    setFormValues(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      const answers = {};

      Object.entries(formValues).forEach(([label, value]) => {
        if (value instanceof File) {
          formDataToSubmit.append('files', value);
          answers[label] = value.name;
        } else {
          answers[label] = value;
        }
      });

      formDataToSubmit.append('answers', JSON.stringify(answers));

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (formData.authReq) {
        const token = localStorage.getItem('token');
        if (!token) {
          localStorage.setItem(`form-${formId}-draft`, JSON.stringify(formValues));
          toast.error('Please log in to submit the form');
          window.location.href = '/login';
          return;
        }
        config.headers.Authorization = `Bearer ${token}`;
      }

      await axios.post(`${API_BASE_URL}/api/forms/${formId}/submit`, formDataToSubmit, config);
      localStorage.removeItem(`form-${formId}-draft`);
      setIsSubmitted(true);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Submission failed';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTheme = themeColors[getRandomThemeKey()];

  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} py-10 px-4 font-sans text-gray-900`}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 rounded-md shadow overflow-hidden">
            <div className={`bg-white border-t-10 ${currentTheme.border} p-6`}>
              <h1 className="text-3xl font-semibold mb-2">{formData.title || "Untitled Form"}</h1>
              <div className="text-gray-600 text-sm mt-4">
                <p>Your response has been recorded.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} py-10 px-4 font-sans text-gray-900`}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 rounded-md shadow overflow-hidden">
            <div className={`bg-white border-t-10 ${currentTheme.border} p-6`}>
              <h1 className="text-3xl font-semibold mb-2">{formData.title || "Untitled Form"}</h1>
              <div className="text-gray-600 text-sm mt-4">
                <p>The form <strong>{formData.title}</strong> is no longer accepting responses.
                  Try contacting the owner of the form if you think this is a mistake.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} py-10 px-4 font-sans text-gray-900`}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-4 rounded-md shadow overflow-hidden">
          <div className={`bg-white border-t-10 ${currentTheme.border} p-6`}>
            <h1 className="text-3xl font-semibold mb-2">{formData.title || "Untitled Form"}</h1>
            <div className="text-gray-600 text-sm prose">
              <Markdown>{formData.description}</Markdown>
            </div>
          </div>
          <div className={`border-t bg-white text-red-600 text-sm px-6 py-2 border-gray-300 rounded-b-md w-full`}>
            * Indicates required question
          </div>
        </div>

        {formData.authReq && !boolLogin && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-100 border border-amber-300 text-amber-800 py-3 px-4 mb-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium">Login required to submit this form</p>
                <p className="text-sm mt-1">Your responses will be LOST if you do not login!</p>
              </div>
            </div>
            <Link
              to={`/login?redirect=/forms/view/${formId}`}
              state={{ formValues }}
              className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Login to Submit
            </Link>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {fields.map((field, index) => (
            <div key={index} className="bg-white p-5 rounded-md shadow-sm border border-gray-200">
              <label className="block font-medium text-gray-900 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {/* MCQ */}
              {field.type === "mcq" && (
                <div className="space-y-2">
                  {field.options?.map((option, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={field.label}
                        value={option}
                        required={field.required}
                        onChange={() => handleChange(null, field, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={field.label}
                      value="Other"
                      onChange={() => handleChange(null, field, otherInputs[field.label] || "Other")}
                    />
                    <span>Other:</span>
                    <input
                      type="text"
                      value={otherInputs[field.label] || ""}
                      onChange={(e) => handleOtherChange(field.label, e.target.value)}
                      className="border-b border-gray-300 focus:outline-none text-sm py-1"
                    />
                  </label>
                </div>
              )}

              {/* Dropdown */}
              {field.type === "dropdown" && (
                <select
                  required={field.required}
                  onChange={(e) => handleChange(e, field, e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg bg-transparent focus:outline-none"
                >
                  <option value="">Select</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {/* Checkbox */}
              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options?.map((opt, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={(e) => handleChange(e, field, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Slider */}
              {field.type === "slider" && (
                <div>
                  <input
                    type="range"
                    min={field.min || 0}
                    max={field.max || 100}
                    onChange={(e) => handleChange(e, field)}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">Value: {formValues[field.label] || field.min}</p>
                </div>
              )}

              {/* Textarea */}
              {field.type === "textarea" && (
                <textarea
                  rows={4}
                  required={field.required}
                  onChange={(e) => handleChange(e, field)}
                  placeholder={field.placeholder || "Type your answer"}
                  className="w-full border rounded-lg border-gray-300 p-2 bg-transparent focus:outline-none"
                />
              )}

              {/* File Upload */}
              {field.type === "file" && (
                <div className="relative space-y-1">
                  <label
                    className={`cursor-pointer text-sm inline-block px-2 py-1 rounded border border-gray-300 ${currentTheme.bg} hover:scale-105 active:scale-90 transition-transform`}
                  >
                    <span className="flex items-center gap-2 justify-between">
                      <Upload size={16} /> Add File
                    </span>
                    <input
                      type="file"
                      required={field.required}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      onChange={(e) => handleChange(e, field)}
                    />
                  </label>

                  {fileNames[field.id] && (
                    <p className="text-xs text-gray-400 truncate max-w-xs">
                      {fileNames[field.id]}
                    </p>
                  )}
                </div>
              )}

              {/* Default input */}
              {!["mcq", "dropdown", "checkbox", "slider", "textarea", "file"].includes(field.type) && (
                <input
                  type={field.type}
                  required={field.required}
                  onChange={(e) => handleChange(e, field)}
                  placeholder={field.placeholder || ""}
                  className="w-full border-b border-gray-300 p-1 bg-transparent focus:outline-none"
                />
              )}
            </div>
          ))}

          <div className="text-left pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white cursor-pointer active:scale-95 px-6 py-2 rounded-md font-medium ${currentTheme.button}`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;