export interface Player {
  id: string
  name: string
  role: 'player' | 'spectator'
  vote: string | null
  status: 'online' | 'offline'
}

export interface GameState {
  isRevealed: boolean
  status: 'voting' | 'revealed'
}
