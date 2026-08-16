// Idempotent supplementary seed for the new M3/M4 features:
//  - links the EMPLOYEE login account to an Employee record (self-service)
//  - seeds the default document templates
// Usage: npm run seed:extras

import "../src/config/loadEnv";
import { prisma } from "../src/prisma/client";

const EMPLOYEE_EMAIL = "youssrarimyassmine@gmail.com";

const TEMPLATES: { type: string; name: string; guidance: string }[] = [
  {
    type: "promotion",
    name: "Promotion Letter",
    guidance:
      "Warmly congratulate the employee on their promotion. State the new position clearly and the effective date. Keep an encouraging, official tone.",
  },
  {
    type: "salary",
    name: "Salary Certificate",
    guidance:
      "Certify the employee's current position and gross monthly salary for administrative purposes. Neutral, factual, official tone.",
  },
  {
    type: "leave",
    name: "Leave Approval",
    guidance:
      "Confirm approval of the employee's leave, including the type and dates. Reference the company leave policy. Polite and official.",
  },
  {
    type: "employment",
    name: "Employment Certificate",
    guidance:
      "Certify that the employee is currently employed, stating their position, department and start date. Formal and factual.",
  },
];

async function main() {
  // 1) Link the EMPLOYEE user to an Employee record
  const user = await prisma.user.findUnique({ where: { email: EMPLOYEE_EMAIL } });
  if (user) {
    let employee = await prisma.employee.findFirst({ where: { userId: user.id } });
    if (!employee) {
      // reuse an employee with the same email, else attach to the first unlinked one
      employee =
        (await prisma.employee.findUnique({ where: { email: EMPLOYEE_EMAIL } })) ||
        (await prisma.employee.findFirst({ where: { userId: null } }));

      if (employee) {
        await prisma.employee.update({ where: { id: employee.id }, data: { userId: user.id } });
        console.log(`✔ Linked user ${EMPLOYEE_EMAIL} → employee #${employee.id} (${employee.name})`);
      } else {
        const created = await prisma.employee.create({
          data: {
            name: user.name,
            email: EMPLOYEE_EMAIL,
            position: "Software Engineer",
            department: "IT",
            salary: 18000,
            userId: user.id,
          },
        });
        console.log(`✔ Created + linked employee #${created.id} for ${EMPLOYEE_EMAIL}`);
      }
    } else {
      console.log(`• Employee already linked for ${EMPLOYEE_EMAIL} (#${employee.id})`);
    }
  } else {
    console.log(`⚠ EMPLOYEE user ${EMPLOYEE_EMAIL} not found — run the main seed first.`);
  }

  // 2) Seed default document templates
  for (const t of TEMPLATES) {
    await prisma.documentTemplate.upsert({
      where: { type: t.type },
      update: {}, // don't overwrite edits made in the UI
      create: t,
    });
  }
  console.log(`✔ Ensured ${TEMPLATES.length} document templates`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("seedExtras failed:", e?.message || e);
    process.exit(1);
  });
