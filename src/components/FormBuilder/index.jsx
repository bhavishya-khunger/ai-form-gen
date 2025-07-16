import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import FieldEditor from './FieldEditor';
import AIGenerator from './AIGenerator';
import { useTheme } from '../context/ThemeContext';
import FormPreview from '../FormBuilder/FormPreview';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableFieldWrapper from './SortableFieldWrapper.jsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaSadCry, FaSadTear } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_SERVER_URI;

const FormBuilder = () => {
  const { id: formId } = useParams();
  const [formData, setFormData] = useState({
    title: 'Untitled Form',
    description: '',
    fields: [],
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  // Debounce function to prevent too many API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const publishForm = async () => {
    alert("This action is NOT reversible.");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/forms/${formId}/publish`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(res);

    } catch (e) {
      console.log(e);
    }
  };

  // Fetch form data from API
  useEffect(() => {
    const fetchForm = async () => {
      try {
        if (formId) {
          const response = await axios.get(`${API_BASE_URL}/api/forms/${formId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setIsEditable(response.data.form.isEditable);
          setFormData(response.data.form);
        }
      } catch (error) {
        toast.error('Failed to load form');
        console.error('Error fetching form:', error);
      }
    };

    fetchForm();
  }, [formId]);

  // Real-time save to backend
  const saveToBackend = useCallback(debounce(async (data) => {
    if (!formId) return; // Only save existing forms

    try {
      setIsSaving(true);
      await axios.post(
        `${API_BASE_URL}/api/forms/${formId}/update`,
        { formData: data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, 1000), [formId]);

  // Update form data and trigger save
  const updateFormData = useCallback((updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      saveToBackend(newData);
      return newData;
    });
  }, [saveToBackend]);

  const handleAIGenerate = (generatedForm) => {
    updateFormData({
      title: generatedForm.title,
      description: generatedForm.description,
      fields: generatedForm.fields,
    });
    setActiveTab('questions');
  };

  const handleAddQuestion = () => {
    const newField = {
      id: crypto.randomUUID(),
      label: '',
      type: 'text',
      required: false,
    };
    updateFormData({
      fields: [...formData.fields, newField]
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = formData.fields.findIndex(f => f.id === active.id);
      const newIndex = formData.fields.findIndex(f => f.id === over.id);
      const newFields = arrayMove(formData.fields, oldIndex, newIndex);
      updateFormData({ fields: newFields });
    }
  };

  const saveForm = async (isDraft = true) => {
    try {
      setIsSaving(true);

      if (formId) {
        // Update existing form
        console.log(formData);
        await axios.post(
          `${API_BASE_URL}/api/forms/${formId}/update`,
          { formData },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Form updated successfully!');
      } else {
        // Create new form
        const response = await axios.post(
          `${API_BASE_URL}/api/forms`,
          { formData },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Form created successfully!');
        navigate(`/form/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setIsSaving(false);
      if (!isDraft) {
        navigate('/dashboard');
      }
    }
  };

  if (isEditable) {
    return (
      <div className='flex flex-col gap-6 h-screen w-full p-4 text-center items-center justify-center'>
        <FaSadTear color='purple' size={60} />
        This form is already published. You cannot edit the form now!
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      {isPreviewMode ? (
        <FormPreview formData={formData} fields={formData.fields} />
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  className="text-2xl font-medium w-full outline-none border-none focus:ring-0 p-0 text-black dark:text-white bg-transparent"
                  placeholder="Form title"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                />
                {isSaving && (
                  <span className="text-sm text-gray-500 ml-2">Saving...</span>
                )}
              </div>
              <textarea
                rows={3}
                className="text-gray-600 dark:text-gray-300 w-full outline-none border-none focus:ring-0 p-0 mt-1 bg-transparent resize-none"
                placeholder="Form Description"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
              />
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'questions'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  Questions
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'ai'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  AI Generator
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'questions' ? (
                <div className="space-y-6">
                  {formData.fields.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        No questions yet. Use the button below to add some.
                      </p>
                    </div>
                  )}

                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={formData.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                      {formData.fields.map((field, index) => (
                        <SortableFieldWrapper key={field.id} id={field.id}>
                          <FieldEditor
                            index={index}
                            field={field}
                            onRemove={() => {
                              const newFields = [...formData.fields];
                              newFields.splice(index, 1);
                              setFormData({ ...formData, fields: newFields });
                            }}
                            onChange={(i, updates) => {
                              const newFields = [...formData.fields];
                              newFields[i] = { ...newFields[i], ...updates };
                              setFormData({ ...formData, fields: newFields });
                            }}
                          />
                        </SortableFieldWrapper>
                      ))}
                    </SortableContext>
                  </DndContext>

                  <div className="text-center pt-4">
                    <button
                      onClick={handleAddQuestion}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800 rounded transition-colors"
                    >
                      + Add Question
                    </button>
                  </div>
                </div>
              ) : (
                <AIGenerator onGenerate={handleAIGenerate} />
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900 flex justify-between items-center transition-colors">
              <button
                type="button"
                onClick={() => saveForm()}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-black dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => publishForm(false)}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSaving ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;