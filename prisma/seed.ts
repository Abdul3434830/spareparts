import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES_DATA = [
  {
    name: "Engine Parts",
    slug: "engine-parts",
    description: "Internal engine components, service filters, ignition, and gaskets",
    sortOrder: 1,
    subcategories: [
      { name: "Air filters", slug: "air-filters" },
      { name: "Oil filters", slug: "oil-filters" },
      { name: "Spark plugs", slug: "spark-plugs" },
      { name: "Belts", slug: "belts" },
      { name: "Gaskets", slug: "gaskets" },
      { name: "Pistons", slug: "pistons" },
      { name: "Timing kits", slug: "timing-kits" },
      { name: "Engine mounts", slug: "engine-mounts" },
    ],
  },
  {
    name: "Brakes",
    slug: "brakes",
    description: "High performance rotors, pads, calipers, and hydraulic components",
    sortOrder: 2,
    subcategories: [
      { name: "Brake pads", slug: "brake-pads" },
      { name: "Discs/Rotors", slug: "discs-rotors" },
      { name: "Calipers", slug: "calipers" },
      { name: "Brake fluid", slug: "brake-fluid" },
      { name: "Brake lines", slug: "brake-lines" },
    ],
  },
  {
    name: "Suspension & Steering",
    slug: "suspension-steering",
    description: "Shocks, struts, control arms, and steering linkages",
    sortOrder: 3,
    subcategories: [
      { name: "Shock absorbers", slug: "shock-absorbers" },
      { name: "Springs", slug: "springs" },
      { name: "Control arms", slug: "control-arms" },
      { name: "Ball joints", slug: "ball-joints" },
      { name: "Tie rods", slug: "tie-rods" },
      { name: "Bushings", slug: "bushings" },
      { name: "Steering racks", slug: "steering-racks" },
    ],
  },
  {
    name: "Transmission & Clutch",
    slug: "transmission-clutch",
    description: "Clutch assemblies, flywheels, gear components, and driveline",
    sortOrder: 4,
    subcategories: [
      { name: "Clutch kits", slug: "clutch-kits" },
      { name: "Flywheels", slug: "flywheels" },
      { name: "Gearbox parts", slug: "gearbox-parts" },
      { name: "CV joints", slug: "cv-joints" },
      { name: "Transmission oil", slug: "transmission-oil" },
    ],
  },
  {
    name: "Cooling & Heating",
    slug: "cooling-heating",
    description: "Radiators, water pumps, climate control compressors, and fans",
    sortOrder: 5,
    subcategories: [
      { name: "Radiators", slug: "radiators" },
      { name: "Water pumps", slug: "water-pumps" },
      { name: "Thermostats", slug: "thermostats" },
      { name: "Fans", slug: "fans" },
      { name: "AC compressors", slug: "ac-compressors" },
      { name: "Condensers", slug: "condensers" },
    ],
  },
  {
    name: "Exhaust",
    slug: "exhaust",
    description: "Mufflers, downpipes, catalytic converters, and sensors",
    sortOrder: 6,
    subcategories: [
      { name: "Mufflers", slug: "mufflers" },
      { name: "Catalytic converters", slug: "catalytic-converters" },
      { name: "Exhaust tips", slug: "exhaust-tips" },
      { name: "Headers", slug: "headers" },
      { name: "O2 sensors", slug: "o2-sensors" },
    ],
  },
  {
    name: "Electrical & Batteries",
    slug: "electrical-batteries",
    description: "Heavy duty batteries, alternators, starters, and sensors",
    sortOrder: 7,
    subcategories: [
      { name: "Batteries", slug: "batteries" },
      { name: "Alternators", slug: "alternators" },
      { name: "Starters", slug: "starters" },
      { name: "Sensors", slug: "sensors" },
      { name: "Ignition coils", slug: "ignition-coils" },
      { name: "Fuses", slug: "fuses" },
    ],
  },
  {
    name: "Lighting",
    slug: "lighting",
    description: "OEM and upgraded headlights, tail lights, fog lights, and LED kits",
    sortOrder: 8,
    subcategories: [
      { name: "Headlights", slug: "headlights" },
      { name: "Tail lights", slug: "tail-lights" },
      { name: "Fog lights", slug: "fog-lights" },
      { name: "Bulbs", slug: "bulbs" },
      { name: "LED/HID kits", slug: "led-hid-kits" },
    ],
  },
  {
    name: "Body Parts",
    slug: "body-parts",
    description: "Bumpers, grilles, side mirrors, fenders, and wiper systems",
    sortOrder: 9,
    subcategories: [
      { name: "Bumpers", slug: "bumpers" },
      { name: "Grilles", slug: "grilles" },
      { name: "Mirrors", slug: "mirrors" },
      { name: "Fenders", slug: "fenders" },
      { name: "Bonnets", slug: "bonnets" },
      { name: "Door handles", slug: "door-handles" },
      { name: "Wipers", slug: "wipers" },
    ],
  },
  {
    name: "Performance Parts",
    slug: "performance-parts",
    description: "Cold air intakes, ECU tuners, turbo accessories, and coilovers",
    sortOrder: 10,
    subcategories: [
      { name: "Intakes", slug: "intakes" },
      { name: "ECUs/Tuners", slug: "ecus-tuners" },
      { name: "Turbo parts", slug: "turbo-parts" },
      { name: "Sport exhausts", slug: "sport-exhausts" },
      { name: "Coilovers", slug: "coilovers" },
      { name: "Big brake kits", slug: "big-brake-kits" },
    ],
  },
  {
    name: "Oils & Fluids",
    slug: "oils-fluids",
    description: "Full synthetic engine oils, coolants, additives, and gear fluids",
    sortOrder: 11,
    subcategories: [
      { name: "Engine oil", slug: "engine-oil" },
      { name: "Coolant", slug: "coolant" },
      { name: "Additives", slug: "additives" },
      { name: "Lubricants", slug: "lubricants" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Interior upgrades, exterior styling, automotive electronics, and care",
    sortOrder: 12,
    subcategories: [
      { name: "Interior", slug: "interior" },
      { name: "Exterior", slug: "exterior" },
      { name: "Electronics", slug: "electronics" },
      { name: "Detailing", slug: "detailing" },
      { name: "Safety", slug: "safety" },
    ],
  },
];

async function main() {
  console.log("🌱 Starting idempotent database seed for CARS SPARE PARTS...");

  // 1. Seed Categories & Subcategories
  console.log("📦 Seeding 12 Categories and Subcategories...");
  for (const catData of CATEGORIES_DATA) {
    const parentCategory = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        description: catData.description,
        sortOrder: catData.sortOrder,
      },
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        sortOrder: catData.sortOrder,
      },
    });

    for (let i = 0; i < catData.subcategories.length; i++) {
      const sub = catData.subcategories[i];
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: {
          name: sub.name,
          parentId: parentCategory.id,
          sortOrder: i + 1,
        },
        create: {
          name: sub.name,
          slug: sub.slug,
          parentId: parentCategory.id,
          sortOrder: i + 1,
        },
      });
    }
  }
  console.log("✅ Categories and Subcategories seeded successfully.");

  // 2. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@carsspareparts.com";
  const rawAdminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hashedPassword = await bcrypt.hash(rawAdminPassword, 12);

  console.log(`👤 Seeding ADMIN user (${adminEmail})...`);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      isApproved: true,
    },
    create: {
      email: adminEmail,
      name: "CARS SPARE PARTS Admin",
      password: hashedPassword,
      role: Role.ADMIN,
      isApproved: true,
    },
  });

  console.log(`✅ Admin user seeded (ID: ${adminUser.id}, Email: ${adminUser.email})`);

  // 3. Seed Top Component Brands
  console.log("🏷️ Seeding Top Component Brands...");
  const { DEFAULT_BRANDS } = await import("../lib/default-brands");
  for (const b of DEFAULT_BRANDS) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        country: b.country,
        description: b.description,
      },
      create: {
        name: b.name,
        slug: b.slug,
        country: b.country,
        description: b.description,
      },
    });
  }
  console.log(`✅ ${DEFAULT_BRANDS.length} Brands seeded successfully.`);
  console.log("🎉 Idempotent seed completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
