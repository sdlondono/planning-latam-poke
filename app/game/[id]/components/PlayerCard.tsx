import { EyeIcon } from './Icons'
import { Player, GameState } from '../types'

interface PlayerCardProps {
  player: Player
  gameState: GameState
  isCurrentUser?: boolean
}

export default function PlayerCard({
  player,
  gameState,
  isCurrentUser = false
}: PlayerCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Card Slot */}
      <div
        className={`w-12 h-16 rounded-md border-2 flex items-center justify-center transition-all duration-200 
                  ${
                    player.role === 'spectator'
                      ? 'bg-transparent border-gray-500 border-dashed'
                      : player.vote
                        ? `bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] ${
                            isCurrentUser ? '-translate-y-2' : ''
                          }`
                        : 'bg-gray-700 border-gray-600 border-dashed'
                  }`}
      >
        {player.role === 'spectator' ? (
          <EyeIcon className="w-6 h-6 text-gray-400" />
        ) : gameState.isRevealed && player.vote ? (
          <span className="text-white font-bold text-xl">{player.vote}</span>
        ) : player.vote ? (
          <div className="w-full h-full relative overflow-hidden">
            {/* Pattern for card back */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '4px 4px'
              }}
            ></div>
          </div>
        ) : null}
      </div>
      <span className="font-bold text-white text-sm">{player.name}</span>
    </div>
  )
}
