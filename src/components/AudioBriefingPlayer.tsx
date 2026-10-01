'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Mic, Volume2 } from 'lucide-react';
import { PodcastDialogueItem } from '../lib/types';

interface AudioBriefingPlayerProps {
  dialogue?: PodcastDialogueItem[];
  topic: string;
}

export const AudioBriefingPlayer: React.FC<AudioBriefingPlayerProps> = ({
  dialogue = [],
  topic,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakTurn = (turnIndex: number) => {
    if (!synthRef.current || !dialogue || turnIndex >= dialogue.length) {
      setIsPlaying(false);
      return;
    }

    synthRef.current.cancel();
    const item = dialogue[turnIndex];
    const utterance = new SpeechSynthesisUtterance(item.text);
    utteranceRef.current = utterance;
    utterance.rate = playbackSpeed;

    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      if (item.speaker.includes('Alex')) {
        const v =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('David') || v.name.includes('Male') || v.name.includes('Guy'))
          ) || voices[0];
        if (v) utterance.voice = v;
        utterance.pitch = 1.0;
      } else {
        const v =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Zira') ||
                v.name.includes('Female') ||
                v.name.includes('Samantha') ||
                v.name.includes('Google US English'))
          ) || voices[voices.length > 1 ? 1 : 0];
        if (v) utterance.voice = v;
        utterance.pitch = 1.15;
      }
    }

    utterance.onend = () => {
      if (turnIndex + 1 < dialogue.length) {
        setCurrentTurn(turnIndex + 1);
        speakTurn(turnIndex + 1);
      } else {
        setIsPlaying(false);
        setCurrentTurn(0);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  const handlePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakTurn(currentTurn);
    }
  };

  const handleReset = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);
    setCurrentTurn(0);
  };

  const toggleSpeed = () => {
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (isPlaying) {
      speakTurn(currentTurn);
    }
  };

  if (!dialogue || dialogue.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(16,24,40,0.06)] space-y-4">
      {/* Header Player Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F2F4]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAD5FF] flex items-center justify-center text-[#7C3AED] shadow-xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#14181F] flex items-center gap-1.5">
                AI Audio Podcast &amp; Discussion
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-blue-50 text-blue-700 font-bold border border-blue-200">
                2-Speaker Briefing
              </span>
            </div>
            <p className="text-xs text-[#6B7280] truncate max-w-md">
              Host Alex &amp; Lead Analyst Dr. Taylor reviewing findings &amp; critic audit
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeed}
            className="h-[36px] px-3 rounded-full bg-white hover:bg-[#F8FAFC] text-[#14181F] text-xs font-mono font-semibold border border-[#D1D5DB]"
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={handleReset}
            className="w-[36px] h-[36px] rounded-full bg-white hover:bg-[#F8FAFC] text-[#6B7280] hover:text-[#14181F] flex items-center justify-center border border-[#D1D5DB]"
            title="Restart Podcast"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPause}
            className="flex items-center gap-1.5 h-[36px] px-5 bg-[#151A17] hover:bg-[#262E29] text-white text-xs font-bold rounded-full shadow-xs transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play Briefing'}</span>
          </button>
        </div>
      </div>

      {/* Transcript Turns */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {dialogue.map((item, idx) => {
          const isCurrent = currentTurn === idx && isPlaying;
          const isAlex = item.speaker.includes('Alex');

          return (
            <div
              key={idx}
              onClick={() => {
                setCurrentTurn(idx);
                if (isPlaying) speakTurn(idx);
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                isCurrent
                  ? 'bg-blue-50 border-[#2563EB] shadow-xs'
                  : 'bg-[#F8FAFC] border-[#E5E7EB] hover:border-[#CBD5E1]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                  isAlex
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-purple-100 text-purple-900 border-purple-300'
                }`}
              >
                {item.avatar}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[11px] font-bold ${
                      isAlex ? 'text-amber-900' : 'text-purple-900'
                    }`}
                  >
                    {item.speaker}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
