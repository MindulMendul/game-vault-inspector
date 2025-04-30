
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getGameById, updateGame } from '@/services/game-service';
import { Game } from '@/types/game';
import GameForm from '@/components/game-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) {
        navigate('/games');
        return;
      }

      try {
        const data = await getGameById(id);
        if (!data) {
          toast.error('Game not found');
          navigate('/games');
          return;
        }
        setGame(data);
      } catch (error) {
        console.error('Failed to fetch game:', error);
        toast.error('Failed to load game details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [id, navigate]);

  const handleSubmit = async (formData: Partial<Game>) => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const updatedGame = await updateGame(id, formData);
      if (updatedGame) {
        setGame(updatedGame);
        toast.success('Game updated successfully');
      }
    } catch (error) {
      console.error('Failed to update game:', error);
      toast.error('Failed to update game');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold order-first sm:order-last">{game?.name}</h1>
      </div>
      
      {game && (
        <GameForm
          game={game}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      )}
    </div>
  );
};

export default GameDetail;
