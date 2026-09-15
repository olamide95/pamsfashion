/**
 * One-time content seed for Pam's Fashion Academy.
 *
 * Populates Firestore with the courses described in the academy's existing
 * content (README section "Existing academy content") so the site isn't
 * empty on first launch. Safe to re-run — it upserts by slug rather than
 * duplicating documents.
 *
 * Usage:
 *   1. Download a Firebase service account key (Project Settings ->
 *      Service Accounts -> Generate new private key) and save it as
 *      scripts/service-account.json (already git-ignored).
 *   2. npm run seed
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import path from "path";

const serviceAccountPath = path.join(__dirname, "service-account.json");

let serviceAccount: object;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
} catch {
  console.error(
    `\nCould not read ${serviceAccountPath}.\n` +
      "Download a service account key from Firebase Console -> Project Settings -> " +
      "Service Accounts -> Generate new private key, and save it at that path.\n"
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount as never) });
const db = getFirestore();

interface SeedCourse {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  outcomes: string[];
  requirements: string[];
  duration: string;
  format: "online" | "physical" | "hybrid";
  category?: string;
  isFree: boolean;
  price: number;
}

const courses: SeedCourse[] = [
  {
    slug: "beginners-fashion-design",
    title: "Fashion Design Fundamentals",
    shortDescription:
      "A hands-on introduction to fashion design for complete beginners — sketching, fabric and first garments.",
    fullDescription:
      "This foundational course introduces the core skills every fashion designer needs: sketching your ideas, understanding fabric, and constructing your first garments. You'll build the confidence and technical grounding to move into more advanced study.",
    outcomes: [
      "Sketch and communicate a design idea",
      "Understand fabric types and how they behave",
      "Construct simple garments from start to finish",
      "Use basic design studio tools and equipment",
    ],
    requirements: ["No prior experience required", "Notebook for sketching"],
    duration: "8 weeks",
    format: "physical",
    isFree: false,
    price: 0,
  },
  {
    slug: "fashion-business",
    title: "Managing a Fashion Brand",
    shortDescription: "Learn how to plan, launch and run a sustainable fashion business.",
    fullDescription:
      "Talent alone doesn't build a fashion brand — this course covers the business side: costing collections, sourcing, pricing, marketing and managing a small fashion label from the ground up.",
    outcomes: [
      "Price and cost a collection",
      "Build a basic brand and marketing plan",
      "Understand sourcing and supplier relationships",
      "Plan a product launch",
    ],
    requirements: ["Some familiarity with fashion design is helpful but not required"],
    duration: "6 weeks",
    format: "hybrid",
    category: "Fashion Business",
    isFree: false,
    price: 0,
  },
  {
    slug: "fashion-branding",
    title: "Building a Fashion Brand",
    shortDescription: "Develop a distinctive visual and market identity for your fashion label.",
    fullDescription:
      "From mood boards to a finished brand identity, this course walks through defining your aesthetic point of view and translating it into a cohesive, marketable fashion brand.",
    outcomes: [
      "Define a brand's visual identity",
      "Build a lookbook and mood board",
      "Position a brand within the market",
    ],
    requirements: [],
    duration: "5 weeks",
    format: "hybrid",
    category: "Fashion Branding",
    isFree: false,
    price: 0,
  },
  {
    slug: "professional-sewing",
    title: "Advanced Garment Construction",
    shortDescription: "Master professional sewing techniques for polished, industry-grade garments.",
    fullDescription:
      "This advanced sewing course builds on foundational skills with techniques used in professional ateliers — tailoring, finishing, and construction methods for a range of fabrics and garment types.",
    outcomes: [
      "Apply professional finishing techniques",
      "Work confidently across fabric types",
      "Construct tailored garments",
    ],
    requirements: ["Beginners Class or equivalent experience"],
    duration: "10 weeks",
    format: "physical",
    isFree: false,
    price: 0,
  },
  {
    slug: "pattern-making",
    title: "Pattern Making",
    shortDescription: "Learn to draft, grade and adapt patterns for custom garment design.",
    fullDescription:
      "Pattern making is the technical backbone of fashion design. This course teaches drafting from measurements, grading across sizes, and adapting patterns to bring original designs to life.",
    outcomes: [
      "Draft a basic pattern block",
      "Grade a pattern across sizes",
      "Adapt patterns for original designs",
    ],
    requirements: [],
    duration: "8 weeks",
    format: "physical",
    isFree: false,
    price: 0,
  },
  {
    slug: "fashion-illustration",
    title: "Fashion Illustration",
    shortDescription: "Develop the illustration skills to communicate fashion ideas on paper.",
    fullDescription:
      "Learn to draw the fashion figure, render fabric and texture, and develop a personal illustration style used to pitch and present design concepts.",
    outcomes: [
      "Draw fashion figures in proportion",
      "Render fabric texture and movement",
      "Develop a personal illustration style",
    ],
    requirements: [],
    duration: "6 weeks",
    format: "online",
    isFree: true,
    price: 0,
  },
  {
    slug: "sustainable-fashion",
    title: "Sustainable Fashion",
    shortDescription: "Design responsibly — sustainable fabrics, low-waste patterns and ethical production.",
    fullDescription:
      "This programme covers sustainable fabric selection, low-waste pattern making, natural dyeing techniques, and ethical production practices — equipping designers to build brands that respect people and the planet.",
    outcomes: [
      "Select sustainable fabrics",
      "Apply low-waste pattern making techniques",
      "Use natural dyeing methods",
      "Evaluate ethical production practices",
    ],
    requirements: [],
    duration: "6 weeks",
    format: "hybrid",
    category: "Sustainable Fashion",
    isFree: false,
    price: 0,
  },
  {
    slug: "upcycling-and-repurposing",
    title: "Upcycling and Repurposing",
    shortDescription: "Transform existing garments and materials into new, zero-waste designs.",
    fullDescription:
      "Covering deconstruction methods, creative reconstruction, vintage and thrift transformations, and zero-waste design principles, this programme teaches designers to see new possibility in existing materials.",
    outcomes: [
      "Deconstruct existing garments",
      "Creatively reconstruct new pieces",
      "Transform vintage and thrifted finds",
      "Apply zero-waste design principles",
    ],
    requirements: [],
    duration: "4 weeks",
    format: "physical",
    category: "Sustainable Fashion",
    isFree: false,
    price: 0,
  },
];

async function seed() {
  const coursesRef = db.collection("courses");

  for (const [index, course] of courses.entries()) {
    const existing = await coursesRef.where("slug", "==", course.slug).limit(1).get();
    const data = {
      ...course,
      currency: "NGN",
      status: "published" as const,
      order: index,
      updatedAt: Timestamp.now(),
    };

    if (existing.empty) {
      await coursesRef.add({ ...data, createdAt: Timestamp.now() });
      console.log(`Created: ${course.title}`);
    } else {
      await existing.docs[0].ref.update(data);
      console.log(`Updated: ${course.title}`);
    }
  }

  console.log("\nSeed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
