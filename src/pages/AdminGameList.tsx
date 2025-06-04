import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBranchGames } from "@/services/supabase.service";
import { BranchGameList, GameStatus } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, X, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type SortField = "name" | "status" | "lastCheckDate" | null;
type SortDirection = "asc" | "desc" | null;

interface FilterState {
  gameName: string;
  identifier: string;
  checkDateStart: Date | null;
  checkDateEnd: Date | null;
  status: GameStatus | "all";
  hasRulebook: "all" | "yes" | "no";
  needsReorder: "all" | "yes" | "no";
}

const AdminGameList: React.FC = () => {
  const [games, setGames] = useState<BranchGameList[]>([]);
  const [allGames, setAllGames] = useState<BranchGameList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<FilterState>({
    gameName: "",
    identifier: "",
    checkDateStart: null,
    checkDateEnd: null,
    status: "all",
    hasRulebook: "all",
    needsReorder: "all",
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchGames = async () => {
      if (!user?.branch_id) return;

      try {
        const data = await getBranchGames(user.branch_id);
        setAllGames(data);
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
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedGames = () => {
    let filteredGames = allGames;

    if (searchQuery) {
      filteredGames = filteredGames.filter((game) => game.game?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filters.gameName) {
      filteredGames = filteredGames.filter((game) =>
        game.game?.name.toLowerCase().includes(filters.gameName.toLowerCase())
      );
    }

    if (filters.identifier) {
      filteredGames = filteredGames.filter((game) =>
        game.game_identifier.toLowerCase().includes(filters.identifier.toLowerCase())
      );
    }

    if (filters.checkDateStart || filters.checkDateEnd) {
      filteredGames = filteredGames.filter((game) => {
        const gameDate = new Date(game.last_check_date);
        const startDate = filters.checkDateStart || new Date("1999-12-31");
        const endDate = filters.checkDateEnd || new Date();

        // 날짜만 비교하기 위해 시간을 00:00:00으로 설정
        const gameDateOnly = new Date(gameDate.getFullYear(), gameDate.getMonth(), gameDate.getDate());
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        return gameDateOnly >= startDateOnly && gameDateOnly <= endDateOnly;
      });
    }

    if (filters.status !== "all") {
      filteredGames = filteredGames.filter((game) => game.status === filters.status);
    }

    if (filters.hasRulebook !== "all") {
      filteredGames = filteredGames.filter((game) =>
        filters.hasRulebook === "yes" ? game.rulebook_exists : !game.rulebook_exists
      );
    }

    if (filters.needsReorder !== "all") {
      filteredGames = filteredGames.filter((game) =>
        filters.needsReorder === "yes" ? game.reorder_needed : !game.reorder_needed
      );
    }

    if (sortDirection) {
      filteredGames.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case "name":
            comparison = (a.game?.name || "").localeCompare(b.game?.name || "");
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
          case "lastCheckDate":
            comparison = new Date(a.last_check_date).getTime() - new Date(b.last_check_date).getTime();
            break;
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filteredGames;
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
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />;
    return <ArrowDown className="h-4 w-4" />;
  };

  const getSortStatusText = () => {
    if (!sortField || !sortDirection) return null;

    const fieldNames = {
      name: "게임 이름",
      status: "상태",
      lastCheckDate: "최근 점검일",
    };

    const directionText = sortDirection === "asc" ? "오름차순" : "내림차순";
    return `정렬 기준: ${fieldNames[sortField]} (${directionText})`;
  };

  const clearFilter = (filterKey: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]:
        filterKey === "status"
          ? "all"
          : filterKey === "checkDateStart" || filterKey === "checkDateEnd"
          ? null
          : filterKey === "hasRulebook" || filterKey === "needsReorder"
          ? "all"
          : "",
    }));
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "" && value !== "all" && value !== null);

  return (
    <div className="p-4 space-y-6 max-w-full">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">보드 게임 관리</h1>
          <p className="text-sm sm:text-base text-muted-foreground">지점의 모든 보드 게임 목록을 확인하세요</p>
        </div>
        <div className="flex flex-col gap-2">
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
            {getSortStatusText() && <p className="text-xs sm:text-sm text-muted-foreground">{getSortStatusText()}</p>}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">게임 이름</label>
              <Input
                placeholder="게임 이름으로 검색"
                value={filters.gameName}
                onChange={(e) => setFilters((prev) => ({ ...prev, gameName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">구분자</label>
              <Input
                placeholder="구분자로 검색"
                value={filters.identifier}
                onChange={(e) => setFilters((prev) => ({ ...prev, identifier: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">점검일</label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.checkDateStart ? format(filters.checkDateStart, "PPP", { locale: ko }) : "시작일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.checkDateStart || undefined}
                      onSelect={(date) => setFilters((prev) => ({ ...prev, checkDateStart: date }))}
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.checkDateEnd ? format(filters.checkDateEnd, "PPP", { locale: ko }) : "마감일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.checkDateEnd || undefined}
                      onSelect={(date) => setFilters((prev) => ({ ...prev, checkDateEnd: date }))}
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">상태</label>
              <Select
                value={filters.status}
                onValueChange={(value: GameStatus | "all") => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value={GameStatus.상}>상</SelectItem>
                  <SelectItem value={GameStatus.중}>중</SelectItem>
                  <SelectItem value={GameStatus.하}>하</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">룰북</label>
              <Select
                value={filters.hasRulebook}
                onValueChange={(value: "all" | "yes" | "no") => setFilters((prev) => ({ ...prev, hasRulebook: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="룰북 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="yes">보유</SelectItem>
                  <SelectItem value="no">없음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">재주문</label>
              <Select
                value={filters.needsReorder}
                onValueChange={(value: "all" | "yes" | "no") =>
                  setFilters((prev) => ({ ...prev, needsReorder: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="재주문 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="yes">필요</SelectItem>
                  <SelectItem value="no">불필요</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.gameName && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  게임: {filters.gameName}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("gameName")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.identifier && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  구분자: {filters.identifier}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("identifier")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {(filters.checkDateStart || filters.checkDateEnd) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  점검일:{" "}
                  {filters.checkDateStart ? format(filters.checkDateStart, "PPP", { locale: ko }) : "1999.12.31"} ~{" "}
                  {filters.checkDateEnd ? format(filters.checkDateEnd, "PPP", { locale: ko }) : "오늘"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => {
                      clearFilter("checkDateStart");
                      clearFilter("checkDateEnd");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.status !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  상태: {filters.status}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("status")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.hasRulebook !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  룰북: {filters.hasRulebook === "yes" ? "보유" : "없음"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("hasRulebook")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.needsReorder !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  재주문: {filters.needsReorder === "yes" ? "필요" : "불필요"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => clearFilter("needsReorder")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}

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
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        게임 이름
                        {getSortIcon("name")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[80px] sm:w-auto">
                      <span className="text-xs sm:text-sm">구분자</span>
                    </TableHead>
                    <TableHead className="w-[100px] sm:w-auto">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("lastCheckDate")}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        점검일
                        {getSortIcon("lastCheckDate")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[80px] sm:w-auto">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        상태
                        {getSortIcon("status")}
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
