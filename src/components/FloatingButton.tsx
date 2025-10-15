"use client";

export default function FloatingButton() {
  return (
    <button
      className="floating-button h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-r from-orange-400 to-red-500 shadow-2xl hover:shadow-xl hover:scale-110 flex items-center justify-center text-white"
      onClick={() => window.open('https://shop.drinkbrewy.com', '_blank')}
    >
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7" />
      </svg>
    </button>
  );
}