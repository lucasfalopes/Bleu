"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Flashcard from "@/components/Flashcard";
import { BookMarked, Search, Trophy, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Carnet() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"bank" | "review">("bank");
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vocabBank, setVocabBank] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const res = await fetch("/api/vocab");
        if (res.ok) {
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedVocab = data.vocabs.map((v: any) => ({
            id: v.id,
            word: v.wordOriginal,
            translation: v.translation,
            context: v.contextSentence,
            masteryLevel: v.masteryLevel,
            nextReviewDate: v.nextReviewDate,
          }));

          setVocabBank(mappedVocab);

          const now = new Date();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dueForReview = mappedVocab.filter((v: any) => new Date(v.nextReviewDate) <= now);
          setReviewQueue(dueForReview.sort(() => Math.random() - 0.5));
        }
      } catch (error) {
        console.error("Failed to fetch vocab:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchVocab();
    }
  }, [status]);

  const handleNextCard = async (delta: number) => {
    const currentCard = reviewQueue[currentCardIndex];

    try {
      await fetch(`/api/vocab/${currentCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masteryDelta: delta }),
      });
      // In a real app, update vocabBank state here too for consistency
    } catch (error) {
      console.error("Failed to update mastery:", error);
    }

    setTimeout(() => {
      if (currentCardIndex < reviewQueue.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        setReviewQueue([]);
      }
    }, 300);
  };

  const filteredVocab = vocabBank.filter(v =>
    v.word.toLowerCase().includes(search.toLowerCase()) ||
    v.translation.toLowerCase().includes(search.toLowerCase())
  );

  if (status === "loading" || isLoading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="animate-spin text-electric-blue" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookMarked className="text-electric-blue" /> Le Carnet
          </h1>
          <p className="text-gray-500">Your personal vocabulary bank</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("bank")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'bank' ? 'bg-white dark:bg-dark-card shadow-sm text-electric-blue' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Word Bank
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'review' ? 'bg-electric-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Review <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{reviewQueue.length}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "bank" ? (
          <motion.div
            key="bank"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search words or translations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVocab.map((v) => (
                <div key={v.id} className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:scale-[1.02] transition-transform">
                  <div>
                    <h3 className="font-bold text-lg text-electric-blue">{v.word}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{v.translation}</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(level => (
                      <div
                        key={level}
                        className={`w-2 h-6 rounded-full ${level <= v.masteryLevel ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {filteredVocab.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No vocabulary words found. Start a conversation in Le Salon to flag words!
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-[50vh]"
          >
            {reviewQueue.length > 0 ? (
              <div className="w-full max-w-sm">
                <div className="flex justify-between text-sm text-gray-500 font-medium mb-6 px-4">
                  <span>Reviewing</span>
                  <span>{currentCardIndex + 1} / {reviewQueue.length}</span>
                </div>

                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={reviewQueue[currentCardIndex].id}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <Flashcard
                      word={reviewQueue[currentCardIndex]}
                      onNext={handleNextCard}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center bg-white dark:bg-dark-card p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">You&apos;re all caught up!</h2>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">You&apos;ve reviewed all your due flashcards. Check back later or learn new words in Le Salon.</p>
                <button
                  onClick={() => setActiveTab("bank")}
                  className="px-8 py-3 bg-electric-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Return to Word Bank
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
