import db from '../../../config/db/queries.ts';
import dotenv from 'dotenv';
import normaliseDate from '../../../utils/date.ts';

dotenv.config();

export default async function seedMayaZero() {
  const maya = await db.addUser({
    email: 'maya.zero@example.com',
    name: 'Maya Zero',
    password: process.env.PASSWORD_MAYA_ZERO as string,
    role: 'USER',
    userType: 'PROFESSIONAL',
    professionalField: 'MEDICAL',
  });

  await db.createAuditLog(maya.id, 'User signed up');

  const startDate = new Date();
  const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

  await db.createSubscription(maya.id, 'PRO', 'ACTIVE', startDate, endDate);

  const subscriptionStart = normaliseDate(startDate);

  // Set pages remaining to 0 for testing
  await db.createMonthlyUsage(maya.id, subscriptionStart, 0);

  await db.createAuditLog(
    maya.id,
    'Monthly usage initialized with 0 pages remaining'
  );
}
