import db from '../../../config/db/queries';

export async function createUser(data: any) {
  return db.addUser(data);
}

export async function createSubscription(
  userId: string,
  plan: 'FREE' | 'PRO' | 'PREMIUM' | 'BUSINESS',
  startDate: Date,
  endDate: Date
) {}
