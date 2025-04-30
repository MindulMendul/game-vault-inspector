export type Branch = {
  id: string;
  name: string;
  photo: string | null;
  location: string | null;
};

export type BranchManager = {
  id: string;
  branch_id: string;
  username: string;
  password: string;
};

export type Game = {
  id: string;
  name: string;
  description: string;
  photo: string | null;
  min_players: number;
  max_players: number;
  play_time: number;
  difficulty: number;
  created_at?: string;
};

export enum GameStatus {
  상 = "상",
  중 = "중",
  하 = "하",
}

export interface BranchGameList {
  id: string;
  branch_id: string;
  game_id: string;
  game_identifier: string;
  last_check_date: string;
  rulebook_exists: boolean;
  status: GameStatus;
  reorder_needed: boolean;
  missing_parts: string | null;
  inspector: string | null;
  game?: Game;
}

export type Component = {
  id: string;
  game_id: string;
  component_count: number;
  component_photo: string | null;
  component_name: string;
};
