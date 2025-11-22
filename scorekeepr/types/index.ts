export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Board {
  id: string;
  name: string;
  players: Player[];
  gameType: 'higher' | 'lower'; // higher is better or lower is better
  createdAt: number;
  isPro?: boolean;
  branding?: {
    logo?: string;
    primaryColor?: string;
    hideWatermark?: boolean;
  };
}

export interface StorageData {
  boards: Record<string, Board>;
  userBoards: string[]; // Board IDs created by this user
}
