import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import createIntlMiddleware from "next-intl/middleware";
import { routing, locales } from "./i18n/routing";

// Protected routes with their required roles
const PROTECTED_ROUTES: { [key: string]: string[] } = {
   "/dashboard": ["USER", "ADMIN"],
   "/dashboard/packaging": ["ADMIN"],
   "/dashboard/users": ["ADMIN"],
};

export async function middleware(request: NextRequest) {
   const { pathname } = new URL(request.url);
   console.log("Middleware - Incoming Request:", { pathname });

   // Derive locale and path without locale prefix
   const segments = pathname.split("/").filter(Boolean);
   const maybeLocale = segments[0];
   const hasLocale = (locales as readonly string[]).includes(
      maybeLocale as any
   );
   const locale = hasLocale ? maybeLocale : routing.defaultLocale;
   const pathWithoutLocale = "/" + segments.slice(hasLocale ? 1 : 0).join("/");

   // Handle internationalization routing first
   try {
      const handleI18nRouting = createIntlMiddleware(routing);
      const intlResponse = await handleI18nRouting(request);

      // Check if the route is protected
      const token = request.cookies.get("access_token")?.value;
      const isProtectedRoute = Object.keys(PROTECTED_ROUTES).some((route) =>
         pathWithoutLocale.startsWith(route)
      );

      // If it's a protected route and no token exists, redirect to sign-in
      if (isProtectedRoute && !token) {
         return NextResponse.redirect(
            new URL(`/${locale}/sign-in`, request.url)
         );
      }

      // If token exists and user is trying to visit auth pages, redirect to dashboard
      const isAuthPage = ["/sign-in", "/sign-up"].some((route) =>
         pathWithoutLocale.startsWith(route)
      );
      if (token && isAuthPage) {
         return NextResponse.redirect(
            new URL(`/${locale}/dashboard`, request.url)
         );
      }

      // If token exists, validate it (ignore roles for now)
      if (token) {
         try {
            const decodedToken: any = jwtDecode(token);

            // Check token expiration
            if (decodedToken.exp * 1000 < Date.now()) {
               // Token expired, redirect to sign-in
               const response = NextResponse.redirect(
                  new URL(`/${locale}/sign-in`, request.url)
               );
               response.cookies.delete("access_token");
               return response;
            }
            // Role checks disabled: any authenticated user can access protected routes
         } catch (tokenError) {
            // Invalid token, redirect to sign-in
            const response = NextResponse.redirect(
               new URL(`/${locale}/sign-in`, request.url)
            );
            response.cookies.delete("access_token");
            return response;
         }
      }

      return intlResponse;
   } catch (error) {
      console.error("Middleware routing error:", error);

      // Fallback to default locale if routing fails
      const redirectUrl = new URL(`/${routing.defaultLocale}`, request.url);
      return NextResponse.redirect(redirectUrl);
   }
}

export const config = {
   // Match all routes except static files and API routes
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
