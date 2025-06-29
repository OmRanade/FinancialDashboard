import React, { useState } from 'react';
import InputField from './InputField';
import api from '../services/api';
import './styles/AuthForm.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  isLogin: boolean;
  toggleForm: () => void;
}

const AuthForm = ({ isLogin, toggleForm }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const res = await api.post(endpoint, { email, password });

      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        toggleForm(); // Go to login form
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        setError((err.response as { data: { message: string } }).data.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{isLogin ? 'Sign in' : 'Sign up'}</h2>
      <p>
        {isLogin ? (
          <>Don't have an account? <span onClick={toggleForm} className="auth-link">Create now</span></>
        ) : (
          <>Already have an account? <span onClick={toggleForm} className="auth-link">Login here</span></>
        )}
      </p>

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="example@gmail.com"
      />

      <div className="input-group">
        <label className="input-label">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className="input-field"
        />
        <span className="password-icon" onClick={handleShowPassword}>
          {showPassword ? (
            <i className="fas fa-eye-slash"></i>
          ) : (
            <i className="fas fa-eye"></i>
          )}
        </span>
      </div>

      {error && (
        (error === 'Invalid email or password' || error === 'User already exists') ? (
          <p className="error">{error}</p>
        ) : (
          <ul className="error-list">
            {error.split(',').map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )
      )}

      <button type="submit" className="auth-button">
        {isLogin ? 'Sign in' : 'Create Account'}
      </button>
    </form>
  );
};

export default AuthForm;
