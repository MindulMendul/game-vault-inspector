import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBranchGames, getBranchById } from "@/services/supabase.service";
import { BranchGameList, GameStatus, Branch } from "@/types/database.types";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const [games, setGames] = useState<BranchGameList[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    needInspection: 0,
    reorderNeeded: 0,
  });
  const { user } = useAuth();

  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case GameStatus.상:
        return "bg-green-100 text-green-800";
      case GameStatus.중:
        return "bg-yellow-100 text-yellow-800";
      case GameStatus.하:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.branch_id) return;

      try {
        const [branchData, gamesData] = await Promise.all([
          getBranchById(user.branch_id),
          getBranchGames(user.branch_id),
        ]);

        setBranch(branchData);

        // 전체 게임 중 상태가 "하"이거나 재주문이 필요한 게임들만 필터링
        const gamesNeedingInspection = gamesData.filter((game) => game.status === GameStatus.하 || game.reorder_needed);
        setGames(gamesNeedingInspection);

        // 통계 업데이트
        setStats({
          total: gamesData.length,
          needInspection: gamesData.filter((game) => game.status === GameStatus.하).length,
          reorderNeeded: gamesData.filter((game) => game.reorder_needed).length,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
        <h1 className="text-2xl font-bold">{branch?.name} 지점 대시보드</h1>
        <p className="text-muted-foreground">보드 게임 재고 현황</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">전체 게임</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">점검 필요</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.needInspection}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">재주문 필요</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reorderNeeded}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>점검이 필요한 게임 목록</CardTitle>
          <CardDescription>상태가 '하'이거나 재주문이 필요한 게임들의 목록입니다</CardDescription>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">점검이 필요한 게임이 없습니다</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>게임</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>최근 점검일</TableHead>
                    <TableHead>특이사항</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {games.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.game?.name}</TableCell>
                      <TableCell>{game.game_identifier}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Badge className={getStatusColor(game.status)}>{game.status}</Badge>
                          {game.reorder_needed && (
                            <Badge variant="outline" className="bg-yellow-50">
                              재주문 필요
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(game.last_check_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          {!game.rulebook_exists && (
                            <Badge variant="outline" className="bg-red-50">
                              룰북 없음
                            </Badge>
                          )}
                          {game.missing_parts && (
                            <Badge variant="outline" className="bg-orange-50">
                              누락: {game.missing_parts}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/branch-games/${game.id}`}>상세 보기</Link>
                        </Button>
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
