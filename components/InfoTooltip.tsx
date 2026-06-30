"use client";

import { useState } from "react";

interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-moon-600 text-moon-200 text-[10px] font-bold flex items-center justify-center hover:bg-moon-500 transition-colors cursor-pointer shrink-0"
        aria-label="Mais informações"
      >
        ?
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 z-50">
          <div className="bg-moon-900 border border-moon-500 text-moon-200 text-xs rounded-lg p-2.5 shadow-xl leading-relaxed">
            {text}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-moon-500" />
        </div>
      )}
    </span>
  );
}
