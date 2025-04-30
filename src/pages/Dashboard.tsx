
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getGamesNeedingAttention, getAllGames } from '@/services/game-service';
import { Game } from '@/types/game';
import StatusBadge from '@/components/status-badge';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [gamesNeedingAttention, setGamesNeedingAttention] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attentionGames, allGames] = await Promise.all([
          getGamesNeedingAttention(),
          getAllGames(),
        ]);
        
        setGamesNeedingAttention(attentionGames);
        setTotalGames(allGames.length);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    needsReorder: gamesNeedingAttention.filter(game => game.needs_reorder).length,
    missingComponents: gamesNeedingAttention.filter(game => game.missing_components && game.missing_components.trim() !== '').length,
    poorCondition: gamesNeedingAttention.filter(game => game.component_status === '하').length,
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
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your board game inventory</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Games</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGames}</div>
            <p className="text-xs text-muted-foreground">
              Games in your collection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Needs Attention</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamesNeedingAttention.length}</div>
            <p className="text-xs text-muted-foreground">
              Games requiring attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Needs Reorder</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.needsReorder}</div>
            <p className="text-xs text-muted-foreground">
              Games needing component reorder
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Games Needing Attention</CardTitle>
          <CardDescription>
            These games have issues that need to be addressed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gamesNeedingAttention.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No games currently need attention
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead className="hidden md:table-cell">Last Inspected</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gamesNeedingAttention.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={game.component_status} />
                      </TableCell>
                      <TableCell>
                        {game.needs_reorder && "Needs reorder"}
                        {game.needs_reorder && game.missing_components && " | "}
                        {game.missing_components && "Missing components"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(game.inspected_at), 'PPP')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link 
                          to={`/games/${game.id}`}
                          className="text-primary hover:underline"
                        >
                          View Details
                        </Link>
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

export default Dashboard;
