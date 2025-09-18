import db from '../../../config/db/queries.ts';
import dotenv from 'dotenv';
import normaliseDate from '../../../utils/date.ts';

dotenv.config();

export default async function seedBobUndergrad() {
  const bob = await db.addUser({
    email: 'bob.undergrad@example.com',
    name: 'Bob Undergrad',
    password: process.env.PASSWORD_BOB_UNDERGRAD as string,
    role: 'USER',
    userType: 'STUDENT',
    studentType: 'UNDERGRAD',
  });

  await db.createAuditLog(bob.id, 'User signed up');

  // Attach a subscription to Bob (FREE plan)
  await db.createSubscription(
    bob.id,
    'FREE',
    new Date(),
    new Date(new Date().setMonth(new Date().getMonth() + 1)),
    'INACTIVE' // set Bob’s subscription to inactive
  );

  const subscriptionStart = normaliseDate(new Date());

  // 3. Initialize monthly usage
  await db.createMonthlyUsage(bob.id, subscriptionStart, 2); // free plan = 2 pages

  await db.updateMonthlyUsage(bob.id, subscriptionStart, 2); // subtract 2 from pagesRemaining, add 2 to pagesUsed

  await db.createAuditLog(
    bob.id,
    'Processed 2 pages on free plan, pagesRemaining now 0'
  );
}
