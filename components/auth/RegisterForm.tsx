"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userRegisterSchema } from "@/lib/validator";
import { CardWrapper } from "./CardWrapperBis";
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
import { FormError } from "../shared/FormError";
import { FormSuccess } from "../shared/FormSuccess";
import { register } from "@/lib/actions/auth.actions";
import { useState, useTransition } from "react";

type RegisterFormProps = {
  type: "user" | "organizer";
  label: string;
};

export const RegisterForm = ({ type, label }: RegisterFormProps) => {
  //! TVa permettre d'inititer un état de chargement lors de la soumission du formulaire et permettra de désactiver les boutons au submit du formulaire
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //! Schema de validation
  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      role: type,
      organizationName: "",
      organizationType: "",
    },
  });

  //! Fonction de soumission du formulaire
  const onSubmit = (values: z.infer<typeof userRegisterSchema>) => {
    // Reset des messages d'erreur et de succès
    setError("");
    setSuccess("");

    // Server Action (je peux aussi utiliser fetch ici)
    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  //! Si le type est organizer, on affiche pas l'inscription avec Google
  const isOrganizer = type === "organizer";

  return (
    <CardWrapper
      headerLabel={label}
      backButtonLabel="Vous avez déjà un compte ? Connectez-vous !"
      backButtonHref="/auth/connexion"
      showSocial={!isOrganizer}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full text-dark"
        >
          <div className="space-y-4">
            <div className="flex gap-2 w-full">
              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel htmlFor="firstName">Prénom</FormLabel> */}
                      <FormControl>
                        <Input
                          type="text"
                          id="firstName"
                          placeholder="Prénom"
                          {...field}
                          disabled={isPending}
                          className="input-field w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel htmlFor="lastName">Nom</FormLabel> */}
                      <FormControl>
                        <Input
                          type="text"
                          id="lastName"
                          placeholder="Nom"
                          {...field}
                          disabled={isPending}
                          className="input-field w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {isOrganizer && (
              <div className="flex gap-2">
                <div className="flex-grow">
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel htmlFor="organizationName">
                        Nom de l&apos;organisation
                      </FormLabel> */}
                        <FormControl>
                          <Input
                            type="text"
                            id="organizationName"
                            placeholder="Nom de l'organisation"
                            {...field}
                            disabled={isPending}
                            className="input-field"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-grow">
                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel htmlFor="lastName">
                        Type de l&apos;organisation
                      </FormLabel> */}
                        <FormControl>
                          <Input
                            type="text"
                            id="organizationType"
                            placeholder="Type d'organisation : association, entreprise..."
                            {...field}
                            disabled={isPending}
                            className="input-field"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel htmlFor="email">Email</FormLabel> */}
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      {...field}
                      disabled={isPending}
                      className="input-field"
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
                  {/* <FormLabel htmlFor="password">Mot de passe</FormLabel> */}
                  <FormControl>
                    <Input
                      type="password"
                      id="password"
                      placeholder="Mot de passe"
                      {...field}
                      disabled={isPending}
                      className="input-field"
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
                  {/* <FormLabel htmlFor="passwordConfirmation">
                    Confirmation du mot de passe
                  </FormLabel> */}
                  <FormControl>
                    <Input
                      type="password"
                      id="passwordConfirmation"
                      placeholder="Confirmation du mot de passe"
                      {...field}
                      disabled={isPending}
                      className="input-field"
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
            Créer mon compte
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
