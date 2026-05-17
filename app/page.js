import Link from 'next/link';
import { createClient } from '../lib/supabase/server';
import { redirect } from 'next/navigation';
import ThemeToggle from './components/ThemeToggle';
import TrySection from './components/TrySection';
import TestimonialCarousel from './components/TestimonialCarousel';

export default async function LandingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100" style={{ fontWeight: 300 }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 sm:px-12 py-7 border-b border-stone-100 dark:border-stone-800">
        <span className="font-serif text-sm tracking-[0.14em] uppercase text-stone-800 dark:text-stone-200">Sequence</span>
        <div className="flex items-center gap-4">
          <ThemeToggle className="text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300" />
          <Link href="/login"
            className="text-xs text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 px-5 py-2 rounded hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors tracking-wide">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 sm:px-12 pt-24 pb-20 max-w-3xl">
        <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-8">
          For yoga teachers
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light leading-[1.08] tracking-tight mb-8">
          Your classes,<br />
          <em>finally</em> remembered.
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-base leading-[1.8] max-w-md mb-10">
          Sequence learns your students — their injuries, their energy, what worked last Tuesday — and builds classes around the people actually in the room.
        </p>
        <div className="flex items-center gap-8">
          <Link href="/login"
            className="text-[13px] tracking-wide bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-7 py-3 rounded hover:bg-stone-700 dark:hover:bg-white transition-colors">
            Get early access
          </Link>
          <a href="#try" className="text-[13px] text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors flex items-center gap-1.5">
            Try it first →
          </a>
        </div>
      </section>

      <div className="h-px bg-stone-100 dark:bg-stone-800" />

      {/* Features */}
      <section className="px-8 sm:px-12 py-20">
        <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-12">What you get</p>
        <div className="grid sm:grid-cols-3 gap-12 sm:gap-10">
          <div>
            <p className="font-serif text-4xl font-light text-stone-200 dark:text-stone-700 mb-5 leading-none">01</p>
            <p className="text-sm font-normal text-stone-700 dark:text-stone-300 mb-2 tracking-wide">A memory for every class</p>
            <p className="text-[13px] leading-[1.8] text-stone-400 dark:text-stone-500">
              Tell Sequence about your Tuesday 6pm once. It remembers the knee injuries, the advanced student who needs a challenge, the vibe. Every sequence it builds after that is informed by those people.
            </p>
          </div>
          <div>
            <p className="font-serif text-4xl font-light text-stone-200 dark:text-stone-700 mb-5 leading-none">02</p>
            <p className="text-sm font-normal text-stone-700 dark:text-stone-300 mb-2 tracking-wide">Sequences that learn from history</p>
            <p className="text-[13px] leading-[1.8] text-stone-400 dark:text-stone-500">
              Log what you taught and how it landed. Sequence reads your notes — what worked, what fell flat — and never suggests the same thing twice when it didn&apos;t serve your class.
            </p>
          </div>
          <div>
            <p className="font-serif text-4xl font-light text-stone-200 dark:text-stone-700 mb-5 leading-none">03</p>
            <p className="text-sm font-normal text-stone-700 dark:text-stone-300 mb-2 tracking-wide">One word to start</p>
            <p className="text-[13px] leading-[1.8] text-stone-400 dark:text-stone-500">
              Tell it today&apos;s intention — surrender, strength, groundedness — and it builds the theme, the arc, and the peak around that word. You show up present. Sequence handled the planning.
            </p>
          </div>
        </div>
      </section>

      {/* Sequence preview */}
      <div id="preview" className="px-8 sm:px-12 pb-20">
        <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-stone-200 dark:border-stone-700 flex items-center gap-2 bg-white dark:bg-stone-900">
            <span className="w-2 h-2 rounded-full bg-stone-200 dark:bg-stone-700" />
            <span className="w-2 h-2 rounded-full bg-stone-200 dark:bg-stone-700" />
            <span className="w-2 h-2 rounded-full bg-stone-200 dark:bg-stone-700" />
            <span className="ml-2 text-[11px] tracking-[0.1em] uppercase text-stone-300 dark:text-stone-600">Generated sequence</span>
          </div>
          <div className="px-8 sm:px-10 py-8 bg-stone-50 dark:bg-stone-900">
            <p className="text-[11px] tracking-[0.14em] uppercase text-stone-400 dark:text-stone-500 mb-3">Tuesday 6pm Vinyasa — May 15</p>
            <div className="h-px bg-stone-200 dark:bg-stone-700 mb-4" />
            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1 text-[13px] mb-6">
              <span className="text-[11px] tracking-widest uppercase text-stone-400 dark:text-stone-500">Theme</span>
              <span className="text-stone-700 dark:text-stone-300">Finding ground</span>
              <span className="text-[11px] tracking-widest uppercase text-stone-400 dark:text-stone-500">Intention</span>
              <span className="text-stone-700 dark:text-stone-300">Surrender</span>
            </div>

            {[
              { label: 'Arrive & ground', dur: '5 min', poses: [
                { time: '0:00 – 2:00', name: 'Seated breathing' },
                { time: '2:00 – 5:00', name: 'Cat-cow' },
              ]},
              { label: 'Build', dur: '25 min', poses: [
                { time: '5:00 – 12:00', name: 'Sun salutation A ×3' },
                { time: '12:00 – 18:00', name: 'Warrior I → Warrior II' },
                { time: '18:00 – 24:00', name: 'Triangle', mod: 'knee mod: block at shin' },
                { time: '24:00 – 30:00', name: 'Pigeon — peak' },
              ]},
              { label: 'Cool down', dur: '20 min', poses: [
                { time: '30:00 – 40:00', name: 'Supine twist' },
                { time: '40:00 – 50:00', name: 'Happy baby' },
                { time: '50:00 – 60:00', name: 'Savasana' },
              ]},
            ].map(section => (
              <div key={section.label} className="mb-5">
                <div className="flex justify-between text-[11px] tracking-[0.16em] uppercase text-stone-400 dark:text-stone-500 mb-2">
                  <span>{section.label}</span><span>{section.dur}</span>
                </div>
                {section.poses.map((p, i) => (
                  <div key={i} className="flex gap-6 py-2 border-b border-stone-200 dark:border-stone-700 last:border-0 text-[13px]">
                    <span className="text-stone-400 dark:text-stone-500 font-serif shrink-0 whitespace-nowrap pt-px" style={{ minWidth: 90 }}>{p.time}</span>
                    <div>
                      <span className="text-stone-700 dark:text-stone-300">{p.name}</span>
                      {p.mod && <p className="text-[11px] text-stone-400 dark:text-stone-500 italic mt-0.5">✦ {p.mod}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="pt-4 border-t border-stone-200 dark:border-stone-700 text-[12px] text-stone-400 dark:text-stone-500 leading-[1.8] italic">
              Low energy noted last session. Hip-focused build, skipped inversions. More core next time per Maya&apos;s request.
            </div>
          </div>
        </div>
      </div>

      <TrySection />

      <TestimonialCarousel />

      {/* Footer */}
      <footer className="px-8 sm:px-12 py-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
        <span className="font-serif text-sm tracking-[0.14em] uppercase text-stone-300 dark:text-stone-600">Sequence</span>
        <p className="text-[12px] text-stone-300 dark:text-stone-600">© 2026 · Built for teachers who know their students</p>
      </footer>

    </div>
  );
}
