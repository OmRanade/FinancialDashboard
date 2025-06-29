import  { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import './styles/AuthSwitch.css';
import './styles/AuthForm.css';

const AuthSwitch = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [animateForm, setAnimateForm] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100); // Trigger entry animation
  }, []);

  return (
    <div className={`auth-wrapper ${!isLogin ? 'signup-mode' : ''}`}>
      <div className={`auth-form-side ${animateForm ? 'fade-in-up' : ''}`}>
        <AuthForm isLogin={isLogin} toggleForm={() => setIsLogin(!isLogin)} />
      </div>
      <div className="auth-image-side modern-image-style"></div>
    </div>
  );
};

export default AuthSwitch;
