import type { SVGProps } from 'react';

export type IconName = 'pin' | 'clock' | 'phone' | 'mail' | 'arrow' | 'music' | 'glass' | 'seat' | 'access' | 'map';

const paths: Record<IconName, string> = {
  pin: 'M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7v5l3.2 2',
  phone: 'M6.6 3.8 9 3.4l1.4 4-1.9 1.4a11.5 11.5 0 0 0 6.7 6.7l1.4-1.9 4 1.4-.4 2.4a2 2 0 0 1-2.2 1.6C10.5 18.3 5.7 13.5 5 6a2 2 0 0 1 1.6-2.2Z',
  mail: 'M3.5 6.5h17v11h-17z M3.5 6.5 12 13l8.5-6.5',
  arrow: 'M4 12h15 M13.5 6.5 19 12l-5.5 5.5',
  music: 'M9 18.5V5.5l10-2v13 M9 18.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z M19 16.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z M9 9.5l10-2',
  glass: 'M5 4h14l-7 8z M12 12v8 M8 20h8 M7.5 7h9',
  seat: 'M7 4h10v8H7z M5 12h14v3H5z M7 15v5 M17 15v5',
  access: 'M12 6.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z M6 9h12 M12 9v5 M8.5 21l3.5-7 3.5 7',
  map: 'M3.5 6.5 9 4l6 2.5 5.5-2.5v13.5L15 20l-6-2.5-5.5 2.5z M9 4v13.5 M15 6.5V20',
};

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
