import React from "react";
import { BrewyLogo } from "@/components/BrewyLogo";

export default function ComingSoon() {
  const animationDelays = {
    background: "1s",
    text1: "0.2s",
    text2: "0.4s",
    subtitle: "0.6s",
    dots: "0.8s",
    dot1: "0.1s",
    dot2: "0.2s",
    button: "1s",
    social: "1.2s",
    float1: "2s",
    float2: "2.5s",
    float3: "3s"
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-200 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
        <div 
          className="absolute -bottom-10 -left-10 w-80 h-80 bg-sky-400 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: animationDelays.background }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <div className="mb-8 animate-bounce">
          <BrewyLogo className="h-24 md:h-32 text-sky-800" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-sky-900 mb-6 tracking-tight">
          <span className="block animate-fade-in-up">Something</span>
          <span 
            className="block animate-fade-in-up text-orange-600" 
            style={{ animationDelay: animationDelays.text1 }}
          >
            Fizztastic
          </span>
          <span 
            className="block animate-fade-in-up" 
            style={{ animationDelay: animationDelays.text2 }}
          >
            is Brewing
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className="text-lg md:text-xl lg:text-2xl text-sky-800 mb-8 max-w-2xl leading-relaxed animate-fade-in-up" 
          style={{ animationDelay: animationDelays.subtitle }}
        >
          We&apos;re crafting an extraordinary experience that will refresh your world. 
          Get ready for the ultimate fizzy adventure!
        </p>

        {/* Animated Dots */}
        <div 
          className="flex space-x-2 mb-12 animate-fade-in-up" 
          style={{ animationDelay: animationDelays.dots }}
        >
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
          <div 
            className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" 
            style={{ animationDelay: animationDelays.dot1 }}
          ></div>
          <div 
            className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" 
            style={{ animationDelay: animationDelays.dot2 }}
          ></div>
        </div>

        {/* Notify Button */}
        <div 
          className="animate-fade-in-up" 
          style={{ animationDelay: animationDelays.button }}
        >
          <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-orange-600 rounded-xl hover:bg-orange-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg hover:shadow-xl">
            <span className="relative z-10">Notify Me When Ready</span>
            <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 bg-white rounded-xl group-hover:scale-110 opacity-20"></div>
          </button>
        </div>

        {/* Social Links */}
        <div 
          className="mt-12 animate-fade-in-up" 
          style={{ animationDelay: animationDelays.social }}
        >
          <p className="text-sky-700 text-sm mb-4">Follow us for updates</p>
          <div className="flex space-x-6">
            <a href="#" className="text-sky-600 hover:text-orange-600 transition-colors duration-200 transform hover:scale-110">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="#" className="text-sky-600 hover:text-orange-600 transition-colors duration-200 transform hover:scale-110">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="#" className="text-sky-600 hover:text-orange-600 transition-colors duration-200 transform hover:scale-110">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.744 2.854c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div 
        className="absolute top-20 right-20 animate-bounce" 
        style={{ animationDelay: animationDelays.float1 }}
      >
        <div className="w-4 h-4 bg-orange-400 rounded-full opacity-60"></div>
      </div>
      <div 
        className="absolute bottom-20 left-20 animate-bounce" 
        style={{ animationDelay: animationDelays.float2 }}
      >
        <div className="w-6 h-6 bg-sky-400 rounded-full opacity-60"></div>
      </div>
      <div 
        className="absolute top-1/3 right-10 animate-bounce" 
        style={{ animationDelay: animationDelays.float3 }}
      >
        <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80"></div>
      </div>
    </div>
  );
}