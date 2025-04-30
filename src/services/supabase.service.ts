import { supabase } from "../lib/supabase";
import { Branch, BranchGameList, BranchManager, Component, Game, GameStatus } from "../types/database.types";

// Branch 관련 함수들
export const getBranches = async (): Promise<Branch[]> => {
  const { data, error } = await supabase.from("branches").select("*");

  if (error) throw error;
  return data || [];
};

export const getBranchById = async (id: string): Promise<Branch | null> => {
  const { data, error } = await supabase.from("branches").select("*").eq("id", id).single();

  if (error) throw error;
  return data;
};

// Branch Manager 관련 함수들
export const loginBranchManager = async (username: string, password: string): Promise<BranchManager | null> => {
  const { data, error } = await supabase
    .from("branch_managers")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error) {
    console.error("Login error:", error);
    return null;
  }

  return data;
};

// Game 관련 함수들
export const getGames = async (): Promise<Game[]> => {
  const { data, error } = await supabase.from("games").select("*");

  if (error) throw error;
  return data || [];
};

export const getGameById = async (id: string): Promise<Game | null> => {
  const { data, error } = await supabase.from("games").select("*").eq("id", id).single();

  if (error) throw error;
  return data;
};

export const createGame = async (gameData: Omit<Game, "id" | "created_at">): Promise<Game> => {
  const { data, error } = await supabase.from("games").insert([gameData]).select().single();

  if (error) throw error;
  return data;
};

export const addGameToBranch = async (
  branchId: string,
  gameId: string,
  gameIdentifier?: string
): Promise<BranchGameList> => {
  try {
    console.log("Adding game to branch:", { branchId, gameId, gameIdentifier });

    // 게임 추가
    const { data, error } = await supabase
      .from("branch_game_list")
      .insert([
        {
          branch_id: branchId,
          game_id: gameId,
          game_identifier: gameIdentifier || null,
          status: GameStatus.상,
          last_check_date: new Date().toISOString().split("T")[0],
          rulebook_exists: true,
          reorder_needed: false,
          missing_parts: null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding game to branch:", error);
      throw new Error(`게임 추가 실패: ${error.message}`);
    }

    if (!data) {
      console.error("No data returned after insert");
      throw new Error("게임 추가 후 데이터를 받지 못했습니다");
    }

    console.log("Successfully added game:", data);
    return data;
  } catch (error) {
    console.error("Failed to add game to branch:", error);
    throw error;
  }
};

// Branch Game List 관련 함수들
export const getBranchGames = async (branchId: string): Promise<BranchGameList[]> => {
  const { data, error } = await supabase
    .from("branch_game_list")
    .select(
      `
      *,
      game:games(*)
    `
    )
    .eq("branch_id", branchId);

  if (error) throw error;
  return data || [];
};

export const updateGameStatus = async (id: string, status: GameStatus, missing_parts?: string): Promise<void> => {
  const { error } = await supabase
    .from("branch_game_list")
    .update({
      status,
      missing_parts: missing_parts || null,
      last_check_date: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
};

// Components 관련 함수들
export const getGameComponents = async (gameId: string): Promise<Component[]> => {
  const { data, error } = await supabase.from("components").select("*").eq("game_id", gameId);

  if (error) throw error;
  return data || [];
};

// 지점게임목록 업데이트
export const updateBranchGame = async (
  id: string,
  data: {
    status?: GameStatus;
    missing_parts?: string;
    rulebook_exists?: boolean;
    reorder_needed?: boolean;
    last_check_date?: string;
    inspector?: string;
  }
) => {
  const { data: updatedGame, error } = await supabase
    .from("branch_game_list")
    .update({
      ...data,
      last_check_date: data.last_check_date || new Date().toISOString().split("T")[0],
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updatedGame;
};

// 지점게임목록 삭제
export const deleteBranchGame = async (id: string) => {
  const { error } = await supabase.from("branch_game_list").delete().eq("id", id);

  if (error) throw error;
};

// Inspector 관련 함수들
export const getInspectors = async (branchId: string): Promise<BranchManager[]> => {
  const { data, error } = await supabase.from("branch_managers").select("*").eq("branch_id", branchId);

  if (error) throw error;
  return data || [];
};
