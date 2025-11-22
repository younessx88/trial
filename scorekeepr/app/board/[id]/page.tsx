'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBoard, saveBoard } from '@/lib/storage';
import { copyToClipboard, getBoardUrl } from '@/lib/utils';
import { Board, Player } from '@/types';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function BoardView() {
  const params = useParams();
  const boardId = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [copied, setCopied] = useState(false);
  const [previousWinner, setPreviousWinner] = useState<string | null>(null);

  useEffect(() => {
    const loadedBoard = getBoard(boardId);
    setBoard(loadedBoard);
  }, [boardId]);

  useEffect(() => {
    if (!board) return;

    const sortedPlayers = getSortedPlayers();
    if (sortedPlayers.length === 0) return;

    const currentWinner = sortedPlayers[0].id;

    if (previousWinner && previousWinner !== currentWinner) {
      // New winner! Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setPreviousWinner(currentWinner);
  }, [board?.players]);

  const getSortedPlayers = (): Player[] => {
    if (!board) return [];

    return [...board.players].sort((a, b) => {
      if (board.gameType === 'higher') {
        return b.score - a.score;
      } else {
        return a.score - b.score;
      }
    });
  };

  const updateScore = (playerId: string, delta: number) => {
    if (!board) return;

    const updatedPlayers = board.players.map(player =>
      player.id === playerId
        ? { ...player, score: Math.max(0, player.score + delta) }
        : player
    );

    const updatedBoard = { ...board, players: updatedPlayers };
    setBoard(updatedBoard);
    saveBoard(updatedBoard);
  };

  const handleCopyLink = async () => {
    const url = getBoardUrl(boardId);
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg-subtle">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Board Not Found</h1>
          <p className="text-gray-600 mb-6">This leaderboard doesn't exist or has been deleted.</p>
          <Link href="/" className="btn-primary inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const sortedPlayers = getSortedPlayers();

  return (
    <div className="min-h-screen gradient-bg-subtle py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {board.name}
              </h1>
              <p className="text-gray-600">
                {board.gameType === 'higher' ? '📈 Higher is better' : '📉 Lower is better'}
              </p>
            </div>
            <button
              onClick={handleCopyLink}
              className="btn-primary text-sm whitespace-nowrap"
            >
              {copied ? '✓ Copied!' : '🔗 Share Link'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Anyone with the link can update scores</span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => {
            const isWinner = index === 0;
            const medals = ['🥇', '🥈', '🥉'];
            const medal = medals[index];

            return (
              <div
                key={player.id}
                className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                  isWinner ? 'ring-4 ring-yellow-400 transform scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Rank & Name */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-4xl flex-shrink-0">
                      {medal || `#${index + 1}`}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                        {player.name}
                      </h3>
                      {isWinner && (
                        <span className="text-sm font-semibold text-yellow-600">
                          Current Leader!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score & Controls */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => updateScore(player.id, -1)}
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-xl transition-colors"
                    >
                      -
                    </button>

                    <div className="text-center min-w-[80px]">
                      <div className="text-3xl md:text-4xl font-bold text-gray-900">
                        {player.score}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>

                    <button
                      onClick={() => updateScore(player.id, 1)}
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-xl transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {!board.branding?.hideWatermark && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Made with{' '}
              <Link href="/" className="text-purple-600 font-semibold hover:text-purple-700">
                ScoreKeepr
              </Link>
              {' '}• Create your own free leaderboard
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
