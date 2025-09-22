'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { useBuilderStore } from '@/stores/use-builder-store';

export function BuilderCanvas() {
  const { config } = useBuilderStore();
  const previewText = useMemo(() => config.text.toUpperCase(), [config.text]);

  return (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-black/40">
      <svg viewBox="0 0 400 200" className="h-full w-full">
        <defs>
          <linearGradient id="chain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
            <stop offset="100%" stopColor={config.color} />
          </linearGradient>
        </defs>
        <motion.text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily={config.font}
          fontSize={24 + config.size * 8}
          fill="url(#chain-gradient)"
          stroke="#050816"
          strokeWidth={2}
          letterSpacing={4}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {previewText}
        </motion.text>
      </svg>
    </div>
  );
}
