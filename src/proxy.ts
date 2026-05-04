import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log('middleware hit:', req.nextUrl.pathname, 'userId:', userId);
  if (isProtectedRoute(req)) await auth.protect()  // ← async + await
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:css|js|png|jpg|jpeg|svg|ico)).*)',
    '/(api|trpc)(.*)',
  ],
}