import { Upload } from "lucide-react";
import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";

const themeColors = {
  purple: {
    bg: "bg-purple-100",
    border: "border-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  blue: {
    bg: "bg-blue-100",
    border: "border-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  green: {
    bg: "bg-green-100",
    border: "border-green-700",
    button: "bg-green-600 hover:bg-green-700",
  },
  red: {
    bg: "bg-red-100",
    border: "border-red-700",
    button: "bg-red-600 hover:bg-red-700"
  }
};

const FormPreview = ({ formData, fields }) => {
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otherInputs, setOtherInputs] = useState({});
  const [selectedTheme, setSelectedTheme] = useState("purple");
  const [fileNames, setFileNames] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const submittedForms = JSON.parse(localStorage.getItem("submittedForms") || "{}");
    if (formData?.id && submittedForms[formData.id]) {
      setHasSubmitted(true);
    }
  }, [formData?.id]);

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
      const newSubmission = { [formData.id]: formValues };
      const updatedSubmissions = [...submissions, newSubmission];

      setSubmissions(updatedSubmissions);
      localStorage.setItem("responses", JSON.stringify(updatedSubmissions));

      // Save flag to prevent resubmission
      const submittedForms = JSON.parse(localStorage.getItem("submittedForms") || "{}");
      submittedForms[formData.id] = true;
      localStorage.setItem("submittedForms", JSON.stringify(submittedForms));

      setHasSubmitted(true);
      // alert("Response Submitted!");
      setIsSubmitting(false);
    }, 800);
  };

  const currentTheme = themeColors[selectedTheme];

  if (hasSubmitted) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} py-10 px-4 font-sans text-gray-900`}>
        <div className="max-w-3xl mx-auto">
          {/* Theme Selection */}
          <div className="mb-6 flex gap-3 items-center">
            <label className="font-medium">Choose Theme:</label>
            {Object.keys(themeColors).map((theme) => (
              <button
                key={theme}
                className={`h-6 w-6 rounded-full ${themeColors[theme].border} border-2 ${selectedTheme === theme ? "ring-2 ring-black" : ""}`}
                onClick={() => setSelectedTheme(theme)}
              />
            ))}
          </div>

          {/* Header */}
          <div className="mb-4 rounded-md shadow overflow-hidden">
            <div className={`bg-white border-t-10 ${currentTheme.border} p-6`}>
              <h1 className="text-3xl font-semibold mb-2">{formData.title || "Untitled Form"}</h1>
              <div className="text-gray-600 text-sm mt-4">
                <p>Your response has been recorded. </p>
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
        {/* Theme Selection */}
        <div className="mb-6 flex gap-3 items-center">
          <label className="font-medium">Choose Theme:</label>
          {Object.keys(themeColors).map((theme) => (
            <button
              key={theme}
              className={`h-6 w-6 rounded-full ${themeColors[theme].border} border-2 ${selectedTheme === theme ? "ring-2 ring-black" : ""}`}
              onClick={() => setSelectedTheme(theme)}
            />
          ))}
        </div>

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
              className={`text-white px-6 py-2 rounded-md font-medium ${currentTheme.button}`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreview;
