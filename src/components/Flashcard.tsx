"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, RefreshCw, Volume2 } from "lucide-react";

export type VocabWord = {
  id: string;
  word: string;
  translation: string;
  context: string;
  masteryLevel: number; // 0-3
};

export default function Flashcard({
  word,
  onNext
}: {
  word: VocabWord;
  onNext: (masteryDelta: number) => void
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => setIsFlipped(!isFlipped);

  const speakWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto perspective-1000">
      <motion.div
        className="relative w-full aspect-[3/4] preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        onClick={flipCard}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-dark-card rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center p-8">
          <div className="absolute top-4 right-4 text-gray-400">
            <BookOpen size={20} />
          </div>
          <button
            onClick={speakWord}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-electric-blue transition-colors rounded-full"
          >
            <Volume2 size={24} />
          </button>

          <h2 className="text-4xl font-bold mb-4 text-electric-blue text-center">{word.word}</h2>

          <p className="text-gray-400 text-sm flex items-center gap-2 absolute bottom-6">
            <RefreshCw size={14} /> Tap to flip
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-soft-sky-blue to-white dark:from-blue-900/40 dark:to-dark-card rounded-3xl shadow-xl border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center p-8 text-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <h3 className="text-2xl font-bold mb-6">{word.translation}</h3>

          <div className="w-full bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl text-sm italic text-gray-600 dark:text-gray-300 mb-8 border border-white/20 dark:border-gray-700/50 shadow-inner">
            &quot;{word.context}&quot;
          </div>

          <div className="w-full grid grid-cols-3 gap-2 absolute bottom-6 px-6">
            <button
              onClick={(e) => { e.stopPropagation(); onNext(-1); setIsFlipped(false); }}
              className="py-2.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Hard
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(0); setIsFlipped(false); }}
              className="py-2.5 bg-blue-100 text-electric-blue dark:bg-blue-900/30 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Good
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(1); setIsFlipped(false); }}
              className="py-2.5 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              Easy
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
