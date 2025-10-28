'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function page() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const email = form.elements.namedItem('email')?.value.trim();
    const password = form.elements.namedItem('password')?.value;
    const confirm = form.elements.namedItem('confirm')?.value;

    if (password !== confirm) {
      setLoading(false);
      return setError('Passwords do not match.');
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.replace('/'); // or /login depending on your flow
        router.refresh();
      } else {
        let msg = 'Sign up failed';
        try {
          const data = await res.json();
          msg = data?.errors?.[0]?.message || data?.message || msg;
        } catch {}
        setError(msg);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-indigo-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-violet-950">
      <section className="section_container">
        <div className="pink_container rounded-[30px] text-center py-10">
          <span className="tag">Create account</span>
          <h1 className="heading">Join us</h1>
          <p className="sub-heading">It only takes a minute</p>
        </div>
      </section>

      <section className="section_container">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200/70 dark:border-zinc-800 p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-pink-500/60 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={4}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-pink-500/60 transition"
                />
              </div>
            </div>

            {/* Confirm */}
            <div className="space-y-2">
              <label
                htmlFor="confirm"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={4}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-pink-500/60 transition"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-3 text-red-700 dark:text-red-200"
                role="alert"
              >
                <AlertCircle className="size-5 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white py-2.5 px-4 hover:bg-zinc-800 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-md"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? 'Creating account…' : 'Sign up'}
            </button>

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dashed border-zinc-300 dark:border-zinc-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/70 dark:bg-zinc-900/60 px-2 text-xs text-zinc-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/auth/login"
                className="text-pink-600 font-medium hover:underline"
              >
                Sign in
              </Link>
              <Link
                href="/"
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
