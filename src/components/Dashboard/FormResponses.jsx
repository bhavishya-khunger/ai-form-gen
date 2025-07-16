import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CrossIcon, Download, FileText, GitPullRequestClosed, Loader2, MailOpen, Maximize2, ShieldClose } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_SERVER_URI;

const FormResponses = () => {
    const { id: formId } = useParams();
    const [responses, setResponses] = useState([]);
    const [formDetails, setFormDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [accept, setAccept] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch form details
                const formRes = await axios.get(`${API_BASE_URL}/api/forms/${formId}`);
                setFormDetails(formRes.data.form);
                setAccept(formRes.data.form.accepting);

                // Fetch responses
                const token = localStorage.getItem('token');
                const responsesRes = await axios.get(`${API_BASE_URL}/api/resp/${formId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(responsesRes.data);
                setResponses(responsesRes.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load responses');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [formId]);

    const toggleForm = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/forms/${formId}/toggle`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAccept(res.data.form.accepting);
            accept ? toast('Form Closed!', { icon: '🔒' }) : toast.success('Form Open!');
        } catch (error) {
            console.log(error);
            toast.error('Publish the form to accept responses!');
        }
    }

    const exportToExcel = () => {
        if (!responses || responses.length === 0) return;

        // Prepare data for Excel
        const data = responses.map(response => {
            const row = {
                'Response ID': response.responseId,
                'Submitted At': new Date(response.submittedAt).toLocaleString()
            };

            // Handle both array and object answer formats
            if (Array.isArray(response.answers)) {
                response.answers.forEach(answer => {
                    row[answer.question] = Array.isArray(answer.value)
                        ? answer.value.filter(Boolean).join(', ')
                        : answer.value || '-';
                });
            } else if (response.answers && typeof response.answers === 'object') {
                Object.entries(response.answers).forEach(([question, value]) => {
                    row[question] = Array.isArray(value)
                        ? value.filter(Boolean).join(', ')
                        : value || '-';
                });
            }

            return row;
        });

        // Create worksheet with headers in bold
        const ws = XLSX.utils.json_to_sheet(data);

        // Style headers (bold)
        if (ws['!ref']) {
            const range = XLSX.utils.decode_range(ws['!ref']);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const headerCell = XLSX.utils.encode_cell({ r: range.s.r, c: C });
                if (!ws[headerCell]) continue;
                ws[headerCell].s = { font: { bold: true } };
            }
        }

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Responses");

        // Generate Excel file
        const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
            cellStyles: true
        });

        // Download file
        const fileName = `${formDetails?.title || 'form'}_responses_${new Date().toISOString().slice(0, 10)}.xlsx`;
        saveAs(new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }), fileName);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="p-6 bg-red-100 text-red-700 rounded-md max-w-md">
                    {error}
                </div>
            </div>
        );
    }

    if (!formDetails) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="p-6 bg-yellow-100 text-yellow-700 rounded-md max-w-md">
                    Form not found
                </div>
            </div>
        );
    }

    return (
        <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-white p-0 m-0 overflow-auto' : 'p-6'}`}>
            <div className={`${isFullScreen ? 'p-6' : ''} max-w-full mx-auto`}>
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-4">
                    <h1 className="text-2xl font-bold flex items-center">
                        <FileText className="inline mr-2" />
                        {formDetails?.title} - Responses
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={toggleForm}
                            className={`p-2 cursor-pointer active:scale-95 border ${accept ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-yellow-600 text-white hover:bg-yellow-700'} rounded-md`}
                        >
                            {accept ? <p className='flex items-center gap-2'><GitPullRequestClosed /> Close Form</p> : <p className='flex items-center gap-2'><MailOpen /> Collect Responses</p>}
                        </button>
                        <button
                            onClick={exportToExcel}
                            disabled={responses.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <Download size={16} />
                            Export to Excel
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {responses.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No responses yet
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Response ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submitted At
                                        </th>
                                        {formDetails?.fields?.map(field => (
                                            <th
                                                key={field.id}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {field.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {responses?.map(response => (
                                        <tr key={response.responseId} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 align-middle">
                                                {response?.responseId?.substring(0, 6)}...
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 align-middle">
                                                {new Date(response.submittedAt).toLocaleString()}
                                            </td>
                                            {formDetails?.fields?.map(field => {
                                                const answer = response.answers[field.label];
                                                return (
                                                    <td
                                                        key={field.id}
                                                        className="px-4 py-3 text-sm text-gray-500 align-middle max-w-xs truncate"
                                                        title={Array.isArray(answer) ? answer.join(', ') : answer}
                                                    >
                                                        {answer ? (
                                                            Array.isArray(answer) ? answer.join(', ') : answer
                                                        ) : '-'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormResponses;