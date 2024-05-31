import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(3, "La description doit contenir au moins 3 caractères")
    .max(400, "La description doit contenir au maximum 400 caractères"),
  location: z
    .string()
    .min(3, "Le lieu doit contenir au moins 3 caractères")
    .max(400, "La description doit contenir au maximum 400 caractères"),
  city: z
    .string()
    .min(
      3,
      "La ville doit contenir au moins 3 caractères (Attention à l'orthographe)"
    ),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});
