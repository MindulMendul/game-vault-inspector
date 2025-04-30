
import { Store } from '@/types/store';

// 임시 매장 데이터
const MOCK_STORES: Store[] = [
  {
    id: 'suwon',
    name: '수원역점',
    location: '경기도 수원시 팔달구 덕영대로 924',
    description: '수원역 1번 출구에서 도보 5분 거리에 위치한 보드게임 카페입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'skku',
    name: '성균관대역점',
    location: '경기도 수원시 장안구 서부로 2066',
    description: '성균관대역 3번 출구에서 도보 3분 거리에 위치한 보드게임 카페입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1569240651738-3d5756c4c0e6?q=80&w=1000&auto=format&fit=crop'
  }
];

// 모든 매장 가져오기
export const getAllStores = async (): Promise<Store[]> => {
  return new Promise((resolve) => {
    // API 지연 시뮬레이션
    setTimeout(() => {
      resolve([...MOCK_STORES]);
    }, 500);
  });
};

// ID로 매장 가져오기
export const getStoreById = async (id: string): Promise<Store | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const store = MOCK_STORES.find((s) => s.id === id) || null;
      resolve(store ? { ...store } : null);
    }, 300);
  });
};

// 매장 ID로 게임 목록 가져오기 - 게임 서비스와 통합
export const getGamesByStoreId = async (storeId: string) => {
  // 여기서는 모든 게임이 모든 매장에 있다고 가정하고 게임 서비스 재사용
  const { getAllGames } = await import('./game-service');
  const games = await getAllGames();
  
  // 실제로는 매장별로 필터링하는 로직이 필요할 수 있음
  // 여기서는 예시로 간단히 구현
  return games;
};
