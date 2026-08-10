import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "What's the difference between a company guide and a property guide?",
    a: "A company guide is a process that applies across the whole business — running a background check, how the VA handles the inbox, what to do about a chargeback. A property guide belongs to one building, and you make one per audience: guests, cleaners, staff.",
  },
  {
    q: "Can a cleaner see the guest guide?",
    a: "No. Every guide has its own link, so people only ever see the one you sent them. Guest guides open as a branded welcome; team guides open as a plain index, because hospitality framing reads as odd to someone at work.",
  },
  {
    q: "Do my team or guests need accounts?",
    a: "Nobody does. Both open as a normal web page on any phone — no app, no login, and no per-seat cost for a cleaner you use twice a month.",
  },
  {
    q: "Is this any good for onboarding a new team member?",
    a: "It's the reason most people start. Instead of explaining everything twice, you send the company guides plus the property guides they'll work on. They read the same thing your last hire did, videos included, and you're not on the phone all week.",
  },
  {
    q: "Does it work with Airbnb, Vrbo and Booking.com?",
    a: "Yes, because it isn't tied to any of them. Paste the guest link into your welcome message on any platform, print the QR for the kitchen counter, or send it to direct-booking guests yourself.",
  },
  {
    q: "Can I change a guide after I've shared the link?",
    a: "Any time. The link stays the same and edits appear immediately, so you can fix a door code mid-stay or correct a turnaround step without resending anything.",
  },
  {
    q: "How long does this take to set up?",
    a: "A first guest guide takes most hosts under an hour, since the sections are already laid out. Team and company guides take as long as the process is — but you write each one once, for good.",
  },
  {
    q: "Are the guides private?",
    a: "Each link is unguessable, and you can add a PIN or an expiry date per guide. You can also see how many times each link has been opened, which is a useful way to tell whether the guide was actually read.",
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
