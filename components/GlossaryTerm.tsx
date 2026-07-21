"use client";

import { useState, useRef, useMemo } from "react";
import glossaryData from "@/data/glossary.json";

interface GlossaryTermProps {
  term: string;
  children?: React.ReactNode;
}

/**
 * Client component that renders a term with a tooltip on hover.
 * Usage: <GlossaryTerm term="superfat">superfat</GlossaryTerm>
 */
export default function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const definition = useMemo(() => {
    const lower = term.toLowerCase();
    const found = glossaryData.terms.find((t) => t.term.toLowerCase() === lower);
    if (!found) return null;
    return found.en ? `${found.definition} (Inglês: ${found.en})` : found.definition;
  }, [term]);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setShow(true), 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setShow(false);
  };

  if (!definition) {
    return <>{children ?? term}</>;
  }

  return (
    <span
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative border-b border-dotted border-purple-400 cursor-help"
    >
      {children ?? term}
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg w-64 text-center pointer-events-none">
          {definition}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}
