'use client';

export default function YogaLoader({
  message = 'Crafting your sequence…',
  sub = 'This takes about 30 seconds',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-32 ${className}`}>
      <svg
        viewBox="0 0 60 100"
        width="72"
        height="120"
        fill="none"
        className="text-stone-300 dark:text-stone-600 mb-8"
        style={{ animation: 'yoga-spin 4s linear infinite', transformOrigin: '50% 50%' }}
      >
        {/* Head */}
        <circle cx="30" cy="10" r="8" fill="currentColor" />

        {/* Torso */}
        <line x1="30" y1="19" x2="30" y2="52"
          stroke="currentColor" strokeWidth="5" strokeLinecap="round" />

        {/* Left arm — raised up-left */}
        <line x1="30" y1="30" x2="14" y2="16"
          stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />

        {/* Right arm — raised up-right */}
        <line x1="30" y1="30" x2="46" y2="16"
          stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />

        {/* Hands joined at top */}
        <line x1="14" y1="16" x2="46" y2="16"
          stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

        {/* Standing leg — straight down */}
        <line x1="29" y1="52" x2="25" y2="90"
          stroke="currentColor" strokeWidth="5" strokeLinecap="round" />

        {/* Raised leg — thigh out right */}
        <line x1="31" y1="58" x2="46" y2="72"
          stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />

        {/* Raised leg — lower leg back in (tree pose) */}
        <line x1="46" y1="72" x2="36" y2="78"
          stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      </svg>

      <p className="font-serif text-xl font-light text-stone-600 dark:text-stone-400">{message}</p>
      {sub && <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">{sub}</p>}
    </div>
  );
}
