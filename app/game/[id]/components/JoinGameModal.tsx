import { SmileyIcon } from './Icons'

interface JoinGameModalProps {
  displayName: string
  setDisplayName: (name: string) => void
  isSpectator: boolean
  setIsSpectator: (isSpectator: boolean) => void
  handleJoinGame: () => void
  isLoading: boolean
  tShirtCards: string[]
}

export default function JoinGameModal({
  displayName,
  setDisplayName,
  isSpectator,
  setIsSpectator,
  handleJoinGame,
  isLoading,
  tShirtCards
}: JoinGameModalProps) {
  return (
    <div className="absolute inset-0 z-50 bg-[#1F2937]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      {/* Background Cards (Visual flair - subtle in background of modal) */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 opacity-10 pointer-events-none">
        {tShirtCards.map((card, index) => (
          <div
            key={index}
            className="w-16 h-24 border-2 border-blue-500/30 rounded-lg flex items-center justify-center text-xl font-bold text-blue-400"
          >
            {card}
          </div>
        ))}
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#2D3748] rounded-xl shadow-2xl p-8 border border-gray-700">
        {/* Header */}
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Choose your display name
        </h2>

        {/* Form */}
        <div className="flex flex-col gap-6">
          {/* Display Name Input */}
          <div className="relative group">
            <input
              type="text"
              id="display-name"
              className="block w-full px-4 py-3 bg-transparent border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 peer placeholder-transparent"
              placeholder="Your display name"
              autoFocus
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
            />
            <label
              htmlFor="display-name"
              className="absolute left-3 -top-2.5 bg-[#2D3748] px-1 text-sm text-gray-400 transition-all 
              peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 
              peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Your display name
            </label>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <SmileyIcon className="w-6 h-6 hover:text-gray-300 transition-colors cursor-pointer pointer-events-auto" />
            </div>
          </div>

          {/* Join as Spectator Toggle */}
          <div className="flex items-center justify-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isSpectator}
                onChange={(e) => setIsSpectator(e.target.checked)}
                disabled={isLoading}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-300">
                Join as spectator
              </span>
            </label>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleJoinGame}
            disabled={!displayName.trim() || isLoading}
            className="w-full bg-[#60A5FA] hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/10 mt-2 flex justify-center items-center"
          >
            {isLoading ? 'Joining...' : 'Continue to game'}
          </button>

          {/* Footer Links */}
          <div className="flex justify-between mt-2 px-2">
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
            >
              Login
            </a>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
