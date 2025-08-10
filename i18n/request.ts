import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
   // Log the requested locale for debugging
   console.log("RequestConfig - Requested locale:", requestLocale);

   // Resolve locale
   const locale = hasLocale(routing.locales, requestLocale)
      ? requestLocale
      : routing.defaultLocale;

   console.log("RequestConfig - Resolved locale:", locale);

   return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default,
   };
});