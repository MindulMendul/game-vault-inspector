import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBranchGames, updateBranchGame, deleteBranchGame, getInspectors } from "@/services/supabase.service";
import { BranchGameList, GameStatus, BranchManager } from "@/types/database.types";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminGameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<BranchGameList | null>(null);
  const [inspectors, setInspectors] = useState<BranchManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user?.branch_id) {
        toast.error("잘못된 접근입니다");
        navigate("/admin/games");
        return;
      }

      try {
        const [games, inspectorsList] = await Promise.all([
          getBranchGames(user.branch_id),
          getInspectors(user.branch_id),
        ]);

        const gameData = games.find((g) => g.id === id);

        if (!gameData) {
          toast.error("게임을 찾을 수 없습니다");
          navigate("/admin/games");
          return;
        }

        setGame(gameData);
        setInspectors(inspectorsList);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("데이터를 불러오지 못했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, user?.branch_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !game) return;

    setIsSaving(true);
    try {
      await updateBranchGame(id, {
        status: game.status,
        missing_parts: game.missing_parts,
        rulebook_exists: game.rulebook_exists,
        reorder_needed: game.reorder_needed,
        last_check_date: game.last_check_date,
        inspector: game.inspector,
      });

      toast.success("게임이 성공적으로 업데이트되었습니다");
      navigate("/admin/games");
    } catch (error) {
      console.error("Failed to update game:", error);
      toast.error("게임 업데이트에 실패했습니다");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteBranchGame(id);
      toast.success("게임이 성공적으로 삭제되었습니다");
      navigate("/admin/games");
    } catch (error) {
      console.error("Failed to delete game:", error);
      toast.error("게임 삭제에 실패했습니다");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Button variant="outline" asChild className="w-fit flex gap-2 items-center">
          <Link to="/admin/games">
            <ArrowLeft className="h-4 w-4" /> 게임 목록으로 돌아가기
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{game.game?.name}</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>게임 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  이 게임을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>게임 상태 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>게임 상태</Label>
                <Select value={game.status} onValueChange={(value: GameStatus) => setGame({ ...game, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="게임 상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GameStatus.상}>상</SelectItem>
                    <SelectItem value={GameStatus.중}>중</SelectItem>
                    <SelectItem value={GameStatus.하}>하</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>관리일</Label>
                <Input
                  type="date"
                  value={game.last_check_date}
                  onChange={(e) => setGame({ ...game, last_check_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>관리자</Label>
                <Input
                  type="text"
                  value={game.inspector || ""}
                  onChange={(e) => setGame({ ...game, inspector: e.target.value })}
                  placeholder="관리자 이름을 입력하세요"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>특이사항</Label>
              <Textarea
                value={game.missing_parts || ""}
                onChange={(e) => setGame({ ...game, missing_parts: e.target.value })}
                placeholder="게임의 특이사항을 입력하세요"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={game.rulebook_exists}
                  onCheckedChange={(checked) => setGame({ ...game, rulebook_exists: checked })}
                />
                <Label>룰북 보유</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={game.reorder_needed}
                  onCheckedChange={(checked) => setGame({ ...game, reorder_needed: checked })}
                />
                <Label>재주문 필요</Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "저장 중..." : "변경사항 저장"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGameDetail;
