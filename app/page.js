import Link from 'next/link';
import { createClient } from '../lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-7 absolute top-0 left-0 right-0 z-10">
        <span className="font-serif text-xl tracking-wide text-stone-100">Sequence</span>
        <Link
          href="/login"
          className="text-stone-400 hover:text-stone-100 text-sm transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <p className="text-stone-500 text-xs tracking-[0.2em] uppercase mb-8">
          For yoga instructors
        </p>
        <h1 className="font-serif font-light text-6xl sm:text-7xl md:text-8xl leading-[0.95] mb-10 max-w-3xl">
          Sequences that<br />
          <em className="not-italic text-stone-400">know your room</em>
        </h1>
        <p className="text-stone-400 text-lg max-w-md leading-relaxed mb-12">
          AI-powered sequence planning built around your students — their injuries, their energy, what's actually worked.
        </p>
        <Link
          href="/login"
          className="px-8 py-3.5 bg-stone-100 text-stone-900 text-sm rounded-full hover:bg-white transition-colors font-medium"
        >
          Get started free
        </Link>

        {/* Divider */}
        <div className="mt-24 w-px h-16 bg-stone-700 mx-auto" />
      </section>

      {/* Features */}
      <section className="bg-stone-50 text-stone-900 py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-stone-400 text-xs tracking-[0.2em] uppercase text-center mb-20">
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <p className="font-serif text-5xl font-light text-stone-200 mb-6">01</p>
              <h3 className="font-serif text-2xl mb-4">Build your class profiles</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Tell it who shows up — their level, their vibe, recurring injuries. Set it once and it remembers forever.
              </p>
            </div>
            <div>
              <p className="font-serif text-5xl font-light text-stone-200 mb-6">02</p>
              <h3 className="font-serif text-2xl mb-4">Generate in seconds</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Pick today's theme and energy. Get a full 60-minute sequence — timed, cued, with modifications — tailored to your class.
              </p>
            </div>
            <div>
              <p className="font-serif text-5xl font-light text-stone-200 mb-6">03</p>
              <h3 className="font-serif text-2xl mb-4">Gets smarter over time</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Add notes after class. Every sequence you generate learns from what came before — what landed, what didn't.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote / feel section */}
      <section className="bg-stone-900 py-28 px-6 text-center">
        <blockquote className="font-serif text-3xl md:text-4xl font-light text-stone-300 max-w-2xl mx-auto leading-snug">
          "Not a template generator. A sequence planner that actually knows your Tuesday 6pm class."
        </blockquote>
      </section>

      {/* Final CTA */}
      <section className="bg-stone-950 py-28 px-6 text-center">
        <h2 className="font-serif text-5xl md:text-6xl font-light mb-6">
          Ready to plan smarter?
        </h2>
        <p className="text-stone-500 mb-10 text-sm">
          Free to start. No credit card required.
        </p>
        <Link
          href="/login"
          className="px-8 py-3.5 bg-stone-100 text-stone-900 text-sm rounded-full hover:bg-white transition-colors font-medium"
        >
          Create your account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 px-8 py-6 flex items-center justify-between text-stone-600 text-xs">
        <span className="font-serif text-sm text-stone-500">Sequence</span>
        <span>Built for yoga instructors</span>
      </footer>
    </div>
  );
}
