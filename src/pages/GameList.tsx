
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllGames } from '@/services/game-service';
import { Game } from '@/types/game';
import StatusBadge from '@/components/status-badge';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getAllGames();
        setGames(data);
      } catch (error) {
        console.error('Failed to fetch games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Board Game Collection</h1>
          <p className="text-muted-foreground">Manage and inspect your board games</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search games..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/games/new">
              <Plus className="mr-1 h-4 w-4" /> Add Game
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No games found</p>
              <Button asChild variant="outline">
                <Link to="/games/new">Add your first game</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Game Name</TableHead>
                    <TableHead className="hidden md:table-cell">Last Inspected</TableHead>
                    <TableHead className="hidden md:table-cell">Rulebook</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Missing Parts</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(game.inspected_at), 'PPP')}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {game.has_manual ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={game.component_status} />
                      </TableCell>
                      <TableCell>
                        {game.missing_components ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          asChild
                        >
                          <Link to={`/games/${game.id}`}>
                            View Details
                          </Link>
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

export default GameList;
