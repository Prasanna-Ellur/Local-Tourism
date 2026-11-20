
const Database = require("better-sqlite3");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const prisma = new PrismaClient();

const dbPath = path.join(__dirname, "backups", "dev-backup.db");
const sqlite = new Database(dbPath, { readonly: true });

const tables = [
  { name: "User", model: "user" },
  { name: "Destination", model: "destination" },
  { name: "Category", model: "category" },
  { name: "Homestay", model: "homestay" },
  { name: "Room", model: "room" },
  { name: "HomestayImage", model: "homestayImage" },
  { name: "TourGuide", model: "tourGuide" },
  { name: "CulturalExperience", model: "culturalExperience" },
  { name: "LocalBusiness", model: "localBusiness" },
  { name: "Booking", model: "booking" },
  { name: "Payment", model: "payment" },
  { name: "Review", model: "review" },
  { name: "Availability", model: "availability" },
  { name: "Notification", model: "notification" },
];

const booleanFields = new Set([
  "isApproved", "isFeatured", "isAvailable",
  "isBooked", "isBlocked", "isRead",
]);

const dateFields = new Set([
  "createdAt", "updatedAt", "date",
  "checkInDate", "checkOutDate", "startDate",
  "cancelledAt", "paidAt", "respondedAt",
]);

function convertRow(row) {
  const converted = { ...row };

  for (const field of booleanFields) {
    if (field in converted) {
      converted[field] = Boolean(converted[field]);
    }
  }

  for (const field of dateFields) {
    if (converted[field] !== null && converted[field] !== undefined) {
      converted[field] = new Date(converted[field]);

      if (Number.isNaN(converted[field].getTime())) {
        throw new Error(`Invalid date in field: ${field}`);
      }
    }
  }

  return converted;
}

async function main() {
  console.log("Starting SQLite to Supabase migration...");
  console.log("Source:", dbPath);

  const results = await prisma.$transaction(async (tx) => {
    const report = [];

    for (const table of tables) {
      const rows = sqlite
        .prepare(`SELECT * FROM "${table.name}"`)
        .all()
        .map(convertRow);

      if (rows.length === 0) {
        report.push({ table: table.name, source: 0, inserted: 0 });
        continue;
      }

      const result = await tx[table.model].createMany({
        data: rows,
        skipDuplicates: true,
      });

      report.push({
        table: table.name,
        source: rows.length,
        inserted: result.count,
      });

      console.log(
        `${table.name}: ${result.count} inserted from ${rows.length}`
      );
    }

    return report;
  }, {
    maxWait: 10000,
    timeout: 60000,
  });

  console.log("\nMigration report:");
  console.table(results);

  console.log("\nMigration completed.");
}

main()
  .catch((error) => {
    console.error("\nMigration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await prisma.$disconnect();
  });
