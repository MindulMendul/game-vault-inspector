
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createGame } from '@/services/game-service';
import GameForm from '@/components/game-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Game } from '@/types/game';

const AdminGameNew: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (formData: Omit<Game, 'id' | 'created_at'>) => {
    setIsSaving(true);
    try {
      const newGame = await createGame(formData);
      toast.success('게임이 성공적으로 추가되었습니다');
      navigate(`/admin/games/${newGame.id}`);
    } catch (error) {
      console.error('Failed to add game:', error);
      toast.error('게임 추가에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Button 
          variant="outline" 
          asChild 
          className="w-fit flex gap-2 items-center"
        >
          <Link to="/admin/games">
            <ArrowLeft className="h-4 w-4" /> 게임 목록으로 돌아가기
          </Link>
        </Button>
        <h1 className="text-2xl font-bold order-first sm:order-last">새 게임 추가</h1>
      </div>
      
      <GameForm
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
};

export default AdminGameNew;
