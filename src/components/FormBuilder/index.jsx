// src/components/FormBuilder.jsx
import { useState, useEffect } from 'react';
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

const FormBuilder = () => {
  const { id: formId } = useParams();
  const [formData, setFormData] = useState({
    title: 'Untitled Form',
    description: '',
    fields: [],
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (formId) {
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const existingForm = savedForms.find(f => f.id === formId);
      if (existingForm) {
        setFormData(existingForm.formData);
      }
    } else {
      const draft = localStorage.getItem('formBuilderData');
      if (draft) setFormData(JSON.parse(draft));
    }
  }, [formId]);

  const saveForm = (isDraft = true) => {
    const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');

    if (formId) {
      const updatedForms = savedForms.map(form =>
        form.id === formId
          ? {
              ...form,
              title: formData.title,
              formData,
              updatedAt: new Date().toISOString(),
            }
          : form
      );
      localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    } else {
      const newForm = {
        id: crypto.randomUUID(),
        title: formData.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formData,
      };
      localStorage.setItem('savedForms', JSON.stringify([...savedForms, newForm]));
    }

    if (isDraft) {
      localStorage.setItem('formBuilderData', JSON.stringify(formData));
    } else {
      localStorage.removeItem('formBuilderData');
    }
    navigate('/dashboard');
  };

  const handleAIGenerate = (generatedForm) => {
    setFormData({
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
    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = formData.fields.findIndex(f => f.id === active.id);
      const newIndex = formData.fields.findIndex(f => f.id === over.id);
      const newFields = arrayMove(formData.fields, oldIndex, newIndex);
      setFormData({ ...formData, fields: newFields });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      {isPreviewMode ? (
        <FormPreview formData={formData} fields={formData.fields} />
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <input
                type="text"
                className="text-2xl font-medium w-full outline-none border-none focus:ring-0 p-0 text-black dark:text-white bg-transparent"
                placeholder="Form title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                rows={3}
                className="text-gray-600 dark:text-gray-300 w-full outline-none border-none focus:ring-0 p-0 mt-1 bg-transparent resize-none"
                placeholder="Form Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'questions'
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Questions
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'ai'
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
                onClick={() => {
                  saveForm(true);
                  navigate('/dashboard');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-black dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Save Draft
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
                  onClick={() => {
                    saveForm(false);
                    alert('Form published successfully!');
                    navigate('/dashboard');
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Publish
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
