"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'; // Fun icons
import videosData from "@/data/videos.json"; // Your video data
import { BrewyLogo } from "./BrewyLogo";

// --- Main TV Component ---
const BrewyTV = () => {
  return (
    <div className="bg-gradient-to-b from-[#C41E3A] to-[#A3182F] py-12 md:py-20 overflow-hidden px-64">
      <div className="text-center mb-8 mx-auto">
         <BrewyLogo className="z-10 h-20 cursor-pointer text-sky-800" />
        <p className="text-white/80 text-lg mt-2">Your Daily Dose of Fun!</p>
      </div>
      <HorizontalTVScroller />
    </div>
  );
};

// --- Horizontal TV Scroller ---
const HorizontalTVScroller = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev === videosData.length - 1 ? 0 : prev + 1));
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev === 0 ? videosData.length - 1 : prev - 1));
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* TV Frame and Screen */}
      <div className="relative w-full max-w-sm md:max-w-4xl z-10">
        <Image 
          src="/labels/tv.png" 
          alt="TV Frame" 
          width={800}
          height={600}
          className="w-full h-auto pointer-events-none" // Make image non-interactive
        />
        <div className="absolute top-[0.6%] left-[0.4%] w-[99.2%] h-[88.3%] overflow-hidden bg-black rounded-sm">
          {/* Video Content */}
          <motion.div 
            className="flex h-full"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          >
            {videosData.map((video) => (
              <VideoPlayer key={video.id} video={video} />
            ))}
          </motion.div>
          {/* Funky TV Brand */}
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full text-black text-xs font-bold z-20 shadow-lg">
            BREWY
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between w-full max-w-lg md:max-w-5xl mt-4 px-4 absolute top-1/2 -translate-y-1/2">
        <button 
          onClick={prevVideo}
          className="w-12 h-12 bg-white/90 text-gray-800 rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
          aria-label="Previous Video"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={nextVideo}
          className="w-12 h-12 bg-white/90 text-gray-800 rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
          aria-label="Next Video"
        >
          <ChevronRight size={28} />
        </button>
      </div>
      
      {/* Channel Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {videosData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-yellow-400 scale-125' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- Video Player Screen ---
const VideoPlayer = ({ video }: { video: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-w-full h-full flex-shrink-0 relative group">
      {isPlaying ? (
        <div className="relative w-full h-full">
          <iframe
            src={`${video.embedUrl}?autoplay=0&controls=1`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-2 right-2 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all z-10"
            aria-label="Close video"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={800}
            height={600}
            className="w-full h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30"
              whileHover={{ scale: 1.15, rotate: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Play size={32} className="text-white ml-1" fill="white" />
            </motion.div>
          </div>
          
          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{video.title}</h3>
            <p className="text-white/80 text-sm">Click to Play</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrewyTV;
