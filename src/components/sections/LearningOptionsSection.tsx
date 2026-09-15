import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";

const schedule = [
  {
    label: "Morning Classes",
    time: "9:00 AM \u2013 2:00 PM",
    days: "Monday \u2013 Friday",
  },
  {
    label: "Evening Classes",
    time: "2:00 PM \u2013 6:00 PM",
    days: "Monday \u2013 Friday",
  },
];

export function LearningOptionsSection() {
  return (
    <section className="bg-ivory-deep py-24 md:py-32">
      <Container className="flex flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Learning Options"
            title="Learn in the studio, online, or both"
            description="Join us in person at our Abuja studios, or study at your own pace through the academy's online school — with the same curriculum and mentorship either way."
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-white p-8 ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl">
              <div>
                <h3 className="font-display text-2xl text-charcoal">Physical Classes</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
                  Hands-on training inside our design studios and sewing labs
                  in Abuja, working directly with instructors and peers.
                </p>
              </div>
              <LinkButton href="/apply" variant="secondary" className="w-fit">
                Apply for a physical class
              </LinkButton>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-charcoal p-8 text-ivory transition-shadow duration-300 hover:shadow-xl">
              <div>
                <h3 className="font-display text-2xl">Online Courses</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                  Learn from anywhere through the academy&rsquo;s online school
                  &mdash; video lessons, quizzes, assignments and certificates,
                  on your schedule.
                </p>
              </div>
              <LinkButton href="/online-school" variant="primary" className="w-fit">
                Visit the Online School
              </LinkButton>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="grid gap-6 border-t border-sand pt-14 sm:grid-cols-2">
            {schedule.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.2em] text-accent">
                  {item.label}
                </span>
                <span className="font-display text-2xl text-charcoal">{item.time}</span>
                <span className="text-sm text-charcoal/60">{item.days}</span>
              </div>
            ))}
            <p className="sm:col-span-2 text-sm text-charcoal/50">
              Weekend classes available upon request.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
