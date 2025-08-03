import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await seedUser();
}

async function seedUser() {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { email: 'sanek@example.com', password: '3333' },
      { email: 'oleg@example.com', password: '4444' },
      { email: 'serega@example.com', password: '55555' },
      { email: 'mihan@example.com', password: '666666' },
      { email: 'vovan@example.com', password: '777777' },
      { email: 'yana@example.com', password: '8888888' },
    ],
  });

  console.log('User seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
      async () => {
      await prisma.$disconnect();
    }
  });
