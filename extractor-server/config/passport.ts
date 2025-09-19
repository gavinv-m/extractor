import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from './db/client.ts';
import type { User } from '@prisma/client';

const verifyCallback = async (
  email: string,
  password: string,
  done: Function
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

passport.serializeUser((user: User, done: (err: any, id?: string) => void) => {
  done(null, user.id);
});

passport.deserializeUser(
  async (id: string, done: (err: any, user?: User | false) => void) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user ?? false);
    } catch (err) {
      done(err);
    }
  }
);

// Exports to app.ts
export default passport;
