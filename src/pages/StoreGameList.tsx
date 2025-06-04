import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBranchById, getBranchGames } from "@/services/supabase.service";
import { Branch, BranchGameList, GameStatus } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const StoreGameList: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [games, setGames] = useState<BranchGameList[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return;

      try {
        const [branchData, gamesData] = await Promise.all([getBranchById(storeId), getBranchGames(storeId)]);

        setBranch(branchData);
        setGames(gamesData);
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!branch) {
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
    <div className="min-h-screen bg-background">
      {/* 배경 이미지 */}
      {branch.photo && (
        <div
          className="fixed top-0 left-0 w-full h-32 sm:h-64 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${branch.photo})` }}
        />
      )}

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Button variant="outline" asChild className="mb-4 gap-2 text-sm sm:text-base">
            <Link to="/">
              <ArrowLeft size={16} /> 매장 선택으로 돌아가기
            </Link>
          </Button>

          <h1 className="text-xl sm:text-2xl font-bold mb-2">{branch.name} 보드게임 목록</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{branch.location}</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="게임 검색..."
                className="pl-8 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">보유 게임 목록</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {filteredGames.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm sm:text-base text-muted-foreground mb-4">게임을 찾을 수 없습니다</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] sm:w-[250px]">
                        <span className="text-xs sm:text-sm">게임 이름</span>
                      </TableHead>
                      <TableHead>
                        <span className="text-xs sm:text-sm">구분자</span>
                      </TableHead>
                      <TableHead>
                        <span className="text-xs sm:text-sm">상태</span>
                      </TableHead>
                      <TableHead className="w-[120px] sm:w-[300px]">
                        <span className="text-xs sm:text-sm">특이사항</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGames.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{game.game?.name}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{game.game_identifier}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(game.status)} text-xs`}>{game.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {!game.rulebook_exists && (
                              <div className="text-xs sm:text-sm text-red-500">룰북 없음</div>
                            )}
                            {game.missing_parts && (
                              <div className="text-xs sm:text-sm text-orange-500">누락: {game.missing_parts}</div>
                            )}
                          </div>
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
    </div>
  );
};

export default StoreGameList;
