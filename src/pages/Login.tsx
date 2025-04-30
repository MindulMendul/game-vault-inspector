
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import LoginForm from '@/components/login-form';

const Login: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/games');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">보드 게임 재고 관리</h1>
          <p className="text-gray-600 mt-2">로그인하여 보드 게임 컬렉션을 관리하세요</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
