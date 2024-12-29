import React, { useState } from 'react';

function FormApplication({ drive, closeModal }) {
    const { state, dispatch } = usePatContext();
    const { currentUser } = state;

    const [resume, setResume] = useState(null);
    const [whySelect, setWhySelect] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!resume || !whySelect.trim()) {
            alert('Please fill in all fields!');
            return;
        }

        // Create a new application object
        const newApplication = {
            id: `a_${Date.now()}`, // Unique ID
            studentId: currentUser.id,
            driveId: drive.id,
            status: 'applied',
            resume,
            whySelect,
        };
        // Dispatch action to add application
        // dispatch({
        //     type: 'ADD_APPLICATION',
        //     payload: { application: newApplication },
        // });

        // Close modal
        closeModal();
        alert('Application submitted successfully!');
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Apply for {drive.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Resume Upload */}
                    <div>
                        <label className="block font-medium text-gray-700">Upload Resume</label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200"
                        />
                    </div>

                    {/* Why Should We Select You */}
                    <div>
                        <label className="block font-medium text-gray-700">Why Should We Select You?</label>
                        <textarea
                            value={whySelect}
                            onChange={(e) => setWhySelect(e.target.value)}
                            rows="4"
                            className="mt-1 block w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormApplication;
