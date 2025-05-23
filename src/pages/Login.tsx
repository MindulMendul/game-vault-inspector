
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import LoginForm from '@/components/login-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인한 경우 관리자 대시보드로 리디렉션
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="outline"
          asChild
          className="mb-6 gap-2"
        >
          <Link to="/">
            <ArrowLeft size={16} /> 메인으로 돌아가기
          </Link>
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">보드 게임 재고 관리</h1>
          <p className="text-gray-600 mt-2">관리자 로그인</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
