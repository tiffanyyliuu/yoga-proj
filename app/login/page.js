import { signIn } from './actions';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import LoginButtons from './LoginButtons';

export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;
  const message = searchParams?.message;

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 flex flex-col">
      <nav className="px-8 py-7 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-stone-900 dark:text-stone-100 tracking-wide">
          Sequence
        </Link>
        <ThemeToggle className="text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300" />
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="font-serif text-4xl font-light text-stone-900 dark:text-stone-100 mb-2">Welcome</h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Sign in or create an account to get started.</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 px-4 py-3 rounded-lg text-sm mb-6">
              {message}
            </div>
          )}

          <form action={signIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs text-stone-500 dark:text-stone-400 mb-2 tracking-wide uppercase">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 text-sm placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-stone-500 dark:text-stone-400 mb-2 tracking-wide uppercase">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 text-sm placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <LoginButtons />
          </form>
        </div>
      </div>
    </div>
  );
}
