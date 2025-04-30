
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import ProtectedRoute from "@/components/protected-route";
import Layout from "@/components/layout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import GameList from "./pages/GameList";
import GameDetail from "./pages/GameDetail";
import GameNew from "./pages/GameNew";
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
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/games" 
              element={
                <Layout>
                  <GameList />
                </Layout>
              } 
            />
            
            <Route 
              path="/games/new" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <GameNew />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/games/:id" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <GameDetail />
                  </Layout>
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
