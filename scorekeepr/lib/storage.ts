import { Board, StorageData } from '@/types';

const STORAGE_KEY = 'scorekeepr_data';

export const getStorageData = (): StorageData => {
  if (typeof window === 'undefined') {
    return { boards: {}, userBoards: [] };
  }

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { boards: {}, userBoards: [] };
  }

  try {
    return JSON.parse(data);
  } catch {
    return { boards: {}, userBoards: [] };
  }
};

export const saveBoard = (board: Board): void => {
  if (typeof window === 'undefined') return;

  const data = getStorageData();
  data.boards[board.id] = board;

  // Add to user's board list if not already there
  if (!data.userBoards.includes(board.id)) {
    data.userBoards.push(board.id);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getBoard = (id: string): Board | null => {
  const data = getStorageData();
  return data.boards[id] || null;
};

export const getUserBoards = (): Board[] => {
  const data = getStorageData();
  return data.userBoards
    .map(id => data.boards[id])
    .filter(Boolean)
    .sort((a, b) => b.createdAt - a.createdAt);
};

export const getUserBoardCount = (): number => {
  const data = getStorageData();
  return data.userBoards.length;
};

export const deleteBoard = (id: string): void => {
  if (typeof window === 'undefined') return;

  const data = getStorageData();
  delete data.boards[id];
  data.userBoards = data.userBoards.filter(boardId => boardId !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const generateBoardId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};
