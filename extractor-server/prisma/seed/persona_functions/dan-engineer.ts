import db from '../../../config/db/queries.ts';
import dotenv from 'dotenv';

dotenv.config();

// Needed for testing later
export default async function seedDanEngineer() {
  const dan = await db.addUser({
    email: 'dan.engineer@example.com',
    name: 'Dan Engineer',
    password: process.env.PASSWORD_DAN_ENGINEER as string, // hash it beforehand
    role: 'USER',
    userType: 'PROFESSIONAL',
    professionalField: 'ENGINEERING',
  });

  await db.createAuditLog(dan.id, 'User signed up');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago

  // End in 3 days
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 3);

  await db.createSubscription(dan.id, 'PRO', 'ACTIVE', startDate, endDate);

  //   Renewing subscription
  await db.createPayment({
    userId: dan.id,
    amount: 4.99,
    status: 'FAILED',
    type: 'SUBSCRIPTION',
  });
}
