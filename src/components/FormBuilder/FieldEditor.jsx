const FieldEditor = ({ field, onRemove, onChange, index }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm space-y-4 transition-all">
      {/* Question Label */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Question {index + 1}
          </label>
          <input
            className="w-full mt-1 border-none bg-transparent text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
            placeholder="Enter your question..."
            value={field.label}
            onChange={(e) => onChange(index, { label: e.target.value })}
          />
        </div>

        {/* Question Type & Remove */}
        <div className="flex items-center gap-3 mt-1">
          <select
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-800 dark:text-white rounded px-2 py-1 focus:outline-none"
            value={field.type}
            onChange={(e) => {
              const newType = e.target.value;
              const updates = { type: newType };
              if (["mcq", "dropdown", "checkbox"].includes(newType)) {
                updates.options = field.options?.length ? field.options : ["Option 1", "Option 2"];
              }
              if (newType === "slider") {
                updates.min = 0;
                updates.max = 100;
              }
              onChange(index, updates);
            }}
          >
            <option value="text">Text</option>
            <option value="textarea">Paragraph</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="mcq">Multiple Choice (Radio)</option>
            <option value="checkbox">Checkboxes</option>
            <option value="dropdown">Dropdown</option>
            <option value="slider">Slider</option>
            <option value="file">File Upload</option>
          </select>

          <button
            onClick={onRemove}
            className="text-gray-500 hover:text-red-500 text-xl"
            title="Remove question"
          >
            ×
          </button>
        </div>
      </div>

      {/* Options for MCQ */}
      {field.type === 'mcq' && (
        <div className="pl-2 space-y-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Options
          </label>
          {field.options.map((option, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-purple-400 text-purple-600 text-xs font-semibold">
                {i + 1}
              </span>
              <input
                className="flex-1 border-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                value={option}
                onChange={(e) => {
                  const newOptions = [...field.options];
                  newOptions[i] = e.target.value;
                  onChange(index, { options: newOptions });
                }}
                placeholder={`Option ${i + 1}`}
              />
            </div>
          ))}
          <button
            onClick={() => onChange(index, { options: [...field.options, ''] })}
            className="text-xs text-purple-600 hover:underline mt-1"
          >
            + Add option
          </button>
        </div>
      )}

      {/* Options for Dropdown and Checkbox */}
      {["dropdown", "checkbox"].includes(field.type) && (
        <div className="pl-2 space-y-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Options
          </label>
          {field?.options?.map((option, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-green-400 text-green-600 text-xs font-semibold">
                {i + 1}
              </span>
              <input
                className="flex-1 border-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                value={option}
                onChange={(e) => {
                  const newOptions = [...field.options];
                  newOptions[i] = e.target.value;
                  onChange(index, { options: newOptions });
                }}
                placeholder={`Option ${i + 1}`}
              />
            </div>
          ))}
          <button
            onClick={() => onChange(index, { options: [...field.options, ''] })}
            className="text-xs text-green-600 hover:underline mt-1"
          >
            + Add option
          </button>
        </div>
      )}

      {/* Slider Configuration */}
      {field.type === 'slider' && (
        <div className="pl-2 space-y-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Slider Range</label>
          <div className="flex gap-4">
            <input
              type="number"
              className="w-1/2 bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white rounded px-2 py-1"
              value={field.min}
              onChange={(e) => onChange(index, { min: Number(e.target.value) })}
              placeholder="Min"
            />
            <input
              type="number"
              className="w-1/2 bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white rounded px-2 py-1"
              value={field.max}
              onChange={(e) => onChange(index, { max: Number(e.target.value) })}
              placeholder="Max"
            />
          </div>
        </div>
      )}

      {/* Required Toggle */}
      <div className="flex justify-end">
        <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={field.required || false}
            onChange={(e) => onChange(index, { required: e.target.checked })}
            className="mr-2"
          />
          Required
        </label>
      </div>
    </div>
  );
};

export default FieldEditor;
