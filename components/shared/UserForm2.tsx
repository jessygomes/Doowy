"use client";
import { useForm } from "react-hook-form";
import { userFormSchema } from "@/lib/validator";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

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
import { set } from "mongoose";

type UserFormProps = {
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    description: string;
    instagram: string;
    twitter: string;
    tiktok: string;
  };
};

const UserForm2 = ({ userId, user }: UserFormProps) => {
  const router = useRouter();

  // const initialValue = user
  //   ? {
  //       description: user.description,
  //       instagram: user.instagram,
  //       twitter: user.twitter,
  //       tiktok: user.tiktok,
  //     }
  //   : {
  //       description: "",
  //       instagram: "",
  //       twitter: "",
  //       tiktok: "",
  //     };

  const initialValue = {
    firstName: user.firstName,
    lastName: user.lastName,
    description: user.description,
    instagram: user.instagram,
    twitter: user.twitter,
    tiktok: user.tiktok,
  };

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValue,
  });

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    console.log(values);

    if (!userId) {
      router.back();
      return;
    }

    try {
      const updatedUserInfos = await updateUser({
        user: { ...values },
        userId,
        path: `/profil`,
      });
      console.log(updatedUserInfos);
      if (updatedUserInfos) {
        form.reset();
        router.push(`/profil`);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
                  <Input id="firstName" {...field} className="input-field" />
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
                  <Input id="lastName" {...field} className="input-field" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <Label htmlFor="instagram" className="text-right">
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
                    className="textarea rounded-2xl"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row justify-center items-center">
          <Label htmlFor="instagram" className="text-right">
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
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row justify-center items-center">
          <Label htmlFor="twitter" className="text-right">
            X
          </Label>
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input id="twitter" {...field} className="input-field" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row justify-center items-center">
          <Label htmlFor="tiktok" className="text-right">
            TikTok
          </Label>
          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input id="tiktok" {...field} className="input-field" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          // disabled={form.formState.isSubmitted}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitted ? "En cours..." : "Modifier"}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm2;
