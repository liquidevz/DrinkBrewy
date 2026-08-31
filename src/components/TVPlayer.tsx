"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { VideoPlayer } from "@/components/ui/video-player"

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

function formatElapsed(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":")
}

export default function TVPlayer({
  channels = DEFAULT_CHANNELS,
  defaultChannelIndex = 0,
  onChannelChange,
  className = "",
}: TVPlayerProps) {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(defaultChannelIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const currentChannel = channels[currentChannelIndex]

  const handleChannelChange = useCallback(
    (newIndex: number) => {
      setCurrentChannelIndex(newIndex)
      setElapsedSeconds(0)
      onChannelChange?.(channels[newIndex], newIndex)
    },
    [channels, onChannelChange],
  )

  const handleSkipForward = useCallback(() => {
    handleChannelChange((currentChannelIndex + 1) % channels.length)
  }, [currentChannelIndex, channels.length, handleChannelChange])

  const handleSkipBack = useCallback(() => {
    handleChannelChange((currentChannelIndex - 1 + channels.length) % channels.length)
  }, [currentChannelIndex, channels.length, handleChannelChange])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, currentChannelIndex])

  return (
    <div className={`w-full max-w-3xl mx-auto px-2 sm:px-4 ${className}`}>
      <VideoPlayer
        status={isPlaying ? "playing" : "paused"}
        currentTime={formatElapsed(elapsedSeconds)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
      >
        {isPlaying ? (
          <iframe
            key={`${currentChannel.videoId}-${currentChannelIndex}`}
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${currentChannel.videoId}?autoplay=1&controls=0&modestbranding=1&fs=0&rel=0`}
            title={currentChannel.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-black">
            <div className="mb-2 font-mono text-2xl font-bold tracking-wider text-white sm:text-3xl">
              BREWY TV
            </div>
            <div className="font-mono text-xs text-white/75 sm:text-sm">
              ▌ ▌ ▌ PAUSED ▌ ▌ ▌
            </div>
          </div>
        )}
      </VideoPlayer>

      {/* Channel List */}
      <div className="mt-6 sm:mt-8 md:mt-10 bg-black rounded-lg p-3 sm:p-4 md:p-6 border-2 border-white border-opacity-30 backdrop-blur-sm">
        <h2 className="text-white font-bold mb-3 sm:mb-4 text-xs sm:text-sm md:text-base font-mono">
          📺 Available Channels:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {channels.map((channel, idx) => (
            <button
              key={channel.id}
              onClick={() => handleChannelChange(idx)}
              className={`text-xs sm:text-sm p-2 sm:p-3 rounded transition-all duration-200 font-mono font-bold cursor-pointer hover:scale-105 active:scale-95 ${
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
