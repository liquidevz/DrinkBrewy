"use client"

import { useState, useCallback } from "react"
import { ChevronUp, ChevronDown, Power } from "lucide-react"
import Image from "next/image"

export interface TVChannel {
  id: number
  name: string
  videoId: string
}

interface TVPlayerProps {
  channels?: TVChannel[]
  defaultChannelIndex?: number
  onChannelChange?: (channel: TVChannel, index: number) => void
  className?: string
}

const DEFAULT_CHANNELS: TVChannel[] = [
  { id: 1, name: "Music Hits", videoId: "dQw4w9WgXcQ" },
  { id: 2, name: "Chill Vibes", videoId: "jNQXAC9IVRw" },
  { id: 3, name: "Retro Classics", videoId: "ZbZSe6N_BXs" },
  { id: 4, name: "Lofi Hip Hop", videoId: "kffacxfA7g4" },
  { id: 5, name: "Nature Sounds", videoId: "aqz-KE-bpKQ" },
  { id: 6, name: "Synthwave", videoId: "V-_O7gl0DVI" },
]

export default function TVPlayer({
  channels = DEFAULT_CHANNELS,
  defaultChannelIndex = 0,
  onChannelChange,
  className = "",
}: TVPlayerProps) {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(defaultChannelIndex)
  const [isOn, setIsOn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const currentChannel = channels[currentChannelIndex]

  const handleChannelChange = useCallback(
    (newIndex: number) => {
      setCurrentChannelIndex(newIndex)
      setIsLoading(true)
      onChannelChange?.(channels[newIndex], newIndex)
    },
    [channels, onChannelChange],
  )

  const handleChannelUp = useCallback(() => {
    const newIndex = (currentChannelIndex + 1) % channels.length
    handleChannelChange(newIndex)
  }, [currentChannelIndex, channels.length, handleChannelChange])

  const handleChannelDown = useCallback(() => {
    const newIndex = (currentChannelIndex - 1 + channels.length) % channels.length
    handleChannelChange(newIndex)
  }, [currentChannelIndex, channels.length, handleChannelChange])

  const togglePower = useCallback(() => {
    setIsOn((prev) => !prev)
  }, [])

  return (
    <div className={`w-full max-w-6xl mx-auto px-2 sm:px-4 ${className}`}>
      {/* TV Container */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        {/* TV Image Background */}
        <Image
          src="/Brewytv.png"
          alt="Brewy TV"
          fill
          className="object-contain drop-shadow-2xl"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
          style={{ zIndex: 20 }}
        />

        {/* Screen Area - positioned behind the TV image */}
        <div
          className="absolute bg-black overflow-hidden transition-all duration-300"
          style={{
            left: "8%",
            top: "10%",
            right: "24%",
            bottom: "12%",
            borderRadius: "clamp(12px, 1.5vw, 20px)",
            boxShadow: isOn ? "inset 0 0 20px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.6)" : "none",
            overflow: "hidden",
            clipPath: "inset(0 round clamp(12px, 1.5vw, 20px))",
            zIndex: 5,
          }}
        >
          {isOn ? (
            <div className="w-full h-full relative bg-black">
              {isLoading && (
                <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-white text-xs font-mono">Loading...</p>
                  </div>
                </div>
              )}
              <iframe
                key={`${currentChannel.videoId}-${currentChannelIndex}`}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentChannel.videoId}?autoplay=1&controls=0&modestbranding=1&fs=0&rel=0`}
                title={currentChannel.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent"></div>
              </div>
              <div className="text-center z-10">
                <div className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 font-mono tracking-wider">
                  BREWY TV
                </div>
                <div className="text-white text-xs sm:text-sm md:text-base font-mono opacity-75">
                  ▌ ▌ ▌ POWER OFF ▌ ▌ ▌
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Channel Display - positioned at bottom of screen */}
        <div
          className="absolute text-center"
          style={{
            left: "8%",
            top: "calc(10% + 100% - 12% + 8px)",
            right: "24%",
            zIndex: 25,
          }}
        >
          <div className="text-white text-xs sm:text-sm font-mono bg-black bg-opacity-80 py-1 sm:py-2 px-2 rounded border border-white border-opacity-30 transition-all duration-300">
            <span className="text-yellow-300">CH {currentChannelIndex + 1}</span>
            <span className="mx-2 opacity-50">•</span>
            <span>{currentChannel.name}</span>
          </div>
        </div>

        {/* Control Panel - positioned on right side of TV */}
        <div
          className="absolute flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-6"
          style={{
            right: "clamp(3%, 3vw, 6%)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 25,
          }}
        >
          {/* Channel Up Button */}
          <button
            onClick={handleChannelUp}
            disabled={!isOn}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            aria-label="Channel up"
            title="Channel Up"
          >
            <ChevronUp size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Channel Number Display */}
          <div className="text-center py-2 sm:py-3">
            <div className="text-white text-xs font-mono opacity-75">CH</div>
            <div className="text-white text-lg sm:text-xl md:text-2xl font-bold font-mono text-yellow-300">
              {currentChannelIndex + 1}
            </div>
          </div>

          {/* Channel Down Button */}
          <button
            onClick={handleChannelDown}
            disabled={!isOn}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            aria-label="Channel down"
            title="Channel Down"
          >
            <ChevronDown size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Power Button */}
          <div className="mt-2 sm:mt-4">
            <button
              onClick={togglePower}
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 font-bold text-xs sm:text-sm ${
                isOn
                  ? "bg-red-500 border-red-600 text-white hover:bg-red-600 animate-pulse"
                  : "bg-gray-400 border-gray-500 text-white hover:bg-gray-500"
              }`}
              aria-label="Power button"
              title={isOn ? "Turn Off" : "Turn On"}
            >
              <Power size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Channel List Info - Responsive Grid */}
      <div className="mt-6 sm:mt-8 md:mt-10 bg-black rounded-lg p-3 sm:p-4 md:p-6 border-2 border-white border-opacity-30 backdrop-blur-sm">
        <h2 className="text-white font-bold mb-3 sm:mb-4 text-xs sm:text-sm md:text-base font-mono">
          📺 Available Channels:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {channels.map((channel, idx) => (
            <button
              key={channel.id}
              onClick={() => handleChannelChange(idx)}
              disabled={!isOn}
              className={`text-xs sm:text-sm p-2 sm:p-3 rounded transition-all duration-200 font-mono font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
                idx === currentChannelIndex
                  ? "bg-yellow-400 text-black shadow-lg border-2 border-yellow-600"
                  : "bg-white text-black hover:bg-gray-100 border border-white border-opacity-50"
              }`}
              title={channel.name}
            >
              <div className="text-xs opacity-75">CH</div>
              <div>{channel.id}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Controls Info */}
      <div className="mt-4 sm:mt-6 text-center text-white text-xs sm:text-sm font-mono opacity-60">
        <p>💡 Tip: Use arrow keys to change channels (coming soon)</p>
      </div>
    </div>
  )
}