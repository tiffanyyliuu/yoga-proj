'use client';

const QUOTES = [
  {
    text: "I'm still in my 200hr training and Sequence has already changed how I think about sequencing. I feel genuinely ready before I walk in.",
    author: "Maya",
    role: "Student teacher, 200hr training",
  },
  {
    text: "My teacher started using something new and I can feel it — classes have this intentionality now, like she's really thinking about each of us.",
    author: "Jamie",
    role: "Yoga student, practicing 3 years",
  },
  {
    text: "Planning six classes a week was quietly draining me. Sequence gave me that time back without losing the quality my students expect.",
    author: "Sarah",
    role: "RYT-500, teaching since 2016",
  },
  {
    text: "I love that it remembers what didn't land. I never repeat a sequence that fell flat — it knows my notes better than I do.",
    author: "Alex",
    role: "Vinyasa instructor, studio owner",
  },
  {
    text: "I used to spend an hour planning each class. Now I spend five minutes and honestly teach better.",
    author: "Tara",
    role: "200hr certified, teaching since 2019",
  },
];

export default function TestimonialCarousel() {
  const doubled = [...QUOTES, ...QUOTES];

  return (
    <section className="py-20 border-t border-stone-100 dark:border-stone-800 overflow-hidden">
      <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-10 px-8 sm:px-12">
        From teachers and students
      </p>
      <div
        className="marquee-track flex gap-5"
        style={{
          width: 'max-content',
          animation: 'marquee-scroll 32s linear infinite',
        }}
      >
        {doubled.map((q, i) => (
          <div
            key={i}
            className="w-[340px] sm:w-[400px] flex-shrink-0 px-8 py-7 border border-stone-100 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900"
          >
            <p className="font-serif text-xl font-light italic leading-relaxed text-stone-700 dark:text-stone-300 mb-5">
              &ldquo;{q.text}&rdquo;
            </p>
            <p className="text-[12px] text-stone-400 dark:text-stone-500 tracking-wide">
              {q.author} &mdash; {q.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
