'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createDocument } from '@/lib/firestore'
import EmojiPicker, { Theme } from 'emoji-picker-react'

// Custom combined logo (approximate)
const Logo = () => (
  <div className="relative w-8 h-8 flex items-center justify-center text-blue-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8"
    >
      <path
        d="M12,2C9,7,2,9,2,14c0,3.31,2.69,6,6,6c0,0,1.5,0,2,2c0.5-2,2-2,2-2c3.31,0,6-2.69,6-6C18,9,15,7,12,2z M12,14 c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,14,12,14z"
        fill="#3B82F6"
      />
      {/* Rocket shape inside is tricky, simplifying to just the spade with a cutout or accent */}
      <circle cx="12" cy="12" r="3" fill="#1e293b" />
      <path d="M12 10l-1 2h2z" fill="#3B82F6" />
    </svg>
    {/* Rocket icon overlay */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    </div>
  </div>
)

const SmileyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm6 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z"
    />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
)

export default function Home() {
  const router = useRouter()
  const [gameName, setGameName] = useState('')
  const [votingSystem, setVotingSystem] = useState('t-shirts')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gameName.trim()) return

    setIsLoading(true)
    try {
      const newGame = await createDocument('games', {
        name: gameName,
        votingSystem,
        status: 'active',
        createdBy: 'anonymous' // We can improve this later
      })
      router.push(`/game/${newGame.id}`)
    } catch (error) {
      console.error('Error creating game:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1F2937] text-gray-100 font-sans flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl p-8 flex items-center gap-3 self-start">
        <Logo />
        <h1 className="text-xl font-bold text-white tracking-tight">
          Latam Game
        </h1>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-xl px-4 mt-20 flex flex-col gap-8">
        <form onSubmit={handleCreateGame} className="flex flex-col gap-8">
          {/* Game Name Input */}
          <div className="relative group">
            <input
              type="text"
              id="game-name"
              className="block w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 peer placeholder-transparent"
              placeholder="Game's name"
              autoFocus
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              disabled={isLoading}
            />
            <label
              htmlFor="game-name"
              className="absolute left-3 -top-2.5 bg-[#1F2937] px-1 text-sm text-gray-400 transition-all 
              peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 
              peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Game&apos;s name
            </label>
            <div className="absolute inset-y-0 right-4 flex items-center text-gray-400 z-10">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="hover:text-gray-300 transition-colors cursor-pointer focus:outline-none"
              >
                <SmileyIcon className="w-6 h-6" />
              </button>
            </div>

            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute right-0 top-12 z-50 shadow-xl rounded-lg"
              >
                <EmojiPicker
                  onEmojiClick={(emojiObject) => {
                    setGameName(gameName + emojiObject.emoji)
                    setShowEmojiPicker(false)
                  }}
                  theme={Theme.DARK}
                  lazyLoadEmojis={true}
                />
              </div>
            )}
          </div>

          {/* Voting System Select */}
          <div className="relative group">
            <select
              id="voting-system"
              className="block w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 peer cursor-pointer"
              value={votingSystem}
              onChange={(e) => setVotingSystem(e.target.value)}
              disabled={isLoading}
            >
              <option value="t-shirts" className="bg-[#1F2937]">
                T-shirts (XS, S, M, L, XL, ?, ☕)
              </option>
            </select>
            <label
              htmlFor="voting-system"
              className="absolute left-3 -top-2.5 bg-[#1F2937] px-1 text-sm text-gray-400 transition-all peer-focus:text-blue-500"
            >
              Voting system
            </label>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <ChevronDownIcon className="w-5 h-5" />
            </div>
          </div>

          {/* Create Button */}
          <button
            type="submit"
            disabled={isLoading || !gameName.trim()}
            className="w-full bg-[#60A5FA] hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/10 mt-2 flex justify-center items-center"
          >
            {isLoading ? 'Creating...' : 'Create game'}
          </button>
        </form>
      </main>
    </div>
  )
}
