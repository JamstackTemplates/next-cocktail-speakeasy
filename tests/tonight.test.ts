// Opening hours, last call, tonight's status line and tonight's music.
// The sample hours: closed Sunday and Monday, 17:00–01:00 Tuesday to Thursday, 17:00–02:00 Friday
// and Saturday, last call 30 minutes before close.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DAYS, lounge, type MusicNight, type OpeningHours } from '../content/lounge.ts';
import {
  closesAfterMidnight, formatHours, formatTime, groupedHours, lastCallTime, localNow, musicDaysSummary, musicTonight,
  musicText, nightMinutes, openDaysSummary, setTimes, statusAt, statusText, toMinutes,
} from '../lib/tonight.ts';

const at = (time: string) => toMinutes(time);
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

const week: OpeningHours[] = [
  { day: 'Monday' },
  { day: 'Tuesday', opens: '17:00', closes: '01:00' },
  { day: 'Wednesday', opens: '17:00', closes: '01:00' },
  { day: 'Thursday', opens: '17:00', closes: '01:00' },
  { day: 'Friday', opens: '17:00', closes: '02:00' },
  { day: 'Saturday', opens: '17:00', closes: '02:00' },
  { day: 'Sunday' },
];
const music: MusicNight[] = [
  { day: 'Thursday', starts: '21:00', ends: '23:30', act: 'the Brass Lamp Trio', genre: 'jazz' },
  { day: 'Saturday', starts: '22:00', ends: '01:00', act: 'Celeste Arden', genre: 'piano' },
];
const status = (day: (typeof DAYS)[number], time: string) => statusAt(day, at(time), week, 30);
const line = (day: (typeof DAYS)[number], time: string) => statusText(status(day, time));
const tonight = (day: (typeof DAYS)[number], time: string) => musicTonight(day, at(time), status(day, time), music, week);

test('opening hours list each day once with valid times', () => {
  assert.deepEqual(lounge.hours.map(entry => entry.day), [...DAYS], 'List Monday to Sunday once each, in order');
  assert.ok(lounge.hours.some(entry => entry.opens), 'Open at least one night');
  for (const entry of lounge.hours) {
    assert.equal(Boolean(entry.opens), Boolean(entry.closes), `${entry.day}: set both opens and closes, or neither`);
    if (!entry.opens || !entry.closes) continue;
    assert.match(entry.opens, TIME, `${entry.day}.opens must be "HH:MM"`);
    assert.match(entry.closes, TIME, `${entry.day}.closes must be "HH:MM"`);
    assert.notEqual(entry.opens, entry.closes, `${entry.day}: opens and closes can't be the same time`);
    if (closesAfterMidnight(entry)) {
      assert.ok(toMinutes(entry.closes) <= 6 * 60, `${entry.day} closes at ${entry.closes}, before it opens: that's read as after midnight, so keep it before 06:00`);
      const next = lounge.hours[(DAYS.indexOf(entry.day) + 1) % 7];
      assert.ok(!next.opens || toMinutes(next.opens) >= toMinutes(entry.closes), `${entry.day}'s late night runs into ${next.day}'s opening`);
    }
  }
  const length = (entry: OpeningHours) => nightMinutes(entry.closes!, entry.opens!) - toMinutes(entry.opens!);
  assert.ok(Number.isInteger(lounge.lastCallMinutes) && lounge.lastCallMinutes >= 0, 'lastCallMinutes must be a whole number of minutes');
  for (const entry of lounge.hours.filter(entry => entry.opens)) {
    assert.ok(lounge.lastCallMinutes < length(entry), `lastCallMinutes (${lounge.lastCallMinutes}) is longer than ${entry.day}'s opening hours`);
  }
});

