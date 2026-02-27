import {
  LogoSmall,
  TimerIcon,
  SignOutIcon,
  InviteIcon,
  SidebarIcon
} from './Icons'

interface HeaderProps {
  hasJoined: boolean
  displayName: string
  displayGameName: string
  isProfileOpen: boolean
  setIsProfileOpen: (isOpen: boolean) => void
  handleSignOut: () => void
}

export default function Header({
  hasJoined,
  displayName,
  displayGameName,
  isProfileOpen,
  setIsProfileOpen,
  handleSignOut
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-[#1F2937]">
      <div className="flex items-center gap-2">
        <LogoSmall />
        <span className="font-bold text-lg text-white">{displayGameName}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-blue-400 hover:text-blue-300 cursor-pointer">
          <TimerIcon className="w-6 h-6" />
        </div>

        {hasJoined && (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 px-2 py-1 rounded-md transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-white">
                {displayName}
              </span>
              <span className="text-gray-400 text-xs">v</span>
            </div>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1F2937] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm"
                  >
                    <SignOutIcon className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors text-sm font-semibold">
          <InviteIcon className="w-4 h-4" />
          Invite players
        </button>

        <div className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer text-blue-400">
          <SidebarIcon className="w-5 h-5" />
        </div>
      </div>
    </header>
  )
}
