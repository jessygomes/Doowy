"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import { userProfileSchema } from "@/lib/validator";
import { updateProfileUser } from "@/lib/actions/user.actions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type UserFormProps = {
  organizer: {
    description?: string | null;
    photo?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    tiktok?: string | null;
  };
};

const UserForm2 = ({ organizer }: UserFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { update } = useSession();

  const initialValue = {
    description: organizer?.description ?? "",
    // photo: organizer?.photo,
    instagram: organizer?.instagram ?? "",
    twitter: organizer?.twitter ?? "",
    tiktok: organizer?.tiktok ?? "",
  };

  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: initialValue,
  });

  async function onSubmit(values: z.infer<typeof userProfileSchema>) {
    startTransition(() => {
      updateProfileUser(values)
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          }

          if (data.success) {
            // Provient de "useSession" : Mettre à jour la session avec les infos du User modifié
            update();
            setSuccess(data.success);
          }
          router.push("/profil");
        })
        .catch(() => setError("Une erreur est survenue"));
    });
  }

  async function onError(errors: any) {
    console.error("Form errors:", errors);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col justify-center items-center gap-5"
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="description" className="text-white rubik">
              Description
            </Label>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <Textarea
                      id="description"
                      {...field}
                      className="textarea rounded-sm text-dark"
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="instagram" className="text-white rubik">
                Instagram
              </Label>
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="instagram"
                        {...field}
                        className="input-field"
                        placeholder="Instagram"
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="twitter" className="text-white rubik">
                X
              </Label>
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="twitter"
                        {...field}
                        className="input-field"
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tiktok" className="text-white rubik">
                TikTok
              </Label>
              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="tiktok"
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
        </div>
        <Button
          type="submit"
          size="lg"
          // disabled={form.formState.isSubmitted}
          className="button col-span-2 w-full sm:w-fit"
        >
          {isPending ? "En cours..." : "Modifier"}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm2;
