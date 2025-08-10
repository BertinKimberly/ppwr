"use client";

import React from "react";
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
import { useRegisterUser } from "@/hooks/useAuth";
import { toast } from "sonner";

// Validation Schema
const signUpSchema = z.object({
   fullName: z.string().min(2, "Full name must be at least 2 characters"),
   email: z.string().email("Invalid email address"),
   password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
         "Password must include uppercase, lowercase, number, and special character"
      ),
});

export default function SignUp() {
   const t = useTranslations("SignUp");
   const router = useRouter();
   const registerMutation = useRegisterUser();

   // Form setup
   const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         fullName: "",
         email: "",
         password: "",
      },
   });

   // Form submission handler
   const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
      try {
         await registerMutation.mutateAsync(values, {
            onSuccess: () => {
               toast.success(t("registrationSuccess"));
               router.push("/sign-in");
            },
            onError: (error: any) => {
               toast.error(error.message || t("registrationError"));
            },
         });
      } catch (error) {
         console.error("Registration error:", error);
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
                        name="fullName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>{t("fullName")}</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder={t("fullNamePlaceholder")}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
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
                        disabled={registerMutation.isPending}
                     >
                        {registerMutation.isPending
                           ? t("registering")
                           : t("signUp")}
                     </Button>
                  </form>
               </Form>
               <div className="mt-4 text-center text-sm">
                  {t("alreadyHaveAccount")}{" "}
                  <Link
                     href="/sign-in"
                     className="text-primary hover:underline"
                  >
                     {t("signIn")}
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
