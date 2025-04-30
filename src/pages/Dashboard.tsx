
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getGamesNeedingAttention, getAllGames } from '@/services/game-service';
import { Game } from '@/types/game';
import StatusBadge from '@/components/status-badge';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [gamesNeedingAttention, setGamesNeedingAttention] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attentionGames, allGames] = await Promise.all([
          getGamesNeedingAttention(),
          getAllGames(),
        ]);
        
        setGamesNeedingAttention(attentionGames);
        setTotalGames(allGames.length);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    needsReorder: gamesNeedingAttention.filter(game => game.needs_reorder).length,
    missingComponents: gamesNeedingAttention.filter(game => game.missing_components && game.missing_components.trim() !== '').length,
    poorCondition: gamesNeedingAttention.filter(game => game.component_status === '하').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">보드 게임 재고 현황 요약</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">전체 게임</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGames}</div>
            <p className="text-xs text-muted-foreground">
              컬렉션에 있는 게임
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">주의 필요</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamesNeedingAttention.length}</div>
            <p className="text-xs text-muted-foreground">
              주의가 필요한 게임
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">재주문 필요</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.needsReorder}</div>
            <p className="text-xs text-muted-foreground">
              구성품 재주문이 필요한 게임
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주의가 필요한 게임</CardTitle>
          <CardDescription>
            해결이 필요한 문제가 있는 게임 목록입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gamesNeedingAttention.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                현재 주의가 필요한 게임이 없습니다
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>게임 이름</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>문제</TableHead>
                    <TableHead className="hidden md:table-cell">마지막 검사</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gamesNeedingAttention.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={game.component_status} />
                      </TableCell>
                      <TableCell>
                        {game.needs_reorder && "재주문 필요"}
                        {game.needs_reorder && game.missing_components && " | "}
                        {game.missing_components && "누락 구성품"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(game.inspected_at), 'PPP')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link 
                          to={`/games/${game.id}`}
                          className="text-primary hover:underline"
                        >
                          상세 보기
                        </Link>
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

export default Dashboard;
