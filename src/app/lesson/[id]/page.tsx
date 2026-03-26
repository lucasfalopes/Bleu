"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const MOCK_LESSON = {
  id: "unit1-lesson1",
  title: "Greetings",
  exercises: [
    {
      type: "multiple-choice",
      question: "How do you say 'Hello'?",
      options: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
      correctAnswer: "Bonjour"
    },
    {
      type: "order-sentence",
      question: "Translate: 'I am doing well, thank you.'",
      words: ["merci.", "Je", "bien,", "vais"],
      correctOrder: ["Je", "vais", "bien,", "merci."]
    }
  ]
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Lesson({ params }: { params: any }) {
  const router = useRouter();
  const { status } = useSession();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(MOCK_LESSON.exercises[1].words || []);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="animate-spin text-electric-blue" size={32} /></div>;
  }

  const currentExercise = MOCK_LESSON.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === MOCK_LESSON.exercises.length - 1;

  const handleCheck = () => {
    let correct = false;
    if (currentExercise.type === "multiple-choice") {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.type === "order-sentence") {
      correct = JSON.stringify(orderedWords) === JSON.stringify(currentExercise.correctOrder);
    }

    setIsCorrect(correct);
    setIsChecked(true);
  };

  const handleNext = async () => {
    if (isLastExercise) {
      alert("Lesson Complete! +10 XP");
      router.push("/");
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedOption(null);
      setOrderedWords([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAvailableWords((MOCK_LESSON.exercises[currentExerciseIndex + 1] as any).words || []);
      setIsChecked(false);
      setIsCorrect(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[80vh] flex flex-col">
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-8 overflow-hidden">
        <motion.div
          className="bg-green-500 h-3 rounded-full"
          initial={{ width: `${(currentExerciseIndex / MOCK_LESSON.exercises.length) * 100}%` }}
          animate={{ width: `${((currentExerciseIndex + (isChecked ? 1 : 0)) / MOCK_LESSON.exercises.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">{currentExercise.question}</h1>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md"
          >
            {currentExercise.type === "multiple-choice" && (
              <div className="space-y-4">
                {currentExercise.options?.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => !isChecked && setSelectedOption(option)}
                    disabled={isChecked}
                    className={`w-full p-4 rounded-2xl border-2 text-lg font-medium transition-all ${
                      selectedOption === option
                        ? isChecked
                          ? isCorrect
                            ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-blue-50 border-electric-blue text-electric-blue dark:bg-blue-900/30'
                        : isChecked && option === currentExercise.correctAnswer
                          ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-white border-gray-200 dark:bg-dark-card dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentExercise.type === "order-sentence" && (
              <div className="space-y-8 w-full">
                <div className="min-h-[60px] p-4 border-b-2 border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 items-center justify-center">
                  {orderedWords.map((word, i) => (
                    <motion.button
                      layoutId={`word-${word}`}
                      key={word}
                      onClick={() => {
                        if (isChecked) return;
                        setOrderedWords(prev => prev.filter(w => w !== word));
                        setAvailableWords(prev => [...prev, word]);
                      }}
                      className="px-4 py-2 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium shadow-sm hover:border-gray-300"
                    >
                      {word}
                    </motion.button>
                  ))}
                  {orderedWords.length === 0 && <span className="text-gray-400">Tap words to build the sentence</span>}
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {availableWords.map((word, i) => (
                    <motion.button
                      layoutId={`word-${word}`}
                      key={word}
                      onClick={() => {
                        if (isChecked) return;
                        setAvailableWords(prev => prev.filter(w => w !== word));
                        setOrderedWords(prev => [...prev, word]);
                      }}
                      className="px-4 py-2 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium shadow-sm hover:border-gray-300"
                    >
                      {word}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`mt-auto p-6 rounded-3xl transition-colors duration-300 ${
        !isChecked ? 'bg-transparent' :
        isCorrect ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            {isChecked && (
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xl">
                    <CheckCircle size={32} /> Excellent!
                  </div>
                ) : (
                  <div className="text-red-600 dark:text-red-400 font-bold">
                    <div className="flex items-center gap-2 text-xl mb-1"><XCircle size={32} /> Correct solution:</div>
                    <div className="font-normal">{currentExercise.type === 'multiple-choice' ? currentExercise.correctAnswer : currentExercise.correctOrder?.join(" ")}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isChecked ? (
            <button
              onClick={handleCheck}
              disabled={(currentExercise.type === 'multiple-choice' && !selectedOption) || (currentExercise.type === 'order-sentence' && orderedWords.length === 0)}
              className="px-8 py-3 bg-electric-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`px-8 py-3 text-white rounded-xl font-bold transition-colors shadow-lg flex items-center gap-2 ${
                isCorrect ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
              }`}
            >
              {isLastExercise ? "Complete Lesson" : "Continue"} <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
