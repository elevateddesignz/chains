'use client';

import { ChangeEvent, useState } from 'react';

import { useBuilderStore } from '@/stores/use-builder-store';
import { uploadFileToApi } from '@/lib/uploads';

export function ImageUploader() {
  const { update } = useBuilderStore();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done'>('idle');

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus('uploading');
    const key = await uploadFileToApi(file);
    update({ logoKey: key });
    setStatus('done');
  };

  return (
    <div className="flex flex-col gap-2 text-xs uppercase tracking-wider text-white/60">
      Upload Logo (SVG/PNG)
      <input
        type="file"
        accept="image/svg+xml,image/png"
        onChange={onFileChange}
        className="rounded-lg border border-dashed border-white/20 bg-black/30 px-3 py-4 text-sm"
      />
      <p className="text-[11px] text-white/40">
        Status: <span className="text-brand-orange">{status}</span>
      </p>
    </div>
  );
}
