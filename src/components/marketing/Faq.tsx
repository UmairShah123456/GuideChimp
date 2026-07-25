import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "Do guests need to download anything?",
    a: "No. The guide opens as a normal web page on any phone, tablet or laptop. There is no app and no account — they tap your link and it's there.",
  },
  {
    q: "Does it work with Airbnb, Vrbo and Booking.com?",
    a: "Yes, because it isn't tied to any of them. Paste the link into your welcome message on any platform, or send it to direct-booking guests yourself.",
  },
  {
    q: "How long does a guide take to build?",
    a: "Most hosts get a solid first version done in under an hour. The sections are already laid out, so you're answering prompts rather than designing a document.",
  },
  {
    q: "Can I change it after I've shared the link?",
    a: "Any time. The link stays the same and edits appear immediately, so you can fix a door code mid-stay without resending anything.",
  },
  {
    q: "Can I use it for more than one property?",
    a: "Yes. Each property gets its own guide, its own link and its own QR code, all managed from one dashboard.",
  },
  {
    q: "Is the guide private?",
    a: "Each link is unguessable, and you can add a PIN or an expiry date. You can also see how many times a link has been opened.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-accent">
                Questions
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-4 text-[32px] font-medium leading-[1.08] tracking-[-0.025em] text-ink [text-wrap:balance] md:text-[40px]">
                Before you start.
              </h2>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-5 text-[15.5px] leading-relaxed text-body">
                Something not covered?{" "}
                <a
                  href="mailto:hello@guidechimp.app"
                  className="font-semibold text-accent underline decoration-accent-ring underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Email us
                </a>{" "}
                and a person will reply.
              </p>
            </Reveal>
          </div>

          {/* Plain definition list — open by default, nothing to click */}
          <dl className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <div className="border-t border-border py-6">
                  <dt className="text-[16.5px] font-medium tracking-[-0.01em] text-ink [text-wrap:balance]">
                    {f.q}
                  </dt>
                  <dd className="mt-2 text-[14.5px] leading-relaxed text-body [text-wrap:pretty]">
                    {f.a}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
