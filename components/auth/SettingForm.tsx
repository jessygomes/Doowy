"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";

import { userSettingSchema } from "@/lib/validator";
import { updateSettingUser } from "@/lib/actions/user.actions";
import { departements } from "@/constants";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError } from "../shared/FormError";
import { FormSuccess } from "../shared/FormSuccess";
import { Switch } from "../ui/switch";

type SettingFormProps = {
  userProfile?: {
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    email: string | null;
    departement: string | null;
    isTwofactorEnabled: boolean | null;
    organizationName?: string | null;
    organizationType?: string | null;
    isHidenWishlist?: boolean | null;
    role?: string | null;
  };
};

export const SettingForm = ({ userProfile }: SettingFormProps) => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof userSettingSchema>>({
    resolver: zodResolver(userSettingSchema),
    defaultValues: {
      firstName: userProfile?.firstName || undefined,
      lastName: userProfile?.lastName || undefined,
      name: userProfile?.name || undefined,
      email: userProfile?.email || undefined,
      departement: userProfile?.departement || undefined,
      isTwofactorEnabled: userProfile?.isTwofactorEnabled || undefined,
      organizationName: userProfile?.organizationName || undefined,
      organizationType: userProfile?.organizationType || undefined,
      isHidenWishlist: userProfile?.isHidenWishlist || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof userSettingSchema>) => {
    setError("");
    setSuccess("");

    console.log(values);

    // Création d'une copie des valeurs pour les modifier
    let updatedValues = { ...values };

    // Si firstName ou lastName est présent, mettre à jour le champ name
    if (values.firstName || values.lastName) {
      // Etre sûr que firstName et lastName ne sont pas undefined
      const firstName = values.firstName || "";
      const lastName = values.lastName || "";
      updatedValues.name = `${firstName} ${lastName}`.trim();
    }

    startTransition(() => {
      updateSettingUser(updatedValues)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Une erreur est survenue"));
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row justify-center items-center">
          <Label htmlFor="firstName" className="text-right">
            Prénom
          </Label>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    id="firstName"
                    {...field}
                    className="input-field"
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Label htmlFor="lastName" className="text-right">
            Nom
          </Label>
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    id="lastName"
                    {...field}
                    className="input-field"
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {user?.role === "organizer" && (
          <div className="flex flex-col gap-5 md:flex-row justify-center items-center">
            <Label htmlFor="firstName" className="text-right">
              Nom de l&apos;organisation
            </Label>
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      id="organizationName"
                      {...field}
                      className="input-field"
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Label htmlFor="lastName" className="text-right">
              Type d&apos;organisation
            </Label>
            <FormField
              control={form.control}
              name="organizationType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      id="organizationType"
                      {...field}
                      className="input-field"
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex flex-col gap-5 md:flex-row justify-center items-center">
          {user?.isOAuth === false && (
            <>
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="email"
                        id="email"
                        {...field}
                        className="input-field"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="departement"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      width={24}
                      height={24}
                      alt="location icon"
                    />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="select-field">
                        <SelectValue placeholder="Département" />
                      </SelectTrigger>
                      <SelectContent>
                        {departements.departements.map((departement) => (
                          <SelectItem
                            key={departement.numero}
                            value={departement.numero}
                            className="select-item p-regular-14 "
                          >
                            {departement.nom} - {departement.numero}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          {user?.isOAuth === false && (
            <>
              <Label htmlFor="email" className="text-right"></Label>
              <FormField
                control={form.control}
                name="isTwofactorEnabled"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center rounded-full justify-between p-2 px-4 shadow-sm">
                    <div className="space-y-0.5 ">
                      <FormLabel>Authentification à 2 facteurs</FormLabel>
                      <FormDescription>
                        Activer l&apos;authentification à deux facteurs pour
                        sécuriser votre compte :{" "}
                        {user.isTwofactorEnabled ? "Activé" : "Désactivé"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="isTwofactorEnabled"
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          {user?.role === "user" && (
            <>
              <Label htmlFor="email" className="text-right"></Label>
              <FormField
                control={form.control}
                name="isHidenWishlist"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center rounded-full justify-between p-2 px-4 shadow-sm">
                    <div className="space-y-0.5 ">
                      <FormLabel>Confidentialité</FormLabel>
                      <FormDescription>
                        Ne pas montrer ma liste de favoris aux autres
                        utilisateurs :{" "}
                        {userProfile?.isHidenWishlist ? "Activé" : "Désactivé"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="isHidenWishlist"
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button
          type="submit"
          size="lg"
          // disabled={form.formState.isSubmitted}
          className="button col-span-2 w-full"
        >
          {isPending ? "En cours..." : "Modifier"}
        </Button>
      </form>
    </Form>
  );
};
