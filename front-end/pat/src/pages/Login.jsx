import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Login = () => {
    const { user, setUser } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { setUser } = useContext(useAuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { email, password });
            const { token, role, userDetails } = res.data;
            localStorage.setItem('token', token);
            setUser({ role, userDetails });

            // Navigate based on role
            if (role === 'Student') navigate('/student-home');
            if (role === 'Company') navigate('/company-home');
            if (role === 'Admin') navigate('/admin-home');
        } catch (err) {
            console.error(err.response.data.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
