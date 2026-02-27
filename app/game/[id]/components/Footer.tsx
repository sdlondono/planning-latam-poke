import { CoffeeIcon } from './Icons'

interface FooterProps {
  isSpectatorMode: boolean
  tShirtCards: string[]
  selectedCard: string | null
  handleSelectCard: (card: string | null) => void
  hasJoined: boolean
  handleDeactivateSpectator: () => void
}

export default function Footer({
  isSpectatorMode,
  tShirtCards,
  selectedCard,
  handleSelectCard,
  hasJoined,
  handleDeactivateSpectator
}: FooterProps) {
  return (
    <footer className="w-full pb-8 pt-4 flex flex-col items-center gap-4 bg-gradient-to-t from-[#1F2937] to-transparent">
      {isSpectatorMode ? (
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-300 text-sm flex items-center gap-2">
            You are in spectator mode <span className="text-xl">👁️</span>
          </span>
          <button
            onClick={handleDeactivateSpectator}
            className="text-blue-400 text-sm font-medium hover:text-blue-300 hover:underline"
          >
            Deactivate
          </button>
        </div>
      ) : (
        <>
          <span className="text-gray-400 text-sm font-medium">
            Choose your card 👇
          </span>

          <div className="flex flex-wrap justify-center gap-3 px-4">
            {tShirtCards.map((card) => (
              <button
                key={card}
                onClick={() =>
                  handleSelectCard(card === selectedCard ? null : card)
                }
                disabled={!hasJoined}
                className={`w-12 h-16 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all duration-200
                            ${
                              selectedCard === card
                                ? 'bg-blue-500 border-blue-400 text-white -translate-y-4 shadow-lg shadow-blue-500/30'
                                : 'bg-[#1F2937] border-blue-500/50 text-blue-400 hover:border-blue-400 hover:-translate-y-2'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-blue-500/50
                        `}
              >
                {card}
              </button>
            ))}
          </div>
        </>
      )}
    </footer>
  )
}
