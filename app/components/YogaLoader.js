'use client';

export default function YogaLoader({
  message = 'Crafting your sequence…',
  sub = 'This takes about 30 seconds',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-32 ${className}`}>
      {/* perspective wrapper gives the rotateY a 3-D turning look */}
      <div style={{ perspective: '400px' }} className="mb-8">
        <svg
          viewBox="0 0 50 90"
          width="44"
          height="78"
          fill="none"
          className="text-stone-300 dark:text-stone-600"
          style={{ animation: 'yoga-turn 3.5s linear infinite', transformOrigin: '50% 50%' }}
        >
          {/* Head */}
          <circle cx="25" cy="8" r="7" fill="currentColor" />

          {/* Torso */}
          <line x1="25" y1="16" x2="25" y2="44"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

          {/* Arms raised, hands joined at top — inverted-V */}
          <polyline points="16,12 25,25 34,12"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="16" y1="12" x2="34" y2="12"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Standing leg */}
          <line x1="24" y1="44" x2="21" y2="82"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

          {/* Raised leg — bent outward (tree pose) */}
          <line x1="26" y1="50" x2="37" y2="62"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="37" y1="62" x2="28" y2="67"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <p className="font-serif text-xl font-light text-stone-600 dark:text-stone-400">{message}</p>
      {sub && <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">{sub}</p>}
    </div>
  );
}
