'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export interface TickerItem {
  title: string;
  href: string;
}

export function BreakingNewsTicker({ items }: { items: TickerItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = items.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  const current = items[Math.min(index, count - 1)];
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className="bg-green-700 text-white px-4 py-2.5 text-sm shadow-inner">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <span className="font-bold bg-green-900 px-2 py-0.5 rounded text-xs tracking-wider shrink-0">
            BREAKING
          </span>
          <Link
            href={current.href}
            key={current.href}
            className="font-medium truncate hover:underline"
            aria-live="polite"
          >
            {current.title}
          </Link>
        </div>
        {count > 1 && (
          <div className="hidden md:flex gap-1.5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous headline"
              className="flex h-6 w-6 items-center justify-center rounded bg-green-800 transition-all hover:bg-green-600"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Resume headlines' : 'Pause headlines'}
              aria-pressed={paused}
              className="flex h-6 w-6 items-center justify-center rounded bg-green-800 transition-all hover:bg-green-600"
            >
              {paused ? <Play size={12} /> : <Pause size={12} />}
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next headline"
              className="flex h-6 w-6 items-center justify-center rounded bg-green-800 transition-all hover:bg-green-600"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
