"use server";

import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetFavoriteEvent,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from "@/types";
import { handleError } from "../utils";
import { connectToDb } from "../mongoDb/database";
import User from "../mongoDb/database/models/User";
import Event from "../mongoDb/database/models/Event";
import Category from "../mongoDb/database/models/Category";
import { revalidatePath } from "next/cache";
import { departements } from "@/constants";

const populateEvent = async (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({ path: "category", model: Category, select: "_id name" });
};

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

interface DepartementCondition {
  nom?: string;
  numero?: string;
}

const getDepartementByName = async (name: string) => {
  return departements.departements.find(
    (departement) => departement.nom === name
  );
};

//! CREATE EVENT
export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    await connectToDb();

    const organizer = await User.findById(userId);

    if (!organizer) {
      throw new Error("Organizer not found");
    }

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
};

//! GET EVENT BY ID
export const getEventById = async (eventId: string) => {
  try {
    await connectToDb();

    const event = await populateEvent(Event.findById(eventId));

    if (!event) {
      throw new Error("Event not found");
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
};

//! ALL EVENTS
export const getAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
  departement,
}: GetAllEventsParams) => {
  try {
    await connectToDb();

    // Condition de recherche qui filtre les events dont l titre correspond à la query (insensible à la casse : $regex et $options: "i")
    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};

    // Les conditions de recherche pour les événements : recherche par catégorie
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;

    // Les conditions de recherche pour les événements : recherche par département
    const departementCondition: DepartementCondition = departement
      ? (await getDepartementByName(departement)) || {}
      : {};

    // Combinason des conditions de recherches en utilisant l'opérateur $and, tous les events qui correspond à toute les conditions seront affichés
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
        departementCondition && departementCondition.numero
          ? { departement: departementCondition.numero }
          : {},
      ],
    };

    // Pour gérer la pagination : calcul du nombre d'éléments à ignorer
    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ nbFav: -1 })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);

    // Calcul du nombre total d'événements, nécessaire pour calculer le nombre de pages
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

//! ALL UPCOMING EVENTS
export const getAllUpcomingEvents = async ({
  query,
  limit = 6,
  page,
  category,
  departement,
}: GetAllEventsParams) => {
  try {
    await connectToDb();

    // Condition de recherche qui filtre les events dont l titre correspond à la query (insensible à la casse : $regex et $options: "i")
    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};

    // Les conditions de recherche pour les événements : recherche par catégorie
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;

    // Les conditions de recherche pour les événements : recherche par département
    const departementCondition: DepartementCondition = departement
      ? (await getDepartementByName(departement)) || {}
      : {};

    // Ajout de la condition pour récupérer les événements à venir ou en cours
    const upcomingEventCondition = {
      endDateTime: { $gte: new Date() },
    };

    // Combinason des conditions de recherches en utilisant l'opérateur $and, tous les events qui correspond à toute les conditions seront affichés
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
        departementCondition && departementCondition.numero
          ? { departement: departementCondition.numero }
          : {},
        upcomingEventCondition,
      ],
    };

    // Pour gérer la pagination : calcul du nombre d'éléments à ignorer
    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ nbFav: -1 })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);

    // Calcul du nombre total d'événements, nécessaire pour calculer le nombre de pages
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

//! UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDb();

    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

//! DELETE EVENT
export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    await connectToDb();

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
};

//! GET EVENTS BY ORGANIZER
export async function getEventsByUser({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) {
  try {
    await connectToDb();

    const conditions = { organizer: userId };
    const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

//! GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDb();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
