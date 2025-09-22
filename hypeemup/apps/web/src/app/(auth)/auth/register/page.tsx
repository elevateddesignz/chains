'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { apiFetch } from '@/lib/api-client';

const schema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      router.push('/auth/login?registered=1');
    } catch (err) {
      setError('Unable to create account.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-white/60">Design and checkout faster with an account.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          First name
          <input className="rounded-xl border border-white/10 bg-black/50 px-3 py-2" {...form.register('firstName')} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Last name
          <input className="rounded-xl border border-white/10 bg-black/50 px-3 py-2" {...form.register('lastName')} />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input type="email" className="rounded-xl border border-white/10 bg-black/50 px-3 py-2" {...form.register('email')} />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input type="password" className="rounded-xl border border-white/10 bg-black/50 px-3 py-2" {...form.register('password')} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Confirm password
          <input type="password" className="rounded-xl border border-white/10 bg-black/50 px-3 py-2" {...form.register('confirmPassword')} />
        </label>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black disabled:opacity-60"
      >
        {loading ? 'Creating...' : 'Create account'}
      </button>
      <p className="text-xs text-white/60">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-brand-orange hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
