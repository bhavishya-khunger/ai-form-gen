import { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const AIGenerator = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize once; API key is pulled automatically from env
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const generateRandomForm = () => {
    const templates = [
      // same randomized templates......
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: `Create a JSON form based on this prompt:\n"${prompt.trim()}".  
Always include a detailed description in markdown format, using bullet points or paragraphs as appropriate.

The JSON must follow this structure:
{
  "title": "string",
  "description": "string (supports markdown)",
  "fields": [
    {
      "id": "random-uuid",
      "label": "string",
      "type": "text | textarea | email | number | date | mcq | checkbox | dropdown | slider | file",
      "required": boolean,
      "options": [array of strings] // only for mcq, checkbox, and dropdown
      "min": number, // only for slider
      "max": number  // only for slider
    }
  ]
}

Use all available field types (unless otherwise specified) and generate realistic, relevant questions. If the prompt implies a particular structure (like personal info, preferences, or feedback), reflect that with appropriate input types.
`,
      });

      const text = response.text; // correct property usage :contentReference[oaicite:1]{index=1}
      const raw = text.match(/\{[\s\S]*\}/)?.[0] ?? '{}';
      const parsed = JSON.parse(raw);

      // Ensure each field has a proper UUID
      const form = {
        ...parsed,
        fields: (parsed.fields || []).map((f) => ({ ...f, id: crypto.randomUUID() })),
      };

      onGenerate(form);
    } catch (err) {
      console.error(err);
      alert("Couldn't generate form. Try a different prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Wand2 size={20} className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Generate with AI</h3>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <textarea
          rows={3}
          placeholder="Describe your form..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full border rounded-md p-2 dark:bg-gray-700 dark:text-white"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md ${
              isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } transition`}
          >
            {isLoading ? 'Generating...' : <><Wand2 size={16} />Generate Form</>}
          </button>
          <button
            type="button"
            onClick={() => {
              setPrompt('');
              onGenerate(generateRandomForm());
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 rounded-md text-purple-800 dark:text-purple-200 hover:bg-purple-200 transition"
          >
            <Sparkles size={16} />Random Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIGenerator;
