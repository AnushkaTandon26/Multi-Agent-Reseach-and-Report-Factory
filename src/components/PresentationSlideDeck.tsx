'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Presentation, CheckCircle2, Download, Play, Pause } from 'lucide-react';
import { SlideItem } from '../lib/types';

interface PresentationSlideDeckProps {
  isOpen: boolean;
  onClose: () => void;
  slides?: SlideItem[];
  topic: string;
}

export const PresentationSlideDeck: React.FC<PresentationSlideDeckProps> = ({
  isOpen,
  onClose,
  slides = [],
  topic,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev + 1 < slides.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  // Autoplay timer
  useEffect(() => {
    let timer: any;
    if (isAutoPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => {
          if (prev + 1 < slides.length) return prev + 1;
          setIsAutoPlaying(false);
          return prev;
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, isOpen, slides.length]);

  if (!isOpen || slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 via-[#0B1020] to-gray-900 border border-gray-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] min-h-[500px] relative overflow-hidden text-gray-100">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-800 bg-[#0C1222]/80 px-6 py-4 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Autonomous Executive Deck
              </span>
              <span className="text-xs font-bold text-gray-200 truncate max-w-sm block">
                {topic}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Slide Index Badge */}
            <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800/50 font-semibold">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>

            {/* Autoplay Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 transition-colors"
              title={isAutoPlaying ? 'Pause Autoplay' : 'Autoplay Slides (5s)'}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Main Slide Body (Scrollable if tall content) */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 relative z-10 flex flex-col justify-center space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="text-sm font-mono text-indigo-400">
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* Bullet Points */}
          <ul className="space-y-2.5">
            {currentSlide.bulletPoints.map((bp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm text-gray-200 leading-relaxed bg-gray-950/50 p-3 rounded-2xl border border-gray-800/80"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{bp}</span>
              </li>
            ))}
          </ul>

          {/* Key Strategic Takeaway Banner */}
          {currentSlide.takeaway && (
            <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-800/60 flex items-center justify-between text-xs sm:text-sm text-indigo-200 shadow-inner">
              <span className="font-bold text-indigo-300 shrink-0 mr-2">💡 Key Takeaway:</span>
              <span className="truncate sm:whitespace-normal">{currentSlide.takeaway}</span>
            </div>
          )}
        </div>

        {/* Bottom Persistent Navigation Controls Bar */}
        <div className="flex items-center justify-between border-t border-gray-800 bg-[#0C1222]/90 px-6 py-3.5 shrink-0 relative z-20">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-semibold text-gray-200 border border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Interactive Slide Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlideIndex === idx
                    ? 'bg-purple-500 w-8 shadow-sm shadow-purple-500/50'
                    : 'bg-gray-700 hover:bg-gray-500 w-2.5'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <span>{currentSlideIndex === slides.length - 1 ? 'End' : 'Next Slide'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
