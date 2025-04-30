
import React from 'react';
import Navigation from './navigation';
import { useAuth } from '@/context/auth-context';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen">
      {user && <Navigation />}
      <main className={`flex-1 overflow-auto ${user ? 'p-6' : 'p-0'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
