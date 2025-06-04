import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBranchGames } from "@/services/supabase.service";
import { BranchGameList, GameStatus } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "@/context/auth-context";

type SortField = 'name' | 'status' | 'lastCheckDate' | null;
type SortDirection = 'asc' | 'desc' | null;

const AdminGameList: React.FC = () => {
  const [games, setGames] = useState<BranchGameList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGames = async () => {
      if (!user?.branch_id) return;

      try {
        const data = await getBranchGames(user.branch_id);
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [user]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedGames = () => {
    const filteredGames = games.filter((game) => 
      game.game?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!sortField || !sortDirection) {
      return filteredGames;
    }

    return [...filteredGames].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = (a.game?.name || '').localeCompare(b.game?.name || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'lastCheckDate':
          comparison = new Date(a.last_check_date).getTime() - new Date(b.last_check_date).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    return <ArrowDown className="h-4 w-4" />;
  };

  const getSortStatusText = () => {
    if (!sortField || !sortDirection) return null;

    const fieldNames = {
      name: '게임 이름',
      status: '상태',
      lastCheckDate: '최근 점검일'
    };

    const directionText = sortDirection === 'asc' ? '오름차순' : '내림차순';
    return `정렬 기준: ${fieldNames[sortField]} (${directionText})`;
  };

  return (
    <div className="p-4 space-y-6 max-w-full">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">보드 게임 관리</h1>
          <p className="text-sm sm:text-base text-muted-foreground">지점의 모든 보드 게임 목록을 확인하세요</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="게임 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/admin/games/new">
              <Plus className="mr-1 h-4 w-4" /> 게임 추가
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-lg sm:text-xl">게임 목록</CardTitle>
            {getSortStatusText() && (
              <p className="text-xs sm:text-sm text-muted-foreground">{getSortStatusText()}</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : getSortedGames().length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">게임을 찾을 수 없습니다</p>
              <Button asChild variant="outline">
                <Link to="/admin/games/new">첫 번째 게임 추가하기</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] sm:w-[200px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        게임 이름
                        {getSortIcon('name')}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[80px] sm:w-auto">
                      <span className="text-xs sm:text-sm">구분자</span>
                    </TableHead>
                    <TableHead className="w-[100px] sm:w-auto">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('lastCheckDate')}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        점검일
                        {getSortIcon('lastCheckDate')}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[80px] sm:w-auto">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        상태
                        {getSortIcon('status')}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[80px] sm:w-auto">
                      <span className="text-xs sm:text-sm">룰북</span>
                    </TableHead>
                    <TableHead className="w-[100px] sm:w-auto">
                      <span className="text-xs sm:text-sm">재주문</span>
                    </TableHead>
                    <TableHead className="w-[80px] sm:w-auto text-right">
                      <span className="text-xs sm:text-sm">액션</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSortedGames().map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{game.game?.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{game.game_identifier}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {new Date(game.last_check_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(game.status)} text-xs`}>{game.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {game.rulebook_exists ? (
                          <Badge variant="outline" className="bg-green-50 text-xs">
                            보유
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-xs">
                            없음
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {game.reorder_needed && (
                          <Badge variant="outline" className="bg-yellow-50 text-xs">
                            필요
                          </Badge>
                        )}
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

export default AdminGameList;
