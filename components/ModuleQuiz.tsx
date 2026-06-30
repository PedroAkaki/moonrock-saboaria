"use client";

import { useState, useEffect } from "react";
import { getProgress, updateQuizAnswer } from "@/lib/progress";

interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
}

export default function ModuleQuiz({ slug, questions }: { slug: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  // Restore saved answers on mount
  useEffect(() => {
    const p = getProgress();
    const saved = p.modules[slug]?.quizAnswers;
    if (saved && Object.keys(saved).length > 0) {
      setAnswers(saved);
    }
  }, [slug]);

  const handleInputChange = (id: string, value: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    updateQuizAnswer(slug, id, value);
  };

  const handleSubmit = (id: string) => {
    setSubmitted((prev) => ({ ...prev, [id]: true }));
  };

  const normalizeString = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const isCorrect = (q: QuizQuestion) => {
    if (!submitted[q.id] || answers[q.id] === undefined) return null;
    if (q.type === "short") {
      return normalizeString(answers[q.id] as string).includes(
        normalizeString(q.correctAnswer as string)
      );
    }
    return answers[q.id] === q.correctAnswer;
  };

  return (
    <div className="space-y-5">
      {questions.map((q, index) => {
        const correct = isCorrect(q);
        return (
          <div
            key={q.id}
            className={`p-5 rounded-xl border transition-colors ${
              correct === true
                ? "border-green-600 bg-green-900/15"
                : correct === false
                ? "border-red-600 bg-red-900/15"
                : "border-moon-600 bg-moon-700/20"
            }`}
          >
            <p className="text-sm text-moon-100 mb-3 font-medium">
              {index + 1}. {q.question}
            </p>

            {q.type === "multiple-choice" && (
              <div className="space-y-2 mb-3">
                {q.options?.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2.5 text-sm text-moon-300 cursor-pointer hover:text-white transition-colors"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      disabled={submitted[q.id]}
                      className="accent-white"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "true-false" && (
              <div className="flex gap-3 mb-3">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => handleInputChange(q.id, val)}
                    disabled={submitted[q.id]}
                    className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      answers[q.id] === val
                        ? "bg-white text-moon-900 border-white"
                        : "border-moon-500 text-moon-400 hover:border-moon-300"
                    }`}
                  >
                    {val ? "Verdadeiro" : "Falso"}
                  </button>
                ))}
              </div>
            )}

            {q.type === "short" && (
              <input
                type="text"
                value={(answers[q.id] as string) || ""}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                disabled={submitted[q.id]}
                placeholder="Digite sua resposta..."
                className="w-full bg-moon-800 border border-moon-500 text-white rounded-lg px-3 py-2 text-sm mb-3 placeholder-moon-400"
              />
            )}

            {!submitted[q.id] ? (
              <button
                onClick={() => handleSubmit(q.id)}
                disabled={answers[q.id] === undefined || answers[q.id] === ""}
                className="text-xs text-moon-400 underline hover:text-white transition-colors disabled:opacity-30 disabled:no-underline"
              >
                Verificar
              </button>
            ) : (
              <div className="mt-3 space-y-1.5">
                <p className={`text-sm font-semibold ${correct ? "text-green-400" : "text-red-400"}`}>
                  {correct ? "✅ Correto!" : "❌ Incorreto."}
                </p>
                <p className="text-xs text-moon-400 leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
