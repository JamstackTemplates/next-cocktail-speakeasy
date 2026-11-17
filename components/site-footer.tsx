import { ageLine, formatAddress, lounge, publicLinks, telHref } from '../content/lounge';
import { groupedHours } from '../lib/tonight';
import { Diamond, Fan } from './deco';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

/**
 * A symmetrical deco plinth: a stepped top edge traced by a gold rule, then the hours with last call,
 * the address, the age policy, links and the credit, all centred on the page's axis.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-(--space-section)">
      <svg className="plinth-edge" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path className="plinth-fill" d="M0 40 V30 H180 V20 H330 V10 H470 V0 H730 V10 H870 V20 H1020 V30 H1200 V40 Z" />
        <path className="plinth-rule" vectorEffect="non-scaling-stroke" d="M0 30.5 H180.5 V20.5 H330.5 V10.5 H470.5 V0.75 H729.5 V10.5 H869.5 V20.5 H1019.5 V30.5 H1200" />
      </svg>
      <div className="plinth">
        <div className="column grid justify-items-center gap-7 pt-6 pb-10 text-center">
          <Fan width={72} className="text-gold" />
          <p className="font-display text-[clamp(2rem,5vw,2.6rem)] leading-none text-ink">{lounge.name}</p>

          <div className="grid w-full gap-8 sm:grid-cols-2 sm:gap-0">
            <section aria-labelledby="footer-hours" className="sm:border-r sm:border-line sm:pr-8">
              <h2 id="footer-hours" className="caps text-[.78rem] text-gold-ink">Hours</h2>
              <ul className="mt-3 grid gap-2">
                {groupedHours().map(group => (
                  <li key={group.label}>
                    <span className="caps block text-[.78rem]">{group.label}</span>
                    <span className="figures block text-[1.1rem]">{group.hours}</span>
                    {group.lastCall ? <span className="block text-[.98rem] text-muted italic">last call {group.lastCall}</span> : null}
                  </li>
                ))}
              </ul>
              <TimeZoneNote className="text-muted" />
            </section>
            <section aria-labelledby="footer-visit" className="sm:pl-8">
              <h2 id="footer-visit" className="caps text-[.78rem] text-gold-ink">Visit</h2>
              <address className="mt-3 text-[1.1rem] leading-relaxed not-italic">
                {formatAddress()}<br />
                {lounge.phone ? <><a className="footer-link figures" href={telHref()}>{lounge.phone}</a><br /></> : null}
                <a className="footer-link" href={`mailto:${lounge.email}`}>{lounge.email}</a>
              </address>
              <p className="caps mt-4 inline-flex items-center gap-2 border border-gold px-3 py-1.5 text-[.74rem] text-ink">
                <Diamond className="text-gold" />{ageLine()}<Diamond className="text-gold" />
              </p>
            </section>
          </div>

          <ul className="caps flex flex-wrap justify-center gap-x-6 gap-y-2 text-[.76rem]">
            <li><SiteLink className="footer-link" href="/menu/">Menu</SiteLink></li>
            <li><SiteLink className="footer-link" href="/#find-the-door">Find the door</SiteLink></li>
            <li><SiteLink className="footer-link" href="/#this-week">Music</SiteLink></li>
            <li><SiteLink className="footer-link" href="/contact/">Private hire</SiteLink></li>
            {publicLinks.map(link => <li key={link.url}><a className="footer-link" href={link.url} rel="me noopener">{link.label}</a></li>)}
          </ul>

          <p className="grid justify-items-center gap-1 text-[.95rem] text-muted">
            <span>© {year} {lounge.name} · Please drink responsibly</span>
            <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-accent hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
          </p>
        </div>
      </div>
    </footer>
  );
}
