
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminNavigation from './admin-navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <main className="flex-1 overflow-auto p-6">
        {!user && (
          <div className="flex justify-end mb-4">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/admin/login">
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

export default AdminLayout;
