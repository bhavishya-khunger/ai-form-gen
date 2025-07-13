import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Upload } from "lucide-react";
import Markdown from "react-markdown";

const Form = () => {
  const { id } = useParams();

  const forms = useMemo(() => {
    try {
      const data = localStorage.getItem('savedForms');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formData = forms.find((f) => f.id === id).formData;
  console.log(formData);

  if (!formData) {
    return (
      <div className="text-center mt-10 text-gray-600">
        <h2 className="text-xl font-semibold">Form not found.</h2>
        <p className="mt-2">Please check the form link or go back to the homepage.</p>
      </div>
    );
  }

  return <Preview isOpen={isOpen} isSubmitted={isSubmitted} formData={formData} fields={formData.fields} />;
};

export default Form;

const themeColors = {
  // Primary colors (purple/indigo focus)
  purple: {
    bg: "bg-purple-100",
    border: "border-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  indigo: {
    bg: "bg-indigo-100",
    border: "border-indigo-700",
    button: "bg-indigo-600 hover:bg-indigo-700",
  },

  // Cool tones
  blue: {
    bg: "bg-blue-100",
    border: "border-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  cyan: {
    bg: "bg-cyan-100",
    border: "border-cyan-700",
    button: "bg-cyan-600 hover:bg-cyan-700",
  },
  sky: {
    bg: "bg-sky-100",
    border: "border-sky-700",
    button: "bg-sky-600 hover:bg-sky-700",
  },

  // Warm tones
  red: {
    bg: "bg-red-100",
    border: "border-red-700",
    button: "bg-red-600 hover:bg-red-700",
  },
  orange: {
    bg: "bg-orange-100",
    border: "border-orange-700",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  amber: {
    bg: "bg-amber-100",
    border: "border-amber-700",
    button: "bg-amber-600 hover:bg-amber-700",
  },

  // Natural tones
  green: {
    bg: "bg-green-100",
    border: "border-green-700",
    button: "bg-green-600 hover:bg-green-700",
  },
  emerald: {
    bg: "bg-emerald-100",
    border: "border-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  lime: {
    bg: "bg-lime-100",
    border: "border-lime-700",
    button: "bg-lime-600 hover:bg-lime-700",
  },

  // Neutrals
  gray: {
    bg: "bg-gray-100",
    border: "border-gray-700",
    button: "bg-gray-600 hover:bg-gray-700",
  },
  slate: {
    bg: "bg-slate-100",
    border: "border-slate-700",
    button: "bg-slate-600 hover:bg-slate-700",
  },
  zinc: {
    bg: "bg-zinc-100",
    border: "border-zinc-700",
    button: "bg-zinc-600 hover:bg-zinc-700",
  },

  // Accents
  pink: {
    bg: "bg-pink-100",
    border: "border-pink-700",
    button: "bg-pink-600 hover:bg-pink-700",
  },
  rose: {
    bg: "bg-rose-100",
    border: "border-rose-700",
    button: "bg-rose-600 hover:bg-rose-700",
  },
  fuchsia: {
    bg: "bg-fuchsia-100",
    border: "border-fuchsia-700",
    button: "bg-fuchsia-600 hover:bg-fuchsia-700",
  }
};

const Preview = ({ isSubmitted = false, isOpen = true, formData, fields }) => {
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otherInputs, setOtherInputs] = useState({});
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const themes = Object.keys(themeColors);
    const randomIndex = Math.floor(Math.random() * themes.length);
    return themes[randomIndex];
  });
  const [fileNames, setFileNames] = useState({});

  const handleChange = (e, field, option = null) => {
    let value;
    const file = e?.target?.files?.[0];

    if (file) {
      setFileNames((prev) => ({
        ...prev,
        [field.id]: file.name,
      }));
    }

    if (field.type === "mcq" || field.type === "dropdown") {
      value = option;
    } else if (field.type === "checkbox") {
      const prev = formValues[field.label] || [];
      value = e.target.checked
        ? [...prev, option]
        : prev.filter((item) => item !== option);
    } else if (field.type === "slider") {
      value = Number(e.target.value);
    } else if (field.type === "file") {
      value = file;
    } else {
      value = e.target.value;
    }

    setFormValues((prev) => ({ ...prev, [field.label]: value }));
  };

  const handleOtherChange = (fieldLabel, val) => {
    setOtherInputs((prev) => ({ ...prev, [fieldLabel]: val }));
    setFormValues((prev) => ({ ...prev, [fieldLabel]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 800);
  };

  const currentTheme = themeColors[selectedTheme];

  if (isSubmitted || !isOpen) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} py-10 px-4 font-sans text-gray-900`}>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-4 rounded-md shadow overflow-hidden">
            <div className={`bg-white border-t-10 ${currentTheme.border} p-6`}>
              <h1 className="text-3xl font-semibold mb-2">{formData.title || "Untitled Form"}</h1>
              <div className="text-gray-600 text-sm mt-4">
                {isSubmitted ? <p>Your response has been recorded. <br />You can only fill this form once. If you think it is a mistake, contact the owner.</p> : <p>The form <strong>{formData.title}</strong> is no longer accepting responses. <br /> If you think it is a mistake, contact the owner.</p>}
              </div>
            </div>
          </div>
        </div>
        <p className='text-center hover:text-gray-700 text-sm text-gray-500'>
          <a href="/dashboard">Powered by Formify - Create Forms in seconds</a>
        </p>
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
