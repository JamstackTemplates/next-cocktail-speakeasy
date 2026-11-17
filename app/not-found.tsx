import type { Metadata } from 'next';
import { DoorStepArt } from '../components/deco';
import { PageHead } from '../components/page-head';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Wrong door',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <PageHead id="not-found-title" eyebrow="404" title="Wrong door…"
        before={<DoorStepArt art="door" className="size-24" />}>
        <p>This one doesn’t open. The link may be out of date, or the page may have moved. Try one of these instead:</p>
      </PageHead>
      <ul className="column flex flex-wrap justify-center gap-3">
        <li><SiteLink href="/" className="button">Home</SiteLink></li>
        <li><SiteLink href="/#find-the-door" className="button button-ghost">Find the door</SiteLink></li>
        <li><SiteLink href="/menu/" className="button button-ghost">The menu</SiteLink></li>
      </ul>
    </section>
  );
}
