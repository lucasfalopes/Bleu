"use client";

import { motion } from "framer-motion";
import { Award, Flame, Star, Trophy } from "lucide-react";

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:scale-[1.02] transition-transform">
          <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
            <Flame className="text-orange-500" size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Daily Streak</p>
            <p className="text-2xl font-bold">14 Days</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:scale-[1.02] transition-transform">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Star className="text-electric-blue" size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total XP</p>
            <p className="text-2xl font-bold">4,250</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:scale-[1.02] transition-transform">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Trophy className="text-purple-500" size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Level</p>
            <p className="text-2xl font-bold">Intermediate 2</p>
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="mt-8 bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="text-electric-blue" />
          Awards Vault
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["7-Day Fire", "Vocab Master", "First Lesson", "Perfect Score"].map((badge, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="w-16 h-16 bg-soft-sky-blue dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-2">
                <Award size={28} className="text-electric-blue" />
              </div>
              <span className="text-sm font-medium text-center">{badge}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
