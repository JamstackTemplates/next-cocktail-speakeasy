// Opening hours, last call, tonight's status and tonight's music.
// Everything here is pure (no clocks), so it's unit tested; the browser supplies the current local
// day and time in the lounge's time zone (see components/lounge-clock.tsx).
import { DAYS, lounge, type Day, type MusicNight, type OpeningHours } from '../content/lounge.ts';

const MINUTES_PER_DAY = 24 * 60;

/** "Last call in 20 minutes" is shown this long before last call. */
export const LAST_CALL_WARNING_MINUTES = 30;

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** "HH:MM" for minutes after midnight, wrapping around the day. */
export function fromMinutes(minutes: number): string {
  const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
}

/** True when the night's closing time is after midnight (e.g. opens 17:00, closes 02:00). */
export function closesAfterMidnight(entry: OpeningHours): boolean {
  return Boolean(entry.opens && entry.closes && toMinutes(entry.closes) < toMinutes(entry.opens));
}

/** "17:00" → "5pm", "00:30" → "12:30am", "00:00" → "midnight". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  if (h === 0 && m === 0) return 'midnight';
  if (h === 12 && m === 0) return 'noon';
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** "5pm – 2am" or "Closed". */
export function formatHours(entry: OpeningHours): string {
  return entry.opens && entry.closes ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}` : 'Closed';
}

/** Last call as "HH:MM": `lastCallMinutes` before closing, e.g. 01:30 for a 02:00 close. */
export function lastCallTime(closes: string, lastCallMinutes = lounge.lastCallMinutes): string {
  return fromMinutes(toMinutes(closes) - lastCallMinutes);
}

/**
 * Minutes into a night for a time that night: times earlier than (or equal to) the doors opening
 * are after midnight, so Friday's 01:00 is 25 * 60.
 */
export function nightMinutes(time: string, opens: string): number {
  const value = toMinutes(time);
  return value < toMinutes(opens) ? value + MINUTES_PER_DAY : value;
}

export interface HoursGroup {
  /** "Tue – Thu", "Friday", "Sun – Mon". */
  label: string;
  /** "5pm – 1am" or "Closed". */
  hours: string;
  /** "12:30am", or '' on closed days. */
  lastCall: string;
  /** Closes after midnight. */
  late: boolean;
  closed: boolean;
}

/**
 * Consecutive days with the same hours, open nights first. A run that wraps from Sunday into
 * Monday is kept together, so closed Sunday and Monday read as one "Sun – Mon" line at the end.
 */
export function groupedHours(hours: OpeningHours[] = lounge.hours, lastCallMinutes = lounge.lastCallMinutes): HoursGroup[] {
  const groups: { days: Day[]; entry: OpeningHours }[] = [];
  for (const entry of hours) {
    const last = groups.at(-1);
    if (last && formatHours(last.entry) === formatHours(entry)) last.days.push(entry.day);
    else groups.push({ days: [entry.day], entry });
  }
  const first = groups[0], last = groups.at(-1);
  if (groups.length > 2 && first && last && formatHours(first.entry) === formatHours(last.entry)
    && first.days[0] === 'Monday' && last.days.at(-1) === 'Sunday') {
    first.days.unshift(...last.days);
    groups.pop();
  }
  // Lead with the nights you're open.
  while (groups.length > 1 && !groups[0].entry.opens) groups.push(groups.shift()!);
  const short = (day: Day) => day.slice(0, 3);
  return groups.map(group => ({
    label: group.days.length === 1 ? group.days[0] : `${short(group.days[0])} – ${short(group.days.at(-1)!)}`,
    hours: formatHours(group.entry),
    lastCall: group.entry.closes ? formatTime(lastCallTime(group.entry.closes, lastCallMinutes)) : '',
    late: closesAfterMidnight(group.entry),
    closed: !group.entry.opens,
  }));
}

/** "Tuesday to Saturday from 5pm": the neutral summary used before the browser knows the time. */
export function openDaysSummary(hours: OpeningHours[] = lounge.hours): string {
  const open = hours.filter(entry => entry.opens && entry.closes);
  if (!open.length) return 'See our hours';
  const times = new Set(open.map(entry => entry.opens));
  const from = times.size === 1 ? ` from ${formatTime(open[0].opens!)}` : '';
  const indices = open.map(entry => DAYS.indexOf(entry.day));
  const consecutive = indices.every((index, i) => i === 0 || index === indices[i - 1] + 1);
  const days = open.length === 1 ? `${open[0].day}s`
    : consecutive ? `${open[0].day} to ${open.at(-1)!.day}`
    : open.map(entry => entry.day.slice(0, 3)).join(', ');
  return `Open ${days}${from}`;
}

/** A week of music as "Thu, Fri & Sat", for the no-JavaScript fallback. */
export function musicDaysSummary(music: MusicNight[] = lounge.music): string {
  const days = DAYS.filter(day => music.some(set => set.day === day)).map(day => day.slice(0, 3));
  if (!days.length) return '';
  return days.length === 1 ? days[0] : `${days.slice(0, -1).join(', ')} & ${days.at(-1)}`;
}

function entryFor(day: Day, hours: OpeningHours[]): OpeningHours | undefined {
  return hours.find(entry => entry.day === day);
}

function previousDay(day: Day): Day {
  return DAYS[(DAYS.indexOf(day) + 6) % 7];
}

export type Status =
  | {
      kind: 'open' | 'last-call' | 'after-last-call';
      /** The night whose hours we're in: 1am Saturday is still Friday night. */
      night: Day;
      /** Closing time, "HH:MM". */
      closes: string;
      /** Last call, "HH:MM". */
      lastCall: string;
      /** Minutes until last call (zero or negative once it has passed). */
      minutesToLastCall: number;
      /** Minutes until the doors close. */
      minutesToClose: number;
    }
  /** Not open yet, but opening later today. */
  | { kind: 'before-doors'; opens: string }
  /** Not opening again today. `next` is undefined when no day has hours. */
  | { kind: 'closed'; next?: { day: Day; opens: string } };

/**
 * Tonight's status at a local day and time (minutes after midnight). Late nights carry over:
 * when Friday closes at 02:00, 1am Saturday is still Friday night.
 */
export function statusAt(day: Day, minutes: number, hours: OpeningHours[] = lounge.hours, lastCallMinutes = lounge.lastCallMinutes): Status {
  const open = (entry: OpeningHours, now: number): Status | undefined => {
    if (!entry.opens || !entry.closes) return undefined;
    const close = nightMinutes(entry.closes, entry.opens);
    if (now < toMinutes(entry.opens) || now >= close) return undefined;
    const lastCall = close - lastCallMinutes;
    const minutesToLastCall = lastCall - now;
    const kind = minutesToLastCall <= 0 ? 'after-last-call' : minutesToLastCall <= LAST_CALL_WARNING_MINUTES ? 'last-call' : 'open';
    return { kind, night: entry.day, closes: entry.closes, lastCall: fromMinutes(lastCall), minutesToLastCall, minutesToClose: close - now };
  };

  // Still open from last night?
  const yesterday = entryFor(previousDay(day), hours);
  const carried = yesterday && closesAfterMidnight(yesterday) ? open(yesterday, minutes + MINUTES_PER_DAY) : undefined;
  if (carried) return carried;
  const today = entryFor(day, hours);
  const tonight = today ? open(today, minutes) : undefined;
  if (tonight) return tonight;
  if (today?.opens && today.closes && minutes < toMinutes(today.opens)) return { kind: 'before-doors', opens: today.opens };

  const start = DAYS.indexOf(day);
  for (let inDays = 1; inDays <= 7; inDays++) {
    const entry = entryFor(DAYS[(start + inDays) % 7], hours);
    if (entry?.opens && entry.closes) return { kind: 'closed', next: { day: entry.day, opens: entry.opens } };
  }
  return { kind: 'closed' };
}

/**
 * The status line: "Doors open at 5pm", "Open · last call 1:30am", "Last call in 20 minutes",
 * "After last call · doors close at 2am" or "Closed tonight · doors open Tuesday at 5pm".
 */
export function statusText(status: Status): string {
  switch (status.kind) {
    case 'open': return `Open · last call ${formatTime(status.lastCall)}`;
    case 'last-call': return status.minutesToLastCall <= 1 ? 'Last call in a minute' : `Last call in ${status.minutesToLastCall} minutes`;
    case 'after-last-call': return `After last call · doors close at ${formatTime(status.closes)}`;
    case 'before-doors': return `Doors open at ${formatTime(status.opens)}`;
    case 'closed': return status.next ? `Closed tonight · doors open ${status.next.day} at ${formatTime(status.next.opens)}` : 'Closed';
  }
}

/** True while the doors are open (including after last call). */
export function isOpen(status: Status): status is Extract<Status, { night: Day }> {
  return status.kind === 'open' || status.kind === 'last-call' || status.kind === 'after-last-call';
}

export interface TonightMusic {
  set: MusicNight;
  /** True while the set is on. */
  playing: boolean;
}

/**
 * Tonight's music, or null when there's no set tonight or it has finished. "Tonight" is the night
 * the lounge is open for, so a set that runs past midnight is still tonight's at 12:30am.
 */
export function musicTonight(day: Day, minutes: number, status: Status, music: MusicNight[] = lounge.music, hours: OpeningHours[] = lounge.hours): TonightMusic | null {
  if (status.kind === 'closed') return null;
  const night = isOpen(status) ? status.night : day;
  const entry = entryFor(night, hours);
  const set = music.find(item => item.day === night);
  if (!set || !entry?.opens) return null;
  const now = night === day ? minutes : minutes + MINUTES_PER_DAY;
  const starts = nightMinutes(set.starts, entry.opens);
  const ends = nightMinutes(set.ends, entry.opens);
  if (now >= ends) return null;
  return { set, playing: now >= starts };
}

/** "Live jazz with the Acme Trio from 9pm", or "… until 11:30pm" while it's playing. */
export function musicText(tonight: TonightMusic): string {
  const { set, playing } = tonight;
  return `Live ${set.genre} with ${set.act} ${playing ? `until ${formatTime(set.ends)}` : `from ${formatTime(set.starts)}`}`;
}

/** "8:30pm – 11:30pm". */
export function setTimes(set: MusicNight): string {
  return `${formatTime(set.starts)} – ${formatTime(set.ends)}`;
}

/** Current weekday and minutes after midnight in an IANA time zone. */
export function localNow(timeZone: string, now = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  return { day: DAYS.includes(day) ? day : 'Monday', minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}
