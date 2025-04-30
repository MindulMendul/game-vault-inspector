
import { Game, ComponentStatus } from '@/types/game';

// This is temporary mock data that will be replaced by Supabase integration
const MOCK_GAMES: Game[] = [
  {
    id: '1',
    name: 'Catan',
    inspected_at: new Date('2024-04-15').toISOString(),
    inspected_by: 'Admin User',
    has_manual: true,
    component_status: '상',
    needs_reorder: false,
    missing_components: '',
    created_at: new Date('2023-01-10').toISOString(),
  },
  {
    id: '2',
    name: 'Ticket to Ride',
    inspected_at: new Date('2024-04-10').toISOString(),
    inspected_by: 'Admin User',
    has_manual: true,
    component_status: '중',
    needs_reorder: false,
    missing_components: 'Missing 2 blue trains',
    created_at: new Date('2023-02-15').toISOString(),
  },
  {
    id: '3',
    name: 'Pandemic',
    inspected_at: new Date('2024-03-28').toISOString(),
    inspected_by: 'Admin User',
    has_manual: false,
    component_status: '하',
    needs_reorder: true,
    missing_components: 'Missing role cards and 3 disease cubes',
    created_at: new Date('2023-03-20').toISOString(),
  },
  {
    id: '4',
    name: 'Azul',
    inspected_at: new Date('2024-04-05').toISOString(),
    inspected_by: 'Admin User',
    has_manual: true,
    component_status: '상',
    needs_reorder: false,
    missing_components: '',
    created_at: new Date('2023-04-05').toISOString(),
  },
  {
    id: '5',
    name: 'Splendor',
    inspected_at: new Date('2024-04-18').toISOString(),
    inspected_by: 'Admin User',
    has_manual: true,
    component_status: '중',
    needs_reorder: false,
    missing_components: 'Some gem tokens showing wear',
    created_at: new Date('2023-05-12').toISOString(),
  },
];

// Get all games
export const getAllGames = async (): Promise<Game[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve([...MOCK_GAMES]);
    }, 500);
  });
};

// Get game by ID
export const getGameById = async (id: string): Promise<Game | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const game = MOCK_GAMES.find((g) => g.id === id) || null;
      resolve(game ? { ...game } : null);
    }, 300);
  });
};

// Create a new game
export const createGame = async (gameData: Omit<Game, 'id' | 'created_at'>): Promise<Game> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGame = {
        ...gameData,
        id: `${MOCK_GAMES.length + 1}`,
        created_at: new Date().toISOString(),
      };
      MOCK_GAMES.push(newGame);
      resolve({ ...newGame });
    }, 500);
  });
};

// Update a game
export const updateGame = async (id: string, gameData: Partial<Game>): Promise<Game | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_GAMES.findIndex((g) => g.id === id);
      if (index === -1) {
        resolve(null);
        return;
      }
      
      MOCK_GAMES[index] = { ...MOCK_GAMES[index], ...gameData };
      resolve({ ...MOCK_GAMES[index] });
    }, 500);
  });
};

// Get games that need reordering or have missing components
export const getGamesNeedingAttention = async (): Promise<Game[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredGames = MOCK_GAMES.filter(
        (game) => game.needs_reorder || 
                 (game.missing_components && game.missing_components.trim() !== '') ||
                 game.component_status === '하'
      );
      resolve([...filteredGames]);
    }, 500);
  });
};
