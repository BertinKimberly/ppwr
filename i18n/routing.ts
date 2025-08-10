import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "de"] as const;
export const defaultLocale = "en" as const;

export const routing = defineRouting({
   locales,
   defaultLocale,
   localePrefix: "always", // Ensure all routes have a locale prefix
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
   createNavigation(routing);