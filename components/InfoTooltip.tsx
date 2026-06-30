"use client";

import { useEffect, useRef, useState } from "react";

interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <span
      ref={ref}
      className="relative inline-flex items-center ml-1.5"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((value) => !value);
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-moon-400 text-[10px] leading-none text-moon-300 transition-colors hover:border-white hover:text-white focus:outline-none focus:ring-1 focus:ring-white/50 active:bg-moon-600"
        aria-label="Mais informações"
        aria-expanded={isOpen}
      >
        ?
      </button>

      {isOpen && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-lg border border-moon-500 bg-moon-900 px-3 py-2.5 text-xs leading-relaxed text-moon-200 shadow-xl">
          {text}
          <span className="absolute left-1/2 top-full -mt-px h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-moon-500 bg-moon-900" />
        </span>
      )}
    </span>
  );
}
