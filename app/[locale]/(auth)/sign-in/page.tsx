"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { useLoginUser } from "@/hooks/useAuth";
import { toast } from "sonner";

// Validation Schema
const loginSchema = z.object({
   email: z.string().email("Invalid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
   const t = useTranslations("SignIn");
   const router = useRouter();
   const loginMutation = useLoginUser();

   // Form setup
   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   // Form submission handler
   const onSubmit = async (values: z.infer<typeof loginSchema>) => {
      try {
         await loginMutation.mutateAsync(values, {
            onSuccess: () => {
               toast.success(t("loginSuccess"));
               router.push("/dashboard");
            },
            onError: (error: any) => {
               toast.error(error.message || t("loginError"));
            },
         });
      } catch (error) {
         console.error("Login error:", error);
      }
   };

   return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle>{t("title")}</CardTitle>
               <CardDescription>{t("subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>{t("email")}</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder={t("emailPlaceholder")}
                                    type="email"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>{t("password")}</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder={t("passwordPlaceholder")}
                                    type="password"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                     >
                        {loginMutation.isPending ? t("loggingIn") : t("signIn")}
                     </Button>
                  </form>
               </Form>
               <div className="mt-4 text-center text-sm">
                  {t("noAccount")}{" "}
                  <Link
                     href="/sign-up"
                     className="text-primary hover:underline"
                  >
                     {t("signUp")}
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
