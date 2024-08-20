import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { v4 } from "uuid";
 
export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function createUser(name:string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = v4();
  console.log("Creating user with id: " + id + "email: " + email + " name: " + name +" " + hashedPassword)
  try {
    await sql`
        INSERT INTO users (id, name, email, password)
        VALUES ( ${id}, ${name}, ${email}, ${hashedPassword});
      `;
  } catch (error) {
    console.log("Database Error: User creation failed")
    return {
      message: 'Database Error: User creation failed',
    };
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          console.log("Logging with " + email);
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});