"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetSchema } from "@/lib/validator";
import { reset } from "@/lib/actions/auth.actions";

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
import Link from "next/link";

function ResetForm() {
  //! Va permettre d'inititer un état de chargement lors de la soumission du formulaire et permettra de désactiver les boutons au submit du formulaire
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //! Schema de validation
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  //! Fonction de soumission du formulaire
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    // Reset des messages d'erreur et de succès
    setError("");
    setSuccess("");

    // Server Action (je peux aussi utiliser fetch ici)
    startTransition(() => {
      reset(values).then((data) => {
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="button w-full">
            Envoyer un email de réinitialisation
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default ResetForm;
