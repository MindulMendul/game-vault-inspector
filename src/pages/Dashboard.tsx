import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBranchGames, getBranchById } from "@/services/supabase.service";
import { BranchGameList, GameStatus, Branch } from "@/types/database.types";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type FilterType = 'all' | 'needInspection' | 'reorderNeeded' | 'statusLow';

const Dashboard: React.FC = () => {
  const [games, setGames] = useState<BranchGameList[]>([]);
  const [allGames, setAllGames] = useState<BranchGameList[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    needInspection: 0,
    reorderNeeded: 0,
    statusLow: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
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
        setAllGames(gamesData);

        // 통계 업데이트
        setStats({
          total: gamesData.length,
          needInspection: gamesData.filter((game) => game.status === GameStatus.하 || game.reorder_needed).length,
          reorderNeeded: gamesData.filter((game) => game.reorder_needed).length,
          statusLow: gamesData.filter((game) => game.status === GameStatus.하).length,
        });

        // 초기 필터링된 게임 목록 설정
        const gamesNeedingInspection = gamesData.filter((game) => game.status === GameStatus.하 || game.reorder_needed);
        setGames(gamesNeedingInspection);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getFilteredGames = () => {
    let filteredGames = allGames;

    // 게임 이름으로 검색
    if (searchQuery) {
      filteredGames = filteredGames.filter((game) =>
        game.game?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 기본 필터 적용
    switch (activeFilter) {
      case "needInspection":
        filteredGames = filteredGames.filter(
          (game) => game.status === GameStatus.하 || game.reorder_needed
        );
        break;
      case "statusLow":
        filteredGames = filteredGames.filter(
          (game) => game.status === GameStatus.하
        );
        break;
      case "reorderNeeded":
        filteredGames = filteredGames.filter(
          (game) => game.reorder_needed
        );
        break;
    }

    return filteredGames;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-full">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{branch?.name} 지점 대시보드</h1>
          <p className="text-sm sm:text-base text-muted-foreground">보드 게임 재고 현황</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setActiveFilter('all')}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">전체 게임</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setActiveFilter('needInspection')}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">점검 필요</CardTitle>
            <CardDescription className="text-xs sm:text-sm">상태 '하' 또는 재주문 필요</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.needInspection}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setActiveFilter('statusLow')}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">상태 '하'</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.statusLow}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setActiveFilter('reorderNeeded')}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">재주문 필요</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.reorderNeeded}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-lg sm:text-xl">게임 목록</CardTitle>
              {searchQuery && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  검색어: {searchQuery}
                </p>
              )}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="게임 이름으로 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : getFilteredGames().length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">게임을 찾을 수 없습니다</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">게임 이름</TableHead>
                    <TableHead className="w-[100px]">구분자</TableHead>
                    <TableHead className="w-[100px]">상태</TableHead>
                    <TableHead className="w-[100px]">점검일</TableHead>
                    <TableHead className="w-[150px]">문제점</TableHead>
                    <TableHead className="w-[80px] text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredGames().map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{game.game?.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{game.game_identifier}</TableCell>
                      <TableCell>
                        <div className="space-x-1">
                          <Badge className={`${getStatusColor(game.status)} text-xs`}>{game.status}</Badge>
                          {game.reorder_needed && (
                            <Badge variant="outline" className="bg-yellow-50 text-xs">
                              필요
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {new Date(game.last_check_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="space-x-1">
                          {!game.rulebook_exists && (
                            <Badge variant="outline" className="bg-red-50 text-xs">
                              룰북 없음
                            </Badge>
                          )}
                          {game.missing_parts && (
                            <Badge variant="outline" className="bg-orange-50 text-xs">
                              누락
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                          <Link to={`/admin/branch-games/${game.id}`}>보기</Link>
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
