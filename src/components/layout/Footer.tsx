import Link from "next/link";
import { Container } from "@/components/ui/Container";

const explore = [
  { href: "/about", label: "About the Academy" },
  { href: "/courses", label: "Courses" },
  { href: "/online-school", label: "Online School" },
  { href: "/gallery", label: "Gallery" },
];

const more = [
  { href: "/testimonials", label: "Testimonials" },
  { href: "/apply", label: "Apply Now" },
  { href: "/contact", label: "Contact" },
  { href: "/verify-certificate", label: "Verify a Certificate" },
];

export function Footer() {
  return (
    <footer className="bg-black text-ivory">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <span className="font-display text-xl">
            Pam&rsquo;s <span className="text-accent">Fashion Academy</span>
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-ivory/60">
            Nurturing creativity and skill in the world of fashion — from first
            sketch to finished collection.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/50">Explore</h3>
          <ul className="flex flex-col gap-3">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ivory/75 hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/50">More</h3>
          <ul className="flex flex-col gap-3">
            {more.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ivory/75 hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/50">Visit Us</h3>
          <address className="flex flex-col gap-2 text-sm not-italic text-ivory/75">
            <span>Ahmadu Bello Way, Kado,</span>
            <span>Abuja, Nigeria</span>
            <a href="tel:+2347049195181" className="hover:text-accent">
              +234 704 919 5181
            </a>
            <a href="mailto:info@Pamsfashionacademy.com" className="hover:text-accent">
              info@Pamsfashionacademy.com
            </a>
          </address>
        </div>
      </Container>

      <div className="border-t border-ivory/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-ivory/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Pam&rsquo;s Fashion Academy. All rights reserved.</p>
          <p>Designed with intention, for makers of tomorrow.</p>
        </Container>
      </div>
    </footer>
  );
}
