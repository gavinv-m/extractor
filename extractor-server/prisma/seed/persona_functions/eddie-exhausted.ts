import db from '../../../config/db/queries.ts';
import dotenv from 'dotenv';
import normaliseDate from '../../../utils/date.ts';

dotenv.config();

export default async function seedEddieExhausted() {
  const eddie = await db.addUser({
    email: 'eddie.exhausted@example.com',
    name: 'Eddie Exhausted',
    password: process.env.PASSWORD_EDDIE_EXHAUSTED as string,
    role: 'USER',
    userType: 'PROFESSIONAL',
    professionalField: 'LEGAL',
  });

  await db.createAuditLog(eddie.id, 'User signed up');

  // Create active subscription
  const startDate = new Date();
  const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

  await db.createSubscription(eddie.id, 'PRO', 'ACTIVE', startDate, endDate);

  const subscriptionStart = normaliseDate(startDate);

  // Initialize monthly usage (you can set this to full credits if needed for fallback)
  await db.createMonthlyUsage(eddie.id, subscriptionStart, 1000);
  await db.createAuditLog(
    eddie.id,
    'Monthly usage initialized with 1000 pages remaining'
  );

  // Add-on purchased but fully consumed
  await db.createAddOn(eddie.id, 0);
  await db.createAuditLog(
    eddie.id,
    'Add-on initialized with 0 pages remaining'
  );

  // Record payment for add-on (optional, mimicking real usage)
  await db.createPayment({
    userId: eddie.id,
    amount: 4.99,
    status: 'COMPLETED',
    type: 'ADD_ON',
  });

  return eddie;
}
