"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle, Lock, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const units = [
    {
      title: "Unit 1: Basics",
      description: "Introduce yourself, order coffee",
      lessons: [
        { id: "unit1-lesson1", type: "grammar", title: "Greetings", completed: false },
        { id: "unit1-lesson2", type: "vocab", title: "Cafe items", completed: false },
        { id: "unit1-test", type: "test", title: "Unit Test 1", completed: false },
      ]
    },
    {
      title: "Unit 2: Getting Around",
      description: "Ask for directions, take the metro",
      lessons: [
        { id: "unit2-lesson1", type: "grammar", title: "Directions", completed: false },
        { id: "unit2-lesson2", type: "vocab", title: "Transportation", completed: false },
        { id: "unit2-test", type: "test", title: "Unit Test 2", completed: false },
      ],
      locked: true
    }
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-12 flex items-center justify-between sticky top-20 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold">Curriculum</h1>
          <p className="text-gray-500">Path to Fluency</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
            <span className="text-xl">🔥</span> 14
          </div>
          <div className="flex items-center gap-1.5 font-bold text-electric-blue bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
            <Star size={18} fill="currentColor" /> 4.2k
          </div>
        </div>
      </div>

      <div className="space-y-16 relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 bg-gray-100 dark:bg-gray-800 -z-10 rounded-full" />

        {units.map((unit, i) => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            key={i}
            className={`relative ${unit.locked ? 'opacity-60 grayscale' : ''}`}
          >
            <div className="bg-electric-blue text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20 mb-8 max-w-sm mx-auto text-center relative z-10 hover:scale-105 transition-transform cursor-pointer">
              <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                {unit.title}
                {unit.locked && <Lock size={16} />}
              </h2>
              <p className="text-blue-100 text-sm">{unit.description}</p>
            </div>

            <div className="flex flex-col items-center gap-8 relative z-10">
              {unit.lessons.map((lesson, j) => {
                const isTest = lesson.type === 'test';
                const isCompleted = lesson.completed;
                const isCurrent = !isCompleted && !unit.locked && j === unit.lessons.findIndex(l => !l.completed);

                return (
                  <Link href={`/lesson/${lesson.id}`} key={j} className={unit.locked ? "pointer-events-none" : ""}>
                    <motion.div
                      whileHover={!unit.locked ? { scale: 1.1 } : {}}
                      whileTap={!unit.locked ? { scale: 0.95 } : {}}
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center cursor-pointer
                        shadow-md border-4 transition-all duration-300
                        ${isCompleted ? 'bg-green-500 border-green-600 text-white' :
                          isCurrent ? 'bg-electric-blue border-blue-600 text-white shadow-blue-500/40 ring-4 ring-blue-200 dark:ring-blue-900/50' :
                          'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}
                        ${isTest ? 'w-20 h-20 rounded-2xl rotate-45' : ''}
                      `}
                      style={{ marginLeft: j % 2 === 0 ? '-60px' : '60px' }}
                    >
                      <div className={isTest ? '-rotate-45' : ''}>
                        {isCompleted ? <CheckCircle size={isTest ? 32 : 24} /> :
                         isTest ? <TrophyIcon size={32} /> :
                         <BookOpen size={24} />}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TrophyIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
