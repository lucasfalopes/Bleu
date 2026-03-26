"use client";

import { motion } from "framer-motion";
import { Search, UserPlus, Flame, Star } from "lucide-react";

export default function Friends() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Social & Friends</h1>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-electric-blue"
          />
        </div>
        <button className="px-6 py-3 bg-electric-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20">
          <UserPlus size={20} />
          <span className="hidden sm:inline">Find Friends</span>
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold flex items-center gap-2">Leaderboard (This Week)</h2>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[
            { rank: 1, name: "Sophie Martin", xp: 1250, streak: 45, me: false },
            { rank: 2, name: "Lucas Dubois", xp: 1120, streak: 21, me: false },
            { rank: 3, name: "You", xp: 850, streak: 14, me: true },
            { rank: 4, name: "Emma Bernard", xp: 640, streak: 7, me: false },
          ].map((user) => (
            <motion.div
              variants={item}
              key={user.rank}
              className={`p-4 sm:p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${user.me ? 'bg-soft-sky-blue/30 dark:bg-blue-900/10' : ''}`}
            >
              <div className="w-8 font-bold text-gray-400 text-lg">#{user.rank}</div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-lg flex items-center gap-2">
                  {user.name}
                  {user.me && <span className="text-xs bg-electric-blue text-white px-2 py-0.5 rounded-full">Me</span>}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <Flame className="text-orange-500" size={18} />
                  <span className="font-medium text-gray-600 dark:text-gray-300">{user.streak}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="text-electric-blue" size={18} />
                  <span className="font-bold">{user.xp} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
