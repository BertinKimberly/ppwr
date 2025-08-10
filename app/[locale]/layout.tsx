import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import "./globals.css";
import AuthProvider from "@/providers/auth.provider";
import ReactQueryProvider from "@/providers/react.query.provider";
import { Toaster } from "sonner";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "PPWRify",
   description: "PPWRify Application",
};

export default async function RootLayout({
   children,
   params,
}: {
   children: React.ReactNode;
   params: Promise<{ locale: string }>;
}) {
   // Await the params Promise to get the locale
   const { locale } = await params;

   // Fallback to default locale if locale is undefined or invalid
   const validLocale =
      locale &&
      routing.locales.includes(locale as (typeof routing.locales)[number])
         ? locale
         : routing.defaultLocale;

   console.log("RootLayout - Resolved locale:", validLocale);

   // Load translations for the locale
   let messages;
   try {
      messages = (await import(`../../messages/${validLocale}.json`)).default;
   } catch (error) {
      console.error(
         `Failed to load messages for locale ${validLocale}:`,
         error
      );
      messages = (await import(`../../messages/${routing.defaultLocale}.json`))
         .default;
   }

   return (
      <html lang={validLocale}>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
            <NextIntlClientProvider
               locale={validLocale}
               messages={messages}
            >
               <AuthProvider>
                  <ReactQueryProvider>
                     {children}
                     <Toaster />
                  </ReactQueryProvider>
               </AuthProvider>
            </NextIntlClientProvider>
         </body>
      </html>
   );
}