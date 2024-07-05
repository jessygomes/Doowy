"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newPasswordSchema } from "@/lib/validator";
import { newPassword } from "@/lib/actions/auth.actions";

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

function NewPasswordForm() {
  //! Récupération du token depuis l'URL envoyé depuis le lien du mail :
  const searchParams = useSearchParams();
  // ce token est utilisé pour l'envoyer à la fonction newPassword
  const token = searchParams.get("token");

  //! Va permettre d'inititer un état de chargement lors de la soumission du formulaire et permettra de désactiver les boutons au submit du formulaire
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //! Schema de validation
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  //! Fonction de soumission du formulaire
  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    // Reset des messages d'erreur et de succès
    setError("");
    setSuccess("");

    // Server Action (je peux aussi utiliser fetch ici)
    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Mot de passe oublié ?"
      backButtonLabel="Retourner à la connexion"
      backButtonHref="/auth/connexion"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Nouveau mot de passe</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">
                    Confirmation du mot de passe
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      id="passwordConfirmation"
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                      className="input rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="button w-full">
            Réinitialiser le mot de passe
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default NewPasswordForm;
