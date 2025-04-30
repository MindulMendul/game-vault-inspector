
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllStores } from '@/services/store-service';
import { Store } from '@/types/store';
import { MapPin } from 'lucide-react';

const StoreSelection: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getAllStores();
        setStores(data);
      } catch (error) {
        console.error('매장 정보를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">보드게임 카페 지점 선택</h1>
        <p className="text-muted-foreground">방문하실 지점을 선택해주세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {stores.map((store) => (
          <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {store.imageUrl && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={store.imageUrl} 
                  alt={store.name} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{store.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {store.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{store.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/store/${store.id}/games`}>
                  이 지점 게임 보기
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" asChild>
          <Link to="/admin/login">
            관리자 로그인
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default StoreSelection;
