import { signIn, signUp } from './actions';
import Link from 'next/link';

export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;
  const message = searchParams?.message;

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      <nav className="px-8 py-7">
        <Link href="/" className="font-serif text-xl text-stone-100 tracking-wide">
          Sequence
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="font-serif text-4xl font-light text-stone-100 mb-2">Welcome back</h1>
            <p className="text-stone-500 text-sm">Sign in to your account or create a new one.</p>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-stone-900 border border-stone-700 text-stone-300 px-4 py-3 rounded-lg text-sm mb-6">
              {message}
            </div>
          )}

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs text-stone-400 mb-2 tracking-wide uppercase">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-stone-400 mb-2 tracking-wide uppercase">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                formAction={signIn}
                className="flex-1 py-3 bg-stone-100 text-stone-900 rounded-lg text-sm font-medium hover:bg-white transition-colors"
              >
                Sign in
              </button>
              <button
                formAction={signUp}
                className="flex-1 py-3 border border-stone-700 text-stone-300 rounded-lg text-sm hover:border-stone-500 hover:text-stone-100 transition-colors"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
