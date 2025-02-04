import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server'; // Import NextResponse

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/' // Ensure the main page is public
]);

export default clerkMiddleware((auth, request) => {
  const { userId } = auth();

  // Allow access to public routes
  if (isPublicRoute(request)) {
    return NextResponse.next(); // Continue normally
  }

  // If user is NOT authenticated, redirect to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If authenticated user tries to access /dashboard, redirect them to /
  if (new URL(request.url).pathname === "/dashboard") {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next(); // Continue to the requested page
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};