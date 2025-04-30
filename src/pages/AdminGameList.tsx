import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBranchGames } from "@/services/supabase.service";
import { BranchGameList, GameStatus } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const AdminGameList: React.FC = () => {
  const [games, setGames] = useState<BranchGameList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  const filteredGames = games.filter((game) => game.game?.name.toLowerCase().includes(searchQuery.toLowerCase()));

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

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">보드 게임 관리</h1>
          <p className="text-muted-foreground">지점의 모든 보드 게임 목록을 확인하세요</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="게임 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/admin/games/new">
              <Plus className="mr-1 h-4 w-4" /> 게임 추가
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>게임 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">게임을 찾을 수 없습니다</p>
              <Button asChild variant="outline">
                <Link to="/admin/games/new">첫 번째 게임 추가하기</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">게임 이름</TableHead>
                    <TableHead>구분자</TableHead>
                    <TableHead className="hidden md:table-cell">최근 점검일</TableHead>
                    <TableHead className="hidden md:table-cell">관리자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>룰북</TableHead>
                    <TableHead>재주문 필요</TableHead>
                    <TableHead className="w-[300px]">특이사항</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.game?.name}</TableCell>
                      <TableCell>{game.game_identifier}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(game.last_check_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{game.inspector || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(game.status)}>{game.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {game.rulebook_exists ? (
                          <Badge variant="outline" className="bg-green-50">
                            보유
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50">
                            없음
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {game.reorder_needed && (
                          <Badge variant="outline" className="bg-yellow-50">
                            재주문 필요
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {game.missing_parts && (
                            <div className="text-sm text-orange-500">누락: {game.missing_parts}</div>
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
    </>
  );
};

export default AdminGameList;
