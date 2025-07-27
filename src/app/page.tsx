import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon - Fizzi",
  description: "Something amazing is coming soon. Stay tuned!",
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500">
      <div className="text-center space-y-8 p-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            Something amazing is brewing...
          </p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
          <p className="text-lg text-white mb-6">
            We're working hard to bring you something incredible. Stay tuned for updates!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email for updates"
              className="px-6 py-3 rounded-full text-gray-800 placeholder-gray-500 border-0 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 flex-1 min-w-0 max-w-sm"
            />
            <button className="px-8 py-3 bg-white text-orange-500 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform">
              Notify Me
            </button>
          </div>
        </div>
        
        <div className="text-white/80">
          <p className="text-sm">Follow us for updates:</p>
          <div className="flex justify-center space-x-6 mt-3">
            <a href="#" className="hover:text-white transition-colors duration-300">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
