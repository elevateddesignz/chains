'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { builderConfigSchema, useBuilderStore } from '@/stores/use-builder-store';
import { z } from 'zod';

const fonts = ['Orbitron', 'Bebas Neue', 'Montserrat', 'Anton'];
const finishes: Array<{ label: string; value: 'matte' | 'gloss' | 'chrome' }> = [
  { label: 'Matte', value: 'matte' },
  { label: 'Gloss', value: 'gloss' },
  { label: 'Chrome', value: 'chrome' },
];

export function OptionsPanel() {
  const { config, update } = useBuilderStore();
  const [saving, setSaving] = useState(false);
  const form = useForm<z.infer<typeof builderConfigSchema>>({
    resolver: zodResolver(builderConfigSchema),
    defaultValues: config,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    update(values);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSaving(false);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-xs uppercase tracking-wider text-white/60">
        Chain Text
        <input
          className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
          {...form.register('text')}
        />
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-wider text-white/60">
        Font
        <select
          className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
          {...form.register('font')}
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-wider text-white/60">
        Size ({form.watch('size')})
        <input
          type="range"
          min={1}
          max={10}
          className="accent-brand-orange"
          {...form.register('size', { valueAsNumber: true })}
        />
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-wider text-white/60">
        Color
        <input type="color" {...form.register('color')} className="h-12 w-full cursor-pointer rounded" />
      </label>
      <div className="flex flex-col gap-2 text-xs uppercase tracking-wider text-white/60">
        Finish
        <div className="grid grid-cols-3 gap-2">
          {finishes.map((finish) => (
            <label key={finish.value} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm">
              <input
                type="radio"
                value={finish.value}
                {...form.register('finish')}
                className="accent-brand-orange"
              />
              {finish.label}
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="mt-2 rounded-full bg-brand-orange px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-60"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Design'}
      </button>
    </form>
  );
}
