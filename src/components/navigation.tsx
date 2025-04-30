
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Dashboard, List, LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="flex flex-col h-full border-r bg-sidebar p-4 w-64">
      <div className="space-y-1">
        <div className="pb-4 mb-4 border-b">
          <h2 className="text-lg font-semibold">Board Game Inventory</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              isActive ? 'bg-primary text-white' : 'hover:bg-secondary'
            }`
          }
        >
          <Dashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/games" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              isActive ? 'bg-primary text-white' : 'hover:bg-secondary'
            }`
          }
        >
          <List size={18} />
          <span>Games</span>
        </NavLink>
      </div>

      <div className="mt-auto pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-start" 
          onClick={() => logout()}
        >
          <LogOut size={18} />
          <span>Log out</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
