
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">페이지를 찾을 수 없습니다</p>
        <p className="text-muted-foreground mb-6">
          찾으시는 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Button asChild>
          <Link to="/games">
            게임 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
