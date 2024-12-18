"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
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
import { ITags } from "../shared/DropdownTags";
import { getAllTags } from "@/lib/actions/tags.actions";

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
    tags: ITags[] | null;
  };
};

export const SettingForm = ({ userProfile }: SettingFormProps) => {
  const user = useCurrentUser();

  console.log(user);

  const [allTags, setAllTags] = useState<ITags[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITags[]>(user?.tags || []); // Pour la gestion des tags sélectionnés
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const getTags = async () => {
      const tagsList = await getAllTags();
      tagsList && setAllTags(tagsList as ITags[]); // On vérifie si la liste des tags est définie avant de la mettre à jour dans le state
    };
    getTags();
  }, [setAllTags]);

  const handleTagClick = (tag: ITags) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

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
      tags: userProfile?.tags || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof userSettingSchema>) => {
    setError("");
    setSuccess("");

    // Création d'une copie des valeurs pour les modifier
    let updatedValues = { ...values, tags: selectedTags };

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
        className="flex flex-col gap-5 w-full sm:w-1/2 mx-auto"
      >
        <div className="flex flex-row gap-2 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="firstName" className="text-white rubik">
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
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="lastName" className="text-white rubik">
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
        </div>

        {user?.role === "organizer" && (
          <div className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="firstName" className="text-white rubik">
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
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="lastName" className="text-white rubik">
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
          </div>
        )}

        <div className="flex flex-col gap-6">
          {user?.isOAuth === false ? (
            <>
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="email" className="text-white rubik">
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
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="email" className="text-white rubik">
                Email
              </Label>
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="email"
                    id="email"
                    value={userProfile?.email || ""}
                    className="input-field"
                    disabled={true}
                  />
                </FormControl>
              </FormItem>
            </div>
          )}

          <FormField
            control={form.control}
            name="departement"
            render={({ field }) => (
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="email" className="text-white rubik">
                  Département
                </Label>
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[40px] w-full overflow-hidden rounded-sm bg-grey-50 px-4 py-2 text-dark">
                      <Image
                        src="/assets/icons/location-grey.svg"
                        width={24}
                        height={24}
                        alt="location icon"
                      />
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="rubik text-[16px] leading-[24px] text-dark dark:text-dark w-full bg-transparent h-[40px] placeholder:text-dark dark:placeholder:text-dark rounded-sm px-5 py-2 border-none focus-visible:ring-transparent focus:ring-transparent">
                          <SelectValue placeholder="Département" />
                        </SelectTrigger>
                        <SelectContent>
                          {departements.departements.map((departement) => (
                            <SelectItem
                              key={departement.numero}
                              value={departement.numero}
                              className="rubik text-white bg-dark"
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
              </div>
            )}
          />
        </div>

        <div>
          <Label htmlFor="preférences" className="text-white rubik">
            Préférences
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map((tag) => (
              <span
                key={tag.id}
                onClick={() => handleTagClick(tag)}
                className={`cursor-pointer px-2 py-1 rounded ${
                  selectedTags.some((t) => t.id === tag.id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {user?.isOAuth === false && (
            <>
              <div className="w-full">
                <Label htmlFor="email" className="text-white rubik"></Label>
                <FormField
                  control={form.control}
                  name="isTwofactorEnabled"
                  render={({ field }) => (
                    <FormItem className="w-full flex items-center rounded-sm justify-between p-2 px-4 bg-grey-50 shadow-sm">
                      <div className="space-y-0.5 rubik">
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
              </div>
            </>
          )}

          {user?.role === "user" && (
            <>
              <Label htmlFor="email" className="text-white rubik"></Label>
              <FormField
                control={form.control}
                name="isHidenWishlist"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center rounded-sm justify-between p-2 px-4 bg-grey-50 shadow-sm">
                    <div className="space-y-0.5 rubik">
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
          className="button rubik uppercase col-span-2 w-full"
        >
          {isPending ? "En cours..." : "Modifier"}
        </Button>
      </form>
    </Form>
  );
};
