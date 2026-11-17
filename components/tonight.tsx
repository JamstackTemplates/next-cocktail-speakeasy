'use client';

import { lounge } from '../content/lounge';
import { isOpen, musicTonight, musicText, setTimes, statusText } from '../lib/tonight';
import { Plume } from './deco';
import { useLoungeNow } from './lounge-clock';

/**
 * "Doors open at 5pm" / "Open · last call 1:30am" / "Last call in 20 minutes" / "Closed tonight ·
 * doors open Tuesday at 5pm", with a status lamp. The static HTML shows `fallback`, which never
 * claims open or closed.
 */
export function StatusLine({ fallback, className = '' }: { fallback: string; className?: string }) {
  const now = useLoungeNow();
  return (
    <span className={`status-line ${className}`} data-status={now?.status.kind}>
      <span className="status-lamp" aria-hidden="true" />
      <span>{now ? statusText(now.status) : fallback}</span>
    </span>
  );
}

/**
 * Tonight's music: "Tonight · Live jazz with the Acme Trio from 9pm", or "Playing now" while it's on.
 * Shows `fallback` (the week's music nights) before the browser knows the time, and nothing on a night
 * without music.
 */
export function TonightMusic({ fallback, className = '' }: { fallback?: string; className?: string }) {
  const now = useLoungeNow();
  const tonight = now ? musicTonight(now.day, now.minutes, now.status) : null;
  if (now && !tonight) return null;
  if (!now && !fallback) return null;
  return (
    <p className={`tonight-music ${className}`} data-playing={tonight?.playing ? 'true' : undefined}>
      <Plume width={26} className="flex-none text-gold" />
      <span>
        <span className="tonight-label">{tonight ? (tonight.playing ? 'Playing now' : 'Tonight') : 'Live music'}</span>
        <span className="sr-only">: </span>
        <span>{tonight ? musicText(tonight) : fallback}</span>
      </span>
    </p>
  );
}

/**
 * The week's music as an engraved programme. In the browser, tonight's set is marked "Tonight" or
 * "Playing now"; the static HTML lists the week without any claim about tonight.
 */
export function Programme() {
  const now = useLoungeNow();
  const tonight = now ? musicTonight(now.day, now.minutes, now.status) : null;
  const night = now && isOpen(now.status) ? now.status.night : now?.day;
  return (
    <ol className="programme">
      {lounge.music.map(set => {
        const isTonight = Boolean(tonight && set.day === night);
        return (
          <li key={set.day} className="programme-row" data-tonight={isTonight ? 'true' : undefined} data-playing={isTonight && tonight?.playing ? 'true' : undefined}>
            <p className="programme-when">
              <span className="programme-day">{set.day}</span>
              <span className="programme-leader" aria-hidden="true" />
              <span className="programme-time figures">{setTimes(set)}</span>
            </p>
            <p className="programme-act">{set.act.replace(/^the /, 'The ')}</p>
            <p className="programme-genre">
              Live {set.genre}
              {isTonight ? <span className="programme-flag">{tonight?.playing ? 'Playing now' : 'Tonight'}</span> : null}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
