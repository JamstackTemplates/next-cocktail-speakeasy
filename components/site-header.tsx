import { DarkModeToggle } from 'jamstacks';
import { lounge } from '../content/lounge';
import { Monogram } from './deco';
import { SiteLink } from './site-link';

const link = 'nav-link';

/**
 * A centred, symmetrical header: the monogram on the axis, Menu and Find the door to its left,
 * Contact and the theme toggle to its right. On phones "Find the door" shortens to "The door".
 */
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50">
      <nav aria-label="Main" className="wide grid min-h-(--header-h) grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
        <ul className="flex items-center justify-end gap-3 xs:gap-5 sm:gap-9">
          <li><SiteLink href="/menu/" markCurrent="section" className={link}>Menu</SiteLink></li>
          <li>
            <SiteLink href="/#find-the-door" className={link} aria-label="Find the door">
              <span className="sm:hidden">The door</span><span className="max-sm:hidden">Find the door</span>
            </SiteLink>
          </li>
        </ul>
        <SiteLink href="/" className="monogram-link" aria-label={`${lounge.name}, home`}>
          <Monogram letters={lounge.monogram} className="size-11 sm:size-13" />
        </SiteLink>
        <ul className="flex items-center justify-start gap-3 xs:gap-5 sm:gap-9">
          <li><SiteLink href="/contact/" markCurrent="page" className={link}>Contact</SiteLink></li>
          <li className="flex print:hidden"><DarkModeToggle className="flex-none" /></li>
        </ul>
      </nav>
    </header>
  );
}
