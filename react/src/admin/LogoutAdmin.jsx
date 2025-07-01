import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminNom');

    navigate('/admin/login');
  }, [navigate]);

  return null; 
}

export default LogoutAdmin;
