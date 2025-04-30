
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getGamesByStoreId, getStoreById } from '@/services/store-service';
import { Game } from '@/types/game';
import { Store } from '@/types/store';
import StatusBadge from '@/components/status-badge';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StoreGameList: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return;

      try {
        const [storeData, gamesData] = await Promise.all([
          getStoreById(storeId),
          getGamesByStoreId(storeId)
        ]);
        
        setStore(storeData);
        setGames(gamesData);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl mb-4">매장 정보를 찾을 수 없습니다</h2>
          <Button asChild>
            <Link to="/">다시 매장 선택하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="outline" asChild className="mb-4 gap-2">
          <Link to="/">
            <ArrowLeft size={16} /> 매장 선택으로 돌아가기
          </Link>
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">{store.name} 보드게임 목록</h1>
        <p className="text-muted-foreground">{store.location}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="게임 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Button variant="outline" asChild>
          <Link to="/admin/login">관리자 로그인</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>보유 게임 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGames.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">게임을 찾을 수 없습니다</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>게임 이름</TableHead>
                    <TableHead className="hidden md:table-cell">규칙서</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="hidden md:table-cell">누락 부품</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {game.has_manual ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            있음
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            없음
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={game.component_status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {game.missing_components ? game.missing_components : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreGameList;
