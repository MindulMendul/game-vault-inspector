
import React from 'react';
import Navigation from './navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen">
      <Navigation />
      <main className="flex-1 overflow-auto p-6">
        {!user && (
          <div className="flex justify-end mb-4">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/login">
                <LogIn size={16} /> 관리자 로그인
              </Link>
            </Button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
