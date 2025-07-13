import { useParams } from 'react-router-dom';
import FormPreview from './FormPreview';
import { useMemo } from 'react';

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

  return <FormPreview formData={formData} fields={formData.fields} />;
};

export default Form;