test('music nights fall on open days, within opening hours (including after midnight)', () => {
  const days = lounge.music.map(set => set.day);
  assert.deepEqual(days.filter((day, index) => days.indexOf(day) !== index), [], 'One music set per day: combine acts into one entry');
  for (const set of lounge.music) {
    const label = `music on ${set.day} (${set.act})`;
    assert.ok(DAYS.includes(set.day), `${label}: unknown day`);
    assert.match(set.starts, TIME, `${label}: starts must be "HH:MM"`);
    assert.match(set.ends, TIME, `${label}: ends must be "HH:MM"`);
    assert.ok(set.act.trim() && set.genre.trim(), `${label}: needs an act and a genre`);
    assert.equal(set.genre, set.genre.toLowerCase(), `${label}: write the genre in lowercase, e.g. "jazz"`);
    const hours = lounge.hours.find(entry => entry.day === set.day);
    assert.ok(hours?.opens && hours.closes, `${label}: ${set.day} is a closed day`);
    const opens = hours.opens!;
    const [starts, ends, closes] = [set.starts, set.ends, hours.closes!].map(time => nightMinutes(time, opens));
    assert.ok(starts >= toMinutes(opens), `${label}: starts before the doors open at ${opens}`);
    assert.ok(ends > starts, `${label}: ends before it starts`);
    assert.ok(ends <= closes, `${label}: ends at ${set.ends}, after closing at ${hours.closes}`);
  }
});

test('times, hours and last call read naturally', () => {
  assert.equal(formatTime('17:00'), '5pm');
  assert.equal(formatTime('00:30'), '12:30am');
  assert.equal(formatTime('01:30'), '1:30am');
  assert.equal(formatTime('00:00'), 'midnight');
  assert.equal(formatTime('12:00'), 'noon');
  assert.equal(formatHours({ day: 'Friday', opens: '17:00', closes: '02:00' }), '5pm – 2am');
  assert.equal(formatHours({ day: 'Monday' }), 'Closed');
  assert.equal(lastCallTime('02:00', 30), '01:30');
  assert.equal(lastCallTime('00:00', 30), '23:30');
  assert.equal(lastCallTime('01:00', 45), '00:15');
  assert.ok(closesAfterMidnight({ day: 'Friday', opens: '17:00', closes: '02:00' }));
  assert.ok(!closesAfterMidnight({ day: 'Friday', opens: '17:00', closes: '23:00' }));
  assert.equal(setTimes(music[1]), '10pm – 1am');
});

test('hours group open nights first, with last call, and closed days together', () => {
  assert.deepEqual(groupedHours(week, 30), [
    { label: 'Tue – Thu', hours: '5pm – 1am', lastCall: '12:30am', late: true, closed: false },
    { label: 'Fri – Sat', hours: '5pm – 2am', lastCall: '1:30am', late: true, closed: false },
    { label: 'Sun – Mon', hours: 'Closed', lastCall: '', late: false, closed: true },
  ]);
  assert.equal(openDaysSummary(week), 'Open Tuesday to Saturday from 5pm');
  assert.equal(musicDaysSummary(music), 'Thu & Sat');
  assert.equal(musicDaysSummary([]), '');
});

test('before the doors open', () => {
  assert.deepEqual(status('Tuesday', '15:00'), { kind: 'before-doors', opens: '17:00' });
  assert.equal(line('Tuesday', '15:00'), 'Doors open at 5pm');
  // After Tuesday's late close, Wednesday's doors open later the same day.
  assert.equal(line('Wednesday', '03:00'), 'Doors open at 5pm');
});

test('during service the line gives last call', () => {
  const state = status('Tuesday', '21:00');
  assert.equal(state.kind, 'open');
  assert.equal(line('Tuesday', '17:00'), 'Open · last call 12:30am');
  assert.equal(line('Friday', '21:00'), 'Open · last call 1:30am');
});

test('the last-call window counts down, then the doors stay open until close', () => {
  assert.equal(line('Saturday', '00:59'), 'Open · last call 1:30am');
  assert.equal(line('Saturday', '01:00'), 'Last call in 30 minutes');
  assert.equal(line('Saturday', '01:10'), 'Last call in 20 minutes');
  assert.equal(line('Saturday', '01:29'), 'Last call in a minute');
  assert.equal(line('Saturday', '01:30'), 'After last call · doors close at 2am');
  assert.equal(line('Saturday', '01:59'), 'After last call · doors close at 2am');
  const closing = status('Saturday', '01:45');
  assert.ok(closing.kind === 'after-last-call' && closing.night === 'Friday' && closing.minutesToClose === 15);
  // A weeknight's last call is just after midnight.
  assert.equal(line('Wednesday', '00:10'), 'Last call in 20 minutes');
});

