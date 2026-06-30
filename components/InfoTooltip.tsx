"use client";

import { useState, useRef, useEffect } from "react";

interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora (essencial no mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <span ref={ref} className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShow((prev) => !prev);
        }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="w-5 h-5 rounded-full bg-moon-600 text-moon-200 text-[10px] font-bold flex items-center justify-center hover:bg-moon-500 active:bg-moon-400 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-1 focus:ring-white/30"
        aria-label="Mais informações"
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 pointer-events-none">
          <div className="bg-moon-900 border border-moon-500 text-moon-200 text-xs rounded-lg p-3 shadow-xl leading-relaxed pointer-events-auto">
            {text}
          </div>
          {/* Seta */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-moon-500" />
        </div>
      )}
    </span>
  );
}
