'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Mic } from 'lucide-react';
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

    // Pitch & Voice tuning for two distinct speakers
    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      if (item.speaker.includes('Alex')) {
        // Speaker 1: Male / Standard voice
        const v = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Male') || v.name.includes('Guy'))) || voices[0];
        if (v) utterance.voice = v;
        utterance.pitch = 1.0;
      } else {
        // Speaker 2: Female / Analyst voice
        const v = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Zira') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'))) || voices[voices.length > 1 ? 1 : 0];
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
    <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-gray-900 p-5 rounded-2xl border border-indigo-500/40 shadow-xl space-y-4">
      {/* Header Player Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Audio Discussion &amp; Podcast Briefing
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                2-Speaker Deep Dive
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate max-w-md">
              Host Alex &amp; Lead Analyst Dr. Taylor reviewing findings &amp; critic audit
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeed}
            className="px-2.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-mono border border-gray-800"
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800"
            title="Restart Podcast"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPause}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play Briefing'}</span>
          </button>
        </div>
      </div>

      {/* Transcript Turns Carousel / List */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
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
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                isCurrent
                  ? 'bg-indigo-950/70 border-indigo-400 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-gray-950/50 border-gray-800/60 hover:border-gray-700'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                  isAlex
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                }`}
              >
                {item.avatar}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[11px] font-bold ${isAlex ? 'text-amber-300' : 'text-purple-300'}`}>
                    {item.speaker}
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
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
