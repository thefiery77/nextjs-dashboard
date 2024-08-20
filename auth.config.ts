import type { NextAuthConfig } from 'next-auth';

const protectedRoutesPattern = /^\/dashboard(?:\/|$)/; // Matches '/dashboard' and any subpaths

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Test if the pathname matches the protected routes pattern
      const isProtectedRoute = protectedRoutesPattern.test(nextUrl.pathname);
      console.log("Is the route " + nextUrl.pathname + " protected? " + isProtectedRoute);

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
