// App.tsx
import { Routes, Route } from 'react-router-dom';
import AuthSwitch from './components/AuthSwitch';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthSwitch />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
