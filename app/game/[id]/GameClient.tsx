'use client'

import React, { useState, useEffect } from 'react'
import {
  createDocument,
  updateDocument,
  setDocument,
  deleteDocument
} from '@/lib/firestore'
import { collection, onSnapshot, query, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Player, GameState } from './types'
import JoinGameModal from './components/JoinGameModal'
import Header from './components/Header'
import PlayerCard from './components/PlayerCard'
import TableArea from './components/TableArea'
import Footer from './components/Footer'

export default function GameClient({ gameId }: { gameId: string }) {
  const [displayName, setDisplayName] = useState('')
  const [isSpectator, setIsSpectator] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Local state for the current user's selection (optimistic update)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  // Mock cards for T-shirt sizing
  const tShirtCards = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕']

  const [gameState, setGameState] = useState<GameState>({
    isRevealed: false,
    status: 'voting'
  })

  // Restore session
  useEffect(() => {
    const savedId = localStorage.getItem(`poker_session_${gameId}`)
    if (savedId) {
      setCurrentUserId(savedId)
    }
  }, [gameId])

  // Sync state when players load and we have a currentUserId
  useEffect(() => {
    if (currentUserId && players.length > 0 && !hasJoined) {
      const player = players.find((p) => p.id === currentUserId)
      if (player) {
        setHasJoined(true)
        setDisplayName(player.name)
        setIsSpectator(player.role === 'spectator')
      }
    }
  }, [currentUserId, players, hasJoined])

  // Listen to Game State
  useEffect(() => {
    if (!gameId) return
    const unsub = onSnapshot(doc(db, 'games', gameId), (doc) => {
      if (doc.exists()) {
        setGameState(doc.data() as GameState)
      }
    })
    return () => unsub()
  }, [gameId])

  // Subscribe to players collection
  useEffect(() => {
    if (!gameId) return

    const q = query(collection(db, `games/${gameId}/players`))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const playersData: Player[] = []
      snapshot.forEach((doc) => {
        playersData.push({ id: doc.id, ...doc.data() } as Player)
      })
      setPlayers(playersData)
    })

    return () => unsubscribe()
  }, [gameId])

  // Sync selected card from Firestore if updated externally (or initial load)
  useEffect(() => {
    if (currentUserId && players.length > 0) {
      const me = players.find((p) => p.id === currentUserId)
      if (me) {
        setSelectedCard(me.vote)
      }
    }
  }, [players, currentUserId])

  const handleJoinGame = async () => {
    if (!displayName.trim()) return

    setIsLoading(true)
    try {
      // Ensure game exists
      await setDocument(
        'games',
        gameId,
        { status: 'voting', isRevealed: false },
        true
      )

      // Create a new player document in the subcollection
      const newPlayer = await createDocument(`games/${gameId}/players`, {
        name: displayName,
        role: isSpectator ? 'spectator' : 'player',
        vote: null,
        status: 'online'
      })

      setCurrentUserId(newPlayer.id)
      setHasJoined(true)
      localStorage.setItem(`poker_session_${gameId}`, newPlayer.id)
    } catch (error) {
      console.error('Error joining game:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReveal = async () => {
    try {
      const newState = !gameState.isRevealed

      if (newState === false) {
        // Starting new vote: Clear all votes
        const resetPromises = players.map((p) =>
          updateDocument(`games/${gameId}/players`, p.id, { vote: null })
        )
        await Promise.all(resetPromises)
        setSelectedCard(null)
      }

      await setDocument(
        'games',
        gameId,
        {
          isRevealed: newState,
          status: newState ? 'revealed' : 'voting'
        },
        true
      )
    } catch (error) {
      console.error('Error toggling reveal:', error)
    }
  }

  const handleSelectCard = async (card: string | null) => {
    if (!currentUserId) return
    if (gameState.isRevealed) return // Prevent changing vote after reveal

    // Optimistic update
    setSelectedCard(card)

    try {
      await updateDocument(`games/${gameId}/players`, currentUserId, {
        vote: card
      })
    } catch (error) {
      console.error('Error updating vote:', error)
    }
  }

  const handleSignOut = async () => {
    if (!currentUserId) return

    try {
      localStorage.removeItem(`poker_session_${gameId}`)
      await deleteDocument(`games/${gameId}/players`, currentUserId)

      setCurrentUserId(null)
      setHasJoined(false)
      setDisplayName('')
      setSelectedCard(null)
      setIsProfileOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleDeactivateSpectator = async () => {
    if (!currentUserId) return
    try {
      await updateDocument(`games/${gameId}/players`, currentUserId, {
        role: 'player'
      })
      setIsSpectator(false)
    } catch (error) {
      console.error('Error deactivating spectator mode:', error)
    }
  }

  // Separate players into "me" and "others"
  const me = players.find((p) => p.id === currentUserId)
  const otherPlayers = players.filter((p) => p.id !== currentUserId)
  const isSpectatorMode = me?.role === 'spectator'

  // Construct current player object for display
  const currentPlayerForDisplay: Player = {
    id: currentUserId || 'temp',
    name: displayName,
    role: isSpectatorMode ? 'spectator' : 'player',
    vote: selectedCard,
    status: 'online'
  }

  return (
    <div className="min-h-screen bg-[#1F2937] text-gray-100 font-sans flex flex-col relative overflow-hidden">
      {/* Join Modal Overlay */}
      {!hasJoined && (
        <JoinGameModal
          displayName={displayName}
          setDisplayName={setDisplayName}
          isSpectator={isSpectator}
          setIsSpectator={setIsSpectator}
          handleJoinGame={handleJoinGame}
          isLoading={isLoading}
          tShirtCards={tShirtCards}
        />
      )}

      <Header
        hasJoined={hasJoined}
        displayName={displayName}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        handleSignOut={handleSignOut}
      />

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full gap-12 py-8">
        {/* Invite Prompt */}
        {otherPlayers.length === 0 && (
          <div className="absolute top-10 flex flex-col items-center gap-1">
            <span className="text-gray-400 text-sm">Feeling lonely? 😪</span>
            <button className="text-blue-400 font-medium text-sm hover:underline">
              Invite players
            </button>
          </div>
        )}

        {/* Other Players (Top Area) */}
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          {otherPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} gameState={gameState} />
          ))}
        </div>

        <TableArea
          gameState={gameState}
          selectedCard={selectedCard}
          otherPlayers={otherPlayers}
          hasJoined={hasJoined}
          handleReveal={handleReveal}
        />

        {/* Current Player (Bottom Area) */}
        <PlayerCard
          player={currentPlayerForDisplay}
          gameState={gameState}
          isCurrentUser={true}
        />
      </main>

      <Footer
        isSpectatorMode={isSpectatorMode}
        tShirtCards={tShirtCards}
        selectedCard={selectedCard}
        handleSelectCard={handleSelectCard}
        hasJoined={hasJoined}
        handleDeactivateSpectator={handleDeactivateSpectator}
      />
    </div>
  )
}
