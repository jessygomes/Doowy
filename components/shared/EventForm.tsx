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
  FormDescription,
  FormLabel,
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
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import DropdownTags, { ITags } from "./DropdownTags";

//! On va afficher soit le form pour CREER soit pour UPDATE grâce au TYPE que l'on passe au composant EVENTFORM
type EventFormProps = {
  userId: string | undefined;
  type: "Créer" | "Modifier";
  event?: {
    title: string;
    description?: string;
    location?: string;
    departement: string;
    ville: string;
    imageUrl: string;
    maxPlaces?: number;
    startDateTime: Date;
    endDateTime: Date;
    price?: string | null;
    isFree: boolean;
    url?: string | null;
    category: string | null;
    organizer: string;
    nbFav?: number;
    isBilleterieExterne: boolean;
    tags: ITags[] | null;
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
  const [selectedTags, setSelectedTags] = useState<ITags[]>(event?.tags || []); // Pour la gestion des tags sélectionnés

  const initialValues =
    event && type === "Modifier"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
          price: event.price ?? "",
          category: event.category ?? "",
          url: event.url ?? "",
          isBilleterieExterne: event.isBilleterieExterne ?? false,
          tags: event.tags ?? [],
        }
      : eventDefaultValues;

  const { startUpload } = useUploadThing("imageUploader"); //! Hook pour uploader des images

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit", // Utilisez 'onSubmit' pour valider le formulaire lors de la soumission
  });

  //! SUBMIT FORM
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImgUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      if (!uploadedImages) return;
      uploadedImgUrl = uploadedImages[0].url;
    }

    if (values.maxPlaces) {
      values.maxPlaces = Number(values.maxPlaces);
    }
    if (!values.maxPlaces) {
      values.maxPlaces = 0;
    }

    if (type === "Créer") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImgUrl, tags: selectedTags },
          userId,
          path: "/profil",
        });
        if (newEvent && "id" in newEvent) {
          form.reset();
          router.push(`/events/${newEvent.id}`);
          toast.success("L'événement a été créé avec succès");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          "Une erreur est survenue lors de la création de l'événement"
        );
      }
    }

    if (type === "Modifier") {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          event: {
            ...values,
            imageUrl: uploadedImgUrl,
            id: eventId,
            tags: selectedTags,
          },
          userId,
          path: `/events/${eventId}`,
        });
        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent.id}`);
          toast.success("L'événement a été modifié avec succès");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          "Une erreur est survenue lors de la modification de l'événement"
        );
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

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <DropdownTags
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  onChangeHandler={setSelectedTags}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex flex-col gap-5 md:grid md:grid-cols-3 w-full">
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
                      className="input-field w-full"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ville"
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
                      placeholder="Ville"
                      {...field}
                      className="input-field w-full"
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
                      <SelectTrigger className="rubik text-[16px] leading-[24px] text-dark w-full bg-transparent h-[40px] placeholder:text-dark dark:placeholder:text-dark rounded-sm px-5 py-2 border-none focus-visible:ring-transparent focus:ring-transparent">
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
            name="isBilleterieExterne"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col items-center rounded-sm justify-around p-2 px-4 bg-grey-50 shadow-sm">
                <div className="space-y-0.5 rubik">
                  <FormLabel>Billetterie</FormLabel>
                  <FormDescription>
                    Activez cette option si vous souhaitez utiliser une{" "}
                    <span className="font-bold">billeterie externe</span>. Dans
                    ce cas, indiquez le lien de la billeterie dans le champs :{" "}
                    <span className="font-bold">
                      URL de l&apos;événement/Billetterie
                    </span>{" "}
                    et laisser le champs{" "}
                    <span className="font-bold">Nombre de places</span> vide.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    id="isBilleterieExterne"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxPlaces"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col items-left rounded-sm justify-between p-2 px-4 bg-grey-400 shadow-sm">
                <div className="space-y-0.5 rubik bg-grey-400">
                  <FormDescription className="text-grey-600">
                    Si votre événement a un nombre de place limité et/ou si
                    votre événement est payant,{" "}
                    <span className="underline">
                      vous pouvez renseigner le nombre de places disponibles.
                    </span>{" "}
                    Un qr code sera généré pour chaque place disponible.{" "}
                    <span className="font-bold">
                      Si ce n&apos;est pas le cas, laissez ce champ vide.
                    </span>
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nombre de places"
                    {...field}
                    className="input-field"
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                      className="input-field"
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
                                className="rubik whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitted ? "En cours..." : `${type} l'événement`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
