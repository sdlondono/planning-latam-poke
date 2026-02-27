import { Player, GameState } from '../types'

interface TableAreaProps {
  gameState: GameState
  selectedCard: string | null
  otherPlayers: Player[]
  hasJoined: boolean
  handleReveal: () => void
}

export default function TableArea({
  gameState,
  selectedCard,
  otherPlayers,
  hasJoined,
  handleReveal
}: TableAreaProps) {
  const hasAnyoneVoted = selectedCard || otherPlayers.some((p) => p.vote)

  return (
    <div className="w-80 h-40 bg-[#324b6e] rounded-3xl flex items-center justify-center shadow-lg relative transition-all duration-300 z-10">
      {hasAnyoneVoted ? (
        <button
          onClick={handleReveal}
          disabled={!hasJoined}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {gameState.isRevealed ? 'Start New Vote' : 'Reveal cards'}
        </button>
      ) : (
        <span className="text-blue-100/70 font-medium">Pick your cards!</span>
      )}

      {/* Glow effect when anyone has selected */}
      {hasAnyoneVoted && (
        <div className="absolute inset-0 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.3)] pointer-events-none"></div>
      )}
    </div>
  )
}
