import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Protected from './pages/Protected';

export default function App() {
  const navigate = useNavigate();
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/register" 
        element={
          <Register 
            onBackToLogin={() => navigate('/login')} 
          />
        } 
      />
      <Route path="/protected" element={<Protected />} />
    </Routes>
  );
}
