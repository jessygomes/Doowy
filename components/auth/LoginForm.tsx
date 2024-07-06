"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userLoginSchema } from "@/lib/validator";
import { login } from "@/lib/actions/auth.actions";

import { CardWrapper } from "./CardWrapper";
import { FormError } from "../shared/FormError";
import { FormSuccess } from "../shared/FormSuccess";
import { useState, useTransition } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  //! Prendre l'erreur depuis l'URL lors des connexion avec le provider Google
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OauthAccountNotLinked"
      ? "L'email est déjà utilisé par un autre compte"
      : "";

  //! TVa permettre d'inititer un état de chargement lors de la soumission du formulaire et permettra de désactiver les boutons au submit du formulaire
  const [isPending, startTransition] = useTransition();

  // Afficher ou non le form de l'auth à deux facteurs
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //! Schema de validation
  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //! Fonction de soumission du formulaire
  const onSubmit = (values: z.infer<typeof userLoginSchema>) => {
    // Reset des messages d'erreur et de succès
    setError("");
    setSuccess("");

    // Server Action (je peux aussi utiliser fetch ici)
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() =>
          setError("Une erreur s'est produite. Veuillez réessayer.")
        );
    });
  };

  return (
    <CardWrapper
      headerLabel="Bienvenue !"
      backButtonLabel="Vous n'avez pas encore de compte ?"
      backButtonHref="/auth/inscription"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="twoFactor">
                      2FA Authentification
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        {...field}
                        disabled={isPending}
                        className="input rounded-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          id="email"
                          placeholder="vibey@email.fr"
                          {...field}
                          disabled={isPending}
                          className="input rounded-full"
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
                      <FormLabel htmlFor="email">Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          id="password"
                          placeholder="********"
                          {...field}
                          disabled={isPending}
                          className="input rounded-full"
                        />
                      </FormControl>
                      <button className="">
                        <Link
                          href="/auth/reset"
                          className="text-[0.8rem] hover:text-grey-500"
                        >
                          Mot de passe oublié ?
                        </Link>
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="button w-full">
            {showTwoFactor ? "Confirmer" : "Connexion"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
