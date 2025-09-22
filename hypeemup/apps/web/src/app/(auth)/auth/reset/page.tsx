'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { apiFetch } from '@/lib/api-client';

const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!token) {
      setError('Missing reset token.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/auth/reset', {
        method: 'POST',
        body: JSON.stringify({ token, password: values.password }),
      });
      router.push('/auth/login?reset=1');
    } catch (err) {
      setError('Unable to reset password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <p className="text-sm text-white/60">Create a fresh password to secure your account.</p>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        New password
        <input type="password" className="rounded-xl border border-white/10 bg-black/50 px-3 py-2" {...form.register('password')} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Confirm password
        <input
          type="password"
          className="rounded-xl border border-white/10 bg-black/50 px-3 py-2"
          {...form.register('confirmPassword')}
        />
      </label>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black disabled:opacity-60"
      >
        {loading ? 'Updating...' : 'Update password'}
      </button>
    </form>
  );
}
