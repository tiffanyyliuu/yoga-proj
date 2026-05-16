import { signIn, signUp } from './actions';

export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;
  const message = searchParams?.message;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-wide">Yoga Planner</h1>
          <p className="mt-2 text-stone-500 text-sm">For yoga instructors</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
            {message}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              formAction={signIn}
              className="flex-1 py-2 px-4 bg-stone-800 text-white rounded-md text-sm hover:bg-stone-700 transition-colors"
            >
              Sign in
            </button>
            <button
              formAction={signUp}
              className="flex-1 py-2 px-4 border border-stone-300 text-stone-700 rounded-md text-sm hover:bg-stone-100 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
