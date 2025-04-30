
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { LayoutDashboard, List, LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex flex-col h-full border-r bg-sidebar p-4 w-64">
      <div className="space-y-1">
        <div className="pb-4 mb-4 border-b">
          <h2 className="text-lg font-semibold">보드 게임 재고 관리</h2>
          {user && <p className="text-sm text-muted-foreground">{user.email}</p>}
        </div>

        <NavLink 
          to="/games" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              isActive ? 'bg-primary text-white' : 'hover:bg-secondary'
            }`
          }
        >
          <List size={18} />
          <span>게임 목록</span>
        </NavLink>

        {user && (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-primary text-white' : 'hover:bg-secondary'
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>대시보드</span>
          </NavLink>
        )}
      </div>

      {user && (
        <div className="mt-auto pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 justify-start" 
            onClick={() => logout()}
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
