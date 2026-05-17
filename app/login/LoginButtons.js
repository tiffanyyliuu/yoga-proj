'use client';
import { useFormStatus } from 'react-dom';
import { signUp } from './actions';

export default function LoginButtons() {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="submit"
        disabled={pending}
        className="flex-1 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-700 dark:hover:bg-white transition-colors disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      <button
        type="submit"
        formAction={signUp}
        disabled={pending}
        className="flex-1 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-lg text-sm hover:border-stone-400 dark:hover:border-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors disabled:opacity-60"
      >
        Sign up
      </button>
    </div>
  );
}
