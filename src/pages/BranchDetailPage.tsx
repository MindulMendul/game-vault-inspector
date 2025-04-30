import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Branch, BranchGameList, GameStatus } from "../types/database.types";
import { getBranchById, getBranchGames, updateGameStatus } from "../services/supabase.service";

export const BranchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [games, setGames] = useState<BranchGameList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [branchData, gamesData] = await Promise.all([getBranchById(id), getBranchGames(id)]);

        setBranch(branchData);
        setGames(gamesData);
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusUpdate = async (gameId: string, status: GameStatus, missingParts?: string) => {
    try {
      await updateGameStatus(gameId, status, missingParts);
      const updatedGames = await getBranchGames(id!);
      setGames(updatedGames);
    } catch (err) {
      console.error("상태 업데이트 실패:", err);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  if (error || !branch) {
    return <div className="text-red-500 text-center mt-4">{error || "지점을 찾을 수 없습니다."}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/branches" className="text-indigo-600 hover:text-indigo-800">
          ← 지점 목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start">
          {branch.photo && (
            <img src={branch.photo} alt={branch.name} className="w-48 h-48 object-cover rounded-md mr-6" />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{branch.name}</h1>
            {branch.location && <p className="text-gray-600 mb-4">{branch.location}</p>}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">보유 게임 목록</h2>
      <div className="grid grid-cols-1 gap-4">
        {games.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div className="flex items-center">
              {item.game?.photo && (
                <img src={item.game.photo} alt={item.game.name} className="w-24 h-24 object-cover rounded-md mr-4" />
              )}
              <div>
                <h3 className="text-xl font-semibold">{item.game?.name}</h3>
                <p className="text-gray-600">ID: {item.game_identifier}</p>
                <p className="text-sm text-gray-500">
                  최근 점검일: {new Date(item.last_check_date).toLocaleDateString()}
                </p>
                {item.missing_parts && <p className="text-red-500 text-sm">누락: {item.missing_parts}</p>}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <select
                value={item.status}
                onChange={(e) => handleStatusUpdate(item.id, e.target.value as GameStatus)}
                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {Object.values(GameStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    item.rulebook_exists ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.rulebook_exists ? "룰북 있음" : "룰북 없음"}
                </span>
                {item.reorder_needed && (
                  <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">재주문 필요</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
