"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { eventFormSchema } from "@/lib/validator"; //! Schema du formulaire
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { departements, eventDefaultValues } from "@/constants"; //! Valeur initiale du formulaire (vide)

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { useUploadThing } from "../../lib/uploadthing";
import DatePicker from "react-datepicker";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dropdown from "./Dropdown";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { FileUploader } from "./FileUploader";

//! On va afficher soit le form pour CREER soit pour UPDATE grâce au TYPE que l'on passe au composant EVENTFORM
type EventFormProps = {
  userId: string | undefined;
  type: "Créer" | "Modifier";
  event?: {
    title: string;
    description?: string;
    location?: string;
    departement: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    price?: string;
    isFree: boolean;
    url?: string;
    category: string;
    organizer: string;
    nbFav?: number;
    Category: {
      name?: string;
    } | null;
    Organizer: {
      id?: string;
      organizationName?: string;
      name?: string;
    };
  };
  eventId?: string;
};

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  const router = useRouter();

  registerLocale("fr", fr); // On enregistre la locale fr pour les dates

  const [files, setFiles] = useState<File[]>([]); // Pour la gestion des fichiers (images)

  const initialValues =
    event && type === "Modifier"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues;

  const { startUpload } = useUploadThing("imageUploader"); //! Hook pour uploader des images

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImgUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) return;

      uploadedImgUrl = uploadedImages[0].url;
    }

    if (type === "Créer") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImgUrl },
          userId,
          path: "/profil",
        });
        if (newEvent && "id" in newEvent) {
          form.reset();
          router.push(`/events/${newEvent.id}`);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (type === "Modifier") {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          event: { ...values, imageUrl: uploadedImgUrl, id: eventId },
          userId,
          path: `/events/${eventId}`,
        });
        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent.id}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row ">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Titre de l'événement"
                    {...field}
                    className="input-field text-dark"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Description de l'événement"
                    {...field}
                    className="textarea rounded-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[40px] w-full overflow-hidden rounded-sm bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      width={24}
                      height={24}
                      alt="location icon"
                    />
                    <Input
                      placeholder="Adresse, Ville ou Evénement en ligne"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departement"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[40px] w-full overflow-hidden rounded-sm bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      width={24}
                      height={24}
                      alt="location icon"
                    />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="rubik text-[16px] leading-[24px] text-dark w-full bg-transparent h-[40px] placeholder:text-dark dark:placeholder:text-dark rounded-sm  px-5 py-2 border-none focus-visible:ring-transparent focus:ring-transparent">
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
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[40px] w-full overflow-hidden rounded-sm bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      width={24}
                      height={24}
                      alt="calendrier icon"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Début :
                    </p>
                    <DatePicker
                      locale="fr"
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Heure :" //! Label pour l'heure
                      dateFormat="dd/MM/yyyy - HH:mm" //! Format de la date
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[40px] w-full overflow-hidden rounded-sm bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      width={24}
                      height={24}
                      alt="calendrier icon"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Fin :
                    </p>
                    <DatePicker
                      locale="fr"
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Heure :" //! Label pour l'heure
                      dateFormat="dd/MM/yyyy - HH:mm" //! Format de la date
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[40px] w-full overflow-hidden rounded-sm bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      width={24}
                      height={24}
                      alt="dollar icon"
                    />

                    <Input
                      type="number"
                      placeholder="Prix"
                      {...field}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-dark dark:text-dark"
                    />

                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="isFree"
                                className=" whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Gratuit
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree"
                                className="mr-2 h-4 w-4 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[40px] w-full overflow-hidden rounded-sm bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      width={24}
                      height={24}
                      alt="lien icon"
                    />
                    <Input
                      placeholder="URL de l'événement / Billetterie"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
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
          {form.formState.isSubmitted ? "En cours..." : `${type} l'événement`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
