import { PrismaClient } from '../generated/prisma';
import { CryptService } from '../src/modules/crypt/crypt.service';

const prisma = new PrismaClient();
const cryptService = new CryptService();

async function main() {
  await seedUser();
}

async function seedUser() {
  await prisma.user.deleteMany();

  const password = '1234';
  const salt = await cryptService.generateSalt();
  const hashedPassword = await cryptService.hash(password, salt);

  await prisma.user.createMany({
    data: [
      { email: 'sanek@example.com', hashedPassword },
      { email: 'oleg@example.com', hashedPassword },
      { email: 'serega@example.com', hashedPassword },
      { email: 'mihan@example.com', hashedPassword },
      { email: 'vovan@example.com', hashedPassword },
      { email: 'yana@example.com', hashedPassword },
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
