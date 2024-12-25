import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Login = () => {
    const { user, setUser } = useAuthContext();
    const [error,setError]=useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { setUser } = useContext(useAuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { email, password });
            const { token, role, userDetails } = res.data;
            localStorage.setItem('token', token);
            setUser({ role, userDetails });

            // Navigate based on role
            if (role === 'Student') navigate('/student');
            if (role === 'Company') navigate('/company');
            if (role === 'Admin') navigate('/admin');
        } catch (err) {
            //setError(err.response.data.message || 'Something went wrong');
            console.error(err.response.data.message);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Something went wrong');
            } else {
                setError('Server error, please try again later');
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
