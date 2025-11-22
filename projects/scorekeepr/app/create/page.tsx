'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBoard, getUserBoardCount, generateBoardId } from '@/lib/storage';
import { Board, Player } from '@/types';
import Link from 'next/link';

export default function CreateBoard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [boardName, setBoardName] = useState('');
  const [gameType, setGameType] = useState<'higher' | 'lower'>('higher');
  const [players, setPlayers] = useState<string[]>(['', '']);
  const [isCreating, setIsCreating] = useState(false);

  const addPlayer = () => {
    const boardCount = getUserBoardCount();
    const maxPlayers = boardCount === 0 ? 5 : 999; // Free tier = 5 players

    if (players.length < maxPlayers) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleCreateBoard = () => {
    if (!boardName.trim()) return;

    const validPlayers = players.filter(p => p.trim());
    if (validPlayers.length < 2) {
      alert('Please add at least 2 players');
      return;
    }

    setIsCreating(true);

    const boardId = generateBoardId();
    const playerObjects: Player[] = validPlayers.map((name, index) => ({
      id: `player-${index}-${Date.now()}`,
      name: name.trim(),
      score: 0,
    }));

    const newBoard: Board = {
      id: boardId,
      name: boardName.trim(),
      players: playerObjects,
      gameType,
      createdAt: Date.now(),
    };

    saveBoard(newBoard);
    router.push(`/board/${boardId}`);
  };

  return (
    <div className="min-h-screen gradient-bg-subtle py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-600 font-semibold mb-8 inline-block hover:text-purple-700">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Create Your Leaderboard
            </h1>
            <p className="text-gray-600">
              {step === 1 ? 'Give your leaderboard a name' : 'Add players to your leaderboard'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Step 1: Board Name & Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leaderboard Name
                </label>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="e.g., Office Ping Pong Championship"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Scoring Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGameType('higher')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      gameType === 'higher'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">📈</div>
                    <div className="font-semibold text-gray-900">Higher is Better</div>
                    <div className="text-sm text-gray-600">For points, wins, streaks</div>
                  </button>
                  <button
                    onClick={() => setGameType('lower')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      gameType === 'lower'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">📉</div>
                    <div className="font-semibold text-gray-900">Lower is Better</div>
                    <div className="text-sm text-gray-600">For time, errors, losses</div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!boardName.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Add Players */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Players (minimum 2)
                </label>
                <div className="space-y-3">
                  {players.map((player, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => updatePlayer(index, e.target.value)}
                        placeholder={`Player ${index + 1} name`}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                      {players.length > 2 && (
                        <button
                          onClick={() => removePlayer(index)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {players.length < 5 && (
                  <button
                    onClick={addPlayer}
                    className="mt-3 text-purple-600 font-semibold hover:text-purple-700"
                  >
                    + Add Another Player
                  </button>
                )}

                {players.length >= 5 && getUserBoardCount() === 0 && (
                  <p className="mt-3 text-sm text-gray-600">
                    Free tier limited to 5 players. Upgrade to Pro for unlimited players.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateBoard}
                  disabled={isCreating || players.filter(p => p.trim()).length < 2}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create Leaderboard'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-purple-50 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-2">💡 Quick Tips</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• You can share the leaderboard link with anyone</li>
            <li>• Everyone with the link can update scores</li>
            <li>• Your leaderboard is saved in your browser</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
