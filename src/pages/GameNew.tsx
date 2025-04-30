
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createGame } from '@/services/game-service';
import GameForm from '@/components/game-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Game } from '@/types/game';

const GameNew: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (formData: Omit<Game, 'id' | 'created_at'>) => {
    setIsSaving(true);
    try {
      const newGame = await createGame(formData);
      toast.success('Game added successfully');
      navigate(`/games/${newGame.id}`);
    } catch (error) {
      console.error('Failed to add game:', error);
      toast.error('Failed to add game');
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
          <Link to="/games">
            <ArrowLeft className="h-4 w-4" /> Back to Games
          </Link>
        </Button>
        <h1 className="text-2xl font-bold order-first sm:order-last">Add New Game</h1>
      </div>
      
      <GameForm
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
};

export default GameNew;
