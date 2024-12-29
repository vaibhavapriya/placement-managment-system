import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student', // Default role is 'Student'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/auth/signup', formData);

            if (response.status === 201) {
                // Redirect to login page after successful signup
                navigate('/');
            }
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Something went wrong');
            } else {
                setError('Server error, please try again later');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>

            {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border rounded"
                    >
                        <option value="Student">Student</option>
                        <option value="Company">Company</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white rounded mt-4"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p>
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
