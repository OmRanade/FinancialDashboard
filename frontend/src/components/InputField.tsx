import React from 'react';
import './styles/InputField.css';

interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField = ({ label, type, value, onChange, placeholder }: InputProps) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input-field"
    />
  </div>
);

export default InputField;