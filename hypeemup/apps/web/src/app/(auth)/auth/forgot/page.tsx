'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { apiFetch } from '@/lib/api-client';

const schema = z.object({ email: z.string().email() });

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    setMessage(null);
    try {
      await apiFetch('/auth/forgot', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      setMessage('Check your email for reset instructions.');
    } catch (err) {
      setMessage('We were unable to send reset instructions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-white/60">Enter your email and we will send reset instructions.</p>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input type="email" className="rounded-xl border border-white/10 bg-black/50 px-3 py-2" {...form.register('email')} />
      </label>
      {message ? <p className="text-xs text-white/60">{message}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Email reset link'}
      </button>
      <p className="text-xs text-white/60">
        <Link href="/auth/login" className="text-brand-orange hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
