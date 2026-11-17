'use client';

import { useEffect, useState } from 'react';
import type { Day } from '../content/lounge';
import { localNow, statusAt, type Status } from '../lib/tonight';
import { site } from '../lib/site';

export interface LoungeNow {
  /** Calendar day in the lounge's time zone. */
  day: Day;
  /** Minutes after local midnight. */
  minutes: number;
  status: Status;
}

/**
 * The lounge's local day, time and status, computed in the browser from the time zone in
 * site.config.json and refreshed every minute. Returns null during the static render, before
 * hydration and when no time zone is configured, so nothing time-dependent is baked into the HTML.
 */
export function useLoungeNow(): LoungeNow | null {
  const [now, setNow] = useState<LoungeNow | null>(null);

  useEffect(() => {
    if (!site.timeZone) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const { day, minutes } = localNow(site.timeZone);
      setNow({ day, minutes, status: statusAt(day, minutes) });
      // Wake just after the next minute starts, so "Last call in 20 minutes" stays exact.
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 250);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return now;
}
