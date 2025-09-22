'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { z } from 'zod';

export const builderConfigSchema = z.object({
  text: z.string().min(1),
  font: z.string(),
  size: z.number().min(1).max(10),
  color: z.string(),
  finish: z.enum(['matte', 'gloss', 'chrome']),
  attachments: z.array(z.string()).default([]),
  logoKey: z.string().optional(),
});

export type BuilderConfig = z.infer<typeof builderConfigSchema>;

interface BuilderState {
  config: BuilderConfig;
  update: (update: Partial<BuilderConfig>) => void;
  reset: () => void;
}

const defaultConfig: BuilderConfig = {
  text: 'HYPE',
  font: 'Orbitron',
  size: 5,
  color: '#ff6f3c',
  finish: 'gloss',
  attachments: [],
  logoKey: undefined,
};

export const useBuilderStore = create<BuilderState>()(
  devtools((set) => ({
    config: defaultConfig,
    update: (update) =>
      set((state) => ({
        config: builderConfigSchema.parse({ ...state.config, ...update }),
      })),
    reset: () => set({ config: defaultConfig }),
  }))
);
