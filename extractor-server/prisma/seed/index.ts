import prisma from '../../config/db/client.ts';
import seedAliceAdmin from './persona_functions/alice-admin.ts';
import seedBobUndergrad from './persona_functions/bob-undergrad.ts';

async function main() {
  try {
    console.log('Clearing existing data...');

    // Delete in order to avoid foreign key conflicts
    await prisma.pageVisit.deleteMany({});
    await prisma.addOn.deleteMany({});
    await prisma.monthlyUsage.deleteMany({});
    await prisma.azureQuery.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.subscription.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.user.deleteMany({});

    await seedAliceAdmin();
    console.log('Alice seeded successfully');

    await seedBobUndergrad();
    console.log('Bob seeded successfully');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    process.exit(0);
  }
}

main();
