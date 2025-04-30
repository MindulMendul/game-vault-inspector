
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import ProtectedRoute from "@/components/protected-route";
import AdminLayout from "@/components/admin-layout";

import StoreSelection from "./pages/StoreSelection";
import StoreGameList from "./pages/StoreGameList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminGameList from "./pages/AdminGameList";
import AdminGameDetail from "./pages/AdminGameDetail";
import AdminGameNew from "./pages/AdminGameNew";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* 일반 사용자 루트 */}
            <Route path="/" element={<StoreSelection />} />
            <Route path="/store/:storeId/games" element={<StoreGameList />} />
            
            {/* 관리자 인증 */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* 관리자 보호된 루트 */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/games" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminGameList />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/games/new" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminGameNew />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/games/:id" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminGameDetail />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
