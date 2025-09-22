'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { apiFetch } from '@/lib/api-client';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      router.push('/account');
    } catch (err) {
      setError('Invalid credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-white/60">Welcome back to HypeEmUp.</p>
      </div>
      <div className="space-y-3">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            className="rounded-xl border border-white/10 bg-black/50 px-3 py-2"
            {...form.register('email')}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            className="rounded-xl border border-white/10 bg-black/50 px-3 py-2"
            {...form.register('password')}
          />
        </label>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      <div className="flex justify-between text-xs text-white/60">
        <Link href="/auth/forgot" className="text-brand-orange hover:underline">
          Forgot password?
        </Link>
        <Link href="/auth/register" className="text-brand-orange hover:underline">
          Create account
        </Link>
      </div>
    </form>
  );
}
