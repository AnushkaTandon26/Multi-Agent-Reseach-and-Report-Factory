'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Presentation, CheckCircle2, Play, Pause } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white border border-[#E5E7EB] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] min-h-[500px] relative overflow-hidden text-[#14181F]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] flex items-center justify-center text-[#A855F7]">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block font-semibold">
                Autonomous Executive Deck
              </span>
              <span className="text-xs font-bold text-[#14181F] truncate max-w-sm block">
                {topic}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#581C87] bg-[#EAD5FF] px-3 py-1 rounded-full font-bold border border-[#D8B4FE]">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1.5 rounded-full text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F2F4] border border-[#D1D5DB] transition-colors"
              title={isAutoPlaying ? 'Pause Autoplay' : 'Autoplay Slides (5s)'}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Main Slide Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 relative z-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14181F] tracking-tight leading-tight">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="text-sm font-semibold text-[#2563EB]">
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* Bullet Points */}
          <ul className="space-y-3">
            {currentSlide.bulletPoints.map((bp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm text-[#334155] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E5E7EB]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>{bp}</span>
              </li>
            ))}
          </ul>

          {/* Key Strategic Takeaway Banner */}
          {currentSlide.takeaway && (
            <div className="bg-[#EFF6FF] p-4 rounded-2xl border border-[#BFDBFE] flex items-center justify-between text-xs sm:text-sm text-[#1E3A8A]">
              <span className="font-bold text-[#1D4ED8] shrink-0 mr-2">💡 Key Takeaway:</span>
              <span>{currentSlide.takeaway}</span>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-white px-6 py-4 shrink-0 relative z-20">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1.5 h-[38px] px-4 rounded-full bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#14181F] border border-[#D1D5DB] disabled:opacity-40 transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Slide Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  currentSlideIndex === idx
                    ? 'bg-[#151A17] w-7'
                    : 'bg-[#D1D5DB] hover:bg-[#9CA3AF] w-2.5'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="flex items-center gap-1.5 h-[38px] px-5 rounded-full bg-[#151A17] hover:bg-[#262E29] text-xs font-bold text-white shadow-xs disabled:opacity-40 transition-all active:scale-95"
          >
            <span>{currentSlideIndex === slides.length - 1 ? 'End' : 'Next Slide'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
