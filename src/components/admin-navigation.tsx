import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { LayoutDashboard, List, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed top-0 left-0 h-full border-r bg-sidebar p-4 w-64 z-40 transition-transform duration-200 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-1">
          <div className="pb-4 mb-4 border-b">
            <h2 className="text-lg font-semibold">보드 게임 재고 관리</h2>
            {user && <p className="text-sm text-muted-foreground">{user.email}</p>}
          </div>

          {user && (
            <>
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-secondary'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>대시보드</span>
              </NavLink>

              <NavLink 
                to="/admin/games" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-secondary'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <List size={18} />
                <span>게임 목록</span>
              </NavLink>
            </>
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

      {/* Main Content Spacer */}
      <div className="w-0 md:w-64" />
    </>
  );
};

export default AdminNavigation;