test('after midnight on a late night it is still the night before', () => {
  const state = status('Saturday', '00:30');
  assert.ok(state.kind === 'open' && state.night === 'Friday' && state.closes === '02:00' && state.lastCall === '01:30');
  // Saturday's own late night runs into Sunday, a closed day.
  assert.equal(status('Sunday', '01:15').kind, 'last-call');
  assert.equal(line('Sunday', '00:30'), 'Open · last call 1:30am');
});

test('closed days are skipped to the next opening', () => {
  assert.equal(line('Sunday', '02:00'), 'Closed tonight · doors open Tuesday at 5pm');
  assert.equal(line('Sunday', '20:00'), 'Closed tonight · doors open Tuesday at 5pm');
  assert.equal(line('Monday', '18:00'), 'Closed tonight · doors open Tuesday at 5pm');
  assert.equal(line('Monday', '00:30'), 'Closed tonight · doors open Tuesday at 5pm');
  // Wrapping round the week, and no hours at all.
  const onlyFriday: OpeningHours[] = [{ day: 'Friday', opens: '17:00', closes: '23:00' }];
  assert.equal(statusText(statusAt('Friday', at('23:30'), onlyFriday, 30)), 'Closed tonight · doors open Friday at 5pm');
  assert.deepEqual(statusAt('Monday', 600, [], 30), { kind: 'closed' });
  assert.equal(statusText({ kind: 'closed' }), 'Closed');
});

test('a midnight close ends exactly at midnight', () => {
  const late: OpeningHours[] = [{ day: 'Monday', opens: '18:00', closes: '00:00' }, { day: 'Tuesday', opens: '18:00', closes: '00:00' }];
  assert.equal(statusText(statusAt('Monday', at('23:40'), late, 30)), 'After last call · doors close at midnight');
  assert.equal(statusText(statusAt('Monday', at('23:15'), late, 30)), 'Last call in 15 minutes');
  assert.equal(statusAt('Tuesday', at('00:00'), late, 30).kind, 'before-doors');
});

test('tonight’s music: upcoming, playing, then gone', () => {
  const before = tonight('Thursday', '18:00');
  assert.ok(before && !before.playing);
  assert.equal(musicText(before), 'Live jazz with the Brass Lamp Trio from 9pm');
  // Before the doors open, the evening's set is already "tonight".
  assert.equal(tonight('Thursday', '12:00')?.playing, false);
  const during = tonight('Thursday', '22:00');
  assert.ok(during?.playing);
  assert.equal(musicText(during), 'Live jazz with the Brass Lamp Trio until 11:30pm');
  assert.equal(tonight('Thursday', '23:30'), null);
});

test('a music set that crosses midnight is still tonight’s', () => {
  assert.equal(tonight('Saturday', '21:00')?.playing, false);
  assert.equal(tonight('Saturday', '23:50')?.playing, true);
  const late = tonight('Sunday', '00:30');
  assert.ok(late?.playing && late.set.day === 'Saturday', '12:30am Sunday is still Saturday night’s set');
  assert.equal(musicText(late), 'Live piano with Celeste Arden until 1am');
  assert.equal(tonight('Sunday', '01:05'), null);
});

test('a night with no music, and closed nights, have no music line', () => {
  assert.equal(tonight('Tuesday', '20:00'), null);
  assert.equal(tonight('Friday', '20:00'), null);
  assert.equal(tonight('Monday', '20:00'), null);
  // 12:30am Friday is Thursday night after its set has ended.
  assert.equal(tonight('Friday', '00:30'), null);
});

test('the local clock reads the lounge’s time zone, not the visitor’s', () => {
  // 07:30 UTC on Saturday 2026-01-17 is 01:30 Saturday in New Orleans (UTC−6 in winter).
  assert.deepEqual(localNow('America/Chicago', new Date('2026-01-17T07:30:00Z')), { day: 'Saturday', minutes: 90 });
  // In summer (UTC−5), 04:59 UTC Saturday is still 23:59 Friday.
  assert.deepEqual(localNow('America/Chicago', new Date('2026-07-18T04:59:00Z')), { day: 'Friday', minutes: 23 * 60 + 59 });
});
