const { randomBytes, scryptSync } = require("node:crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const KEY_LENGTH = 64;

function hashPassword(rawPassword) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(rawPassword, salt, KEY_LENGTH).toString("hex");
  return `s1:${salt}:${hash}`;
}

async function main() {
  const email = "admin@orderwa.local";
  const sellerName = "Admin";
  const passwordHash = hashPassword("Admin123!");

  await prisma.sellerAccount.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
      sellerName,
    },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      sellerName,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
