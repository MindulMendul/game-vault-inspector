import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createGame, addGameToBranch, getGames } from "@/services/supabase.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Game } from "@/types/database.types";

const AdminGameNew: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    game_id: "",
    game_name: "",
    game_identifier: "",
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const games = await getGames();
        setAllGames(games);
      } catch (error) {
        console.error("Failed to fetch games:", error);
        toast.error("게임 목록을 불러오는데 실패했습니다");
      }
    };

    fetchGames();
  }, []);

  const filteredGames = allGames
    .filter((game) => game.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.branch_id) {
      toast.error("지점 정보를 찾을 수 없습니다");
      return;
    }

    if (!formData.game_name) {
      toast.error("게임을 선택해주세요");
      return;
    }

    setIsSaving(true);
    try {
      // 게임 이름으로 게임 ID 찾기
      const games = await getGames();
      console.log("Available games:", games);

      const selectedGame = games.find((game) => game.name === formData.game_name);
      console.log("Selected game:", selectedGame);

      if (!selectedGame) {
        toast.error(`'${formData.game_name}' 게임을 찾을 수 없습니다`);
        return;
      }

      console.log("Attempting to add game with:", {
        branchId: user.branch_id,
        gameId: selectedGame.id,
        gameIdentifier: formData.game_identifier || null,
      });

      await addGameToBranch(user.branch_id, selectedGame.id, formData.game_identifier);
      toast.success("게임이 성공적으로 추가되었습니다");
      navigate("/admin/games");
    } catch (error) {
      console.error("Failed to add game:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("게임 추가에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleGameSelect = (game: Game) => {
    setFormData({
      game_id: game.id,
      game_name: game.name,
      game_identifier: "",
    });
    setSearchQuery(game.name);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Button variant="outline" asChild className="w-fit flex gap-2 items-center">
          <Link to="/admin/games">
            <ArrowLeft className="h-4 w-4" /> 게임 목록으로 돌아가기
          </Link>
        </Button>
        <h1 className="text-2xl font-bold order-first sm:order-last">새 게임 추가</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>게임 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="game_name">게임 이름</Label>
              <div className="relative">
                <Input
                  id="game_name"
                  name="game_name"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="게임 이름을 입력하세요"
                  required
                />
                {showDropdown && filteredGames.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredGames.map((game) => (
                      <div
                        key={game.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleGameSelect(game)}
                      >
                        {game.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="game_identifier">게임 구분자 (선택사항)</Label>
              <Input
                id="game_identifier"
                name="game_identifier"
                value={formData.game_identifier}
                onChange={(e) => setFormData({ ...formData, game_identifier: e.target.value })}
                placeholder="게임 구분자를 입력하세요 (예: A-001)"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "저장 중..." : "게임 추가"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGameNew;
