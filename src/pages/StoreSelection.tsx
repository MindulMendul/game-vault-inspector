import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBranches } from "@/services/supabase.service";
import { Branch } from "@/types/database.types";
import { MapPin, Image as ImageIcon } from "lucide-react";

const StoreSelection: React.FC = () => {
  const [stores, setStores] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getBranches();
        setStores(data);
      } catch (error) {
        console.error("매장 정보를 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleImageError = (storeId: string) => {
    setImageErrors((prev) => ({ ...prev, [storeId]: true }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <img
              src="https://cdn.imweb.me/thumbnail/20230718/7a92753aba0a7.png"
              alt="The Holic Board Game Cafe"
              className="h-12 sm:h-16"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">더홀릭 보드게임 카페 지점 목록</h1>
          <p className="text-sm sm:text-base text-muted-foreground">방문하실 지점을 선택해주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {stores.map((store) => (
            <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full h-40 sm:h-48 overflow-hidden bg-muted flex items-center justify-center">
                {store.photo && !imageErrors[store.id] ? (
                  <img
                    src={store.photo}
                    alt={store.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(store.id)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 mb-2" />
                    <span className="text-xs sm:text-sm">이미지를 불러올 수 없습니다</span>
                  </div>
                )}
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{store.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  {store.location}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 sm:p-6 pt-0">
                <Button asChild className="w-full text-sm sm:text-base">
                  <Link to={`/store/${store.id}/games`}>이 지점 게임 보기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Button variant="outline" asChild className="text-sm sm:text-base">
            <Link to="/admin/login">관리자 로그인</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreSelection;
