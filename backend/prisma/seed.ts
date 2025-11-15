// backend/prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordPlain = 'Password123!';
  const hashed = await bcrypt.hash(passwordPlain, 10);

  const users = [
    { name: 'Admin User', email: 'admin@hrgenius.local', role: Role.ADMIN },
    { name: 'HR User', email: 'hr@hrgenius.local', role: Role.HR },
    { name: 'Manager User', email: 'manager@hrgenius.local', role: Role.MANAGER },
    { name: 'Employee User', email: 'employee@hrgenius.local', role: Role.EMPLOYEE },
  ];

  for (const u of users) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (!exists) {
      await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          password: hashed,
          role: u.role,
        },
      });
      console.log(`Created: ${u.email}`);
    } else {
      console.log(`Already exists: ${u.email}`);
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
