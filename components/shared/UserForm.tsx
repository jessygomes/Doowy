"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useForm } from "react-hook-form";
import { UserFormSchema } from "@/lib/validator";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/lib/actions/user.actions";

type UserFormProps = {
  userId: string;
  user: {
    description: string;
    instagram: string;
    twitter: string;
    tiktok: string;
  };
};

const UserForm = ({ userId, user }: UserFormProps) => {
  const initialValue = user
    ? {
        description: user.description,
        instagram: user.instagram,
        twitter: user.twitter,
        tiktok: user.tiktok,
      }
    : {
        description: "",
        instagram: "",
        twitter: "",
        tiktok: "",
      };

  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: initialValue,
  });

  async function onSubmit(values: z.infer<typeof UserFormSchema>) {
    console.log("OnSUBMIT", values);
    try {
      const updatedUser = await updateUser({
        user: { ...values },
        userId,
        path: `/profil`,
      });
      if (updatedUser) alert("User updated successfully");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="button hidden sm:flex">Modifier</Button>
          </SheetTrigger>
          <SheetContent className="w-[1000px]">
            <SheetHeader>
              <SheetTitle>Modifier mes informations</SheetTitle>
              <SheetDescription>
                Cliquez sur sauvegarder pour enregistrer les modifications.
              </SheetDescription>
            </SheetHeader>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id="description"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instagram" className="text-right">
                  Instagram
                </Label>
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="instagram"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="twitter" className="text-right">
                  X
                </Label>
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id="twitter" {...field} className="col-span-3" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tiktok" className="text-right">
                  TikTok
                </Label>
                <FormField
                  control={form.control}
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id="tiktok" {...field} className="col-span-3" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Sauvegarder</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  );
};

export default UserForm;
