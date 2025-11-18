// backend/prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // -----------------------------------------
  // CREATE SYSTEM USERS (admin, hr, manager, employee)
  // -----------------------------------------
  const passwordPlain = 'Password123!';
  const hashed = await bcrypt.hash(passwordPlain, 10);

  const systemUsers = [
    { name: 'Admin User', email: 'admin@hrgenius.local', role: Role.ADMIN },
    { name: 'HR User', email: 'hr@hrgenius.local', role: Role.HR },
    { name: 'Manager User', email: 'manager@hrgenius.local', role: Role.MANAGER },
    { name: 'Employee User', email: 'employee@hrgenius.local', role: Role.EMPLOYEE },
  ];

  for (const u of systemUsers) {
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
      console.log(`✔ Created: ${u.email}`);
    } else {
      console.log(`⚠ Already exists: ${u.email}`);
    }
  }

  // Get real relations
  const hr = await prisma.user.findUnique({ where: { email: 'hr@hrgenius.local' } });
  const manager = await prisma.user.findUnique({ where: { email: 'manager@hrgenius.local' } });

  // -----------------------------------------
  // CREATE 80 FAKE EMPLOYEES
  // -----------------------------------------

  const firstNames = [
    'Rim','Yassine','Amina','Hichem','Nabil','Imene','Sara','Walid','Mourad','Rania',
    'Zineb','Lina','Sami','Othman','Nour','Salma','Farah','Nadia','Hajar','Ayoub',
    'Karim','Soufiane','Anas','Younes','Kenza','Manal','Houda','Ayman','Leila','Meriem',
    'Amine','Brahim','Samira','Nourdin','Bilel','Rachid','Dounia','Yasmine','Nadir','Taha'
  ];

  const lastNames = [
    'Bouzid','Cherif','BenAli','Haddad','Mansouri','Amrani','Berrada','Zohraoui','Khalfallah','Gacem',
    'Fassi','ElAmrani','Touil','Sahli','Merabet','Chakiri','Saidi','Benkirane','Fadili','Chouaib'
  ];

  const positions = [
    'Développeur Full-Stack','Designer UI/UX','Comptable','Responsable RH','Commercial',
    'Ingénieur Réseau','Chef de Projet','Data Analyst','Support Technique','Consultant'
  ];

  const departments = [
    'Informatique','Ressources Humaines','Finance','Commercial','Marketing'
  ];

  function randomDate(startYear: number, endYear: number) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  console.log('👥 Generating 80 employees...');

  for (let i = 0; i < 80; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${first} ${last}`;

    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@hrgenius.local`;

    const position = positions[Math.floor(Math.random() * positions.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];

    const salary = Math.floor(9000 + Math.random() * (20000 - 9000)); // 9k–20k
    const joinDate = randomDate(2018, 2025);

    await prisma.employee.create({
      data: {
        name: fullName,
        email,
        position,
        department,
        salary,
        joinedAt: joinDate,
        createdById: hr!.id,
        managerId: manager!.id,
      },
    });
  }

  console.log('🎉 80 employees created successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🌱 Seed finished.');
  });



  
