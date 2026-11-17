import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { Diamond } from '../../components/deco';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { lounge, telHref } from '../../content/lounge';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Private hire, large parties & events',
  description: `Private hire, parties of seven or more and events at ${lounge.name}.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const tips = ['The date and time', 'Number of guests', 'The occasion', 'The whole room or a section', 'Any dietary needs'];

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  return (
    <>
      <PageHead eyebrow="Get in touch" title="Private hire, large parties & events">
        <p>
          Walk-ins are seated first come, first served, and parties of up to six never need to get in touch. For seven or
          more, a birthday, a launch or the whole room to yourselves, send us a message.
        </p>
        <p>A message is an enquiry: nothing is booked until we reply to confirm.</p>
      </PageHead>

      <div className="column grid gap-10">
        <section className="deco-frame p-2 print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={lounge.email} />
          ) : (
            <div className="grid justify-items-center gap-4 bg-surface px-[clamp(1.25rem,4vw,2.75rem)] py-[clamp(2rem,5vw,3rem)] text-center">
              <h2 className="section-title text-[clamp(1.2rem,3vw,1.5rem)]">Write to us directly</h2>
              <p className="max-w-[32rem] text-muted">
                Email is the best way to reach us about private hire and large parties. Tell us the date, how many guests and
                what you have in mind, and we’ll reply with ideas and prices.
              </p>
              <p><a className="button" href={`mailto:${lounge.email}?subject=${encodeURIComponent('Private hire enquiry')}`}>Email {lounge.name}</a></p>
            </div>
          )}
        </section>

        <div className="mirrored">
          <section className="text-center" aria-labelledby="direct-title">
            <h2 id="direct-title" className="caps text-[.86rem] text-gold-ink">Email</h2>
            <p className="mt-2 text-[1.3rem] wrap-anywhere"><a className="text-link" href={`mailto:${lounge.email}`}>{lounge.email}</a></p>
            <p className="mt-2 flex min-h-px flex-wrap items-center justify-center gap-x-4 gap-y-2"><CopyEmail email={lounge.email} /></p>
            {lounge.phone ? (
              <>
                <h2 className="caps mt-7 text-[.86rem] text-gold-ink">Phone</h2>
                <p className="mt-2"><a className="text-link figures text-[1.3rem]" href={telHref()}>{lounge.phone}</a></p>
                <p className="text-muted">Quick questions, or the step-free entrance.</p>
              </>
            ) : null}
          </section>
          <section className="text-center" aria-labelledby="include-title">
            <h2 id="include-title" className="caps text-[.86rem] text-gold-ink">Useful to include</h2>
            <ul className="mt-3 grid gap-2">
              {tips.map(tip => <li key={tip} className="inline-flex items-center justify-center gap-2.5"><Diamond className="text-gold" />{tip}</li>)}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
