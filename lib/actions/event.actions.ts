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
// import User from "../mongoDb/database/models/User";
// import Event from "../mongoDb/database/models/Event";
// import Category from "../mongoDb/database/models/Category";
import { revalidatePath } from "next/cache";
import { departements } from "@/constants";
import { currentRole } from "../auth";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserById } from "./user.actions";
import { db } from "../db";
import { Cat } from "lucide-react";

//! GET CATEGORY BY NAME
// const getCategoryByName = async (name: string) => {
//   return db.category.findMany({ name: { $regex: name, $options: "i" } });
// };

// const getCategoryByName = async (name: string) => {
//   return db.category.findMany({
//     where: {
//       name: {
//         contains: name,
//         mode: "insensitive", // Pour une recherche insensible à la casse
//       },
//     },
//     select: {
//       name: true, // Sélectionne uniquement le champ `name`
//     },
//   });
// };

interface DepartementCondition {
  nom?: string;
  numero?: string;
}

const getDepartementByName = async (name: string) => {
  return departements.departements.find(
    (departement) => departement.nom === name
  );
};

// //! CREATE EVENT
export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    const role = await currentRole();

    if (role !== Role.organizer) {
      return new NextResponse(null, { status: 403 });
    }

    if (!userId) {
      return new NextResponse(null, { status: 401 });
    }

    const organizer = await getUserById(userId);

    if (!organizer) {
      throw new Error("Organizer not found");
    }

    const newEvent = await db.event.create({
      data: {
        ...event,
        category: event.category,
        organizer: userId,
      },
    });

    return newEvent;
  } catch (error) {
    console.log(error);
  }
};

// //! GET EVENT BY ID
export const getEventById = async (eventId: string) => {
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        Category: {
          select: {
            name: true, // Sélectionne uniquement le nom de la catégorie
          },
        },
        Organizer: {
          select: {
            organizationName: true, // Sélectionne uniquement le nom de l'organisateur
          },
        },
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    return {
      ...event,
    };
  } catch (error) {
    console.log(error);
  }
};

// //! ALL EVENTS + CONDITION DE RECHERCHE
export const getAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
  departement,
}: GetAllEventsParams) => {
  try {
    // Les conditions de recherche pour les événements : recherche par catégorie
    const categoryCondition = category
      ? await db.category.findFirst({
          where: { name: category },
          select: { id: true },
        })
      : null;

    // Les conditions de recherche pour les événements : recherche par département
    const departementCondition: DepartementCondition = departement
      ? (await getDepartementByName(departement)) || {}
      : {};

    // Pour gérer la pagination : calcul du nombre d'éléments à ignorer
    const skipAmount = (Number(page) - 1) * limit;

    const events = await db.event.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        category: categoryCondition ? categoryCondition.id : undefined,
        departement: departementCondition.numero,
      },
      include: {
        Category: {
          select: {
            name: true,
          },
        },
        Organizer: {
          select: {
            organizationName: true,
          },
        },
      },
      orderBy: { nbFav: "desc" },
      skip: skipAmount,
      take: limit,
    });

    // Calcul du nombre total d'événements, nécessaire pour calculer le nombre de pages
    const eventsCount = await db.event.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        category: categoryCondition ? categoryCondition.id : undefined,
        departement: departementCondition.numero,
      },
    });

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

// //! ALL UPCOMING EVENTS
export const getAllUpcomingEvents = async ({
  query,
  limit = 6,
  page,
  category,
  departement,
}: GetAllEventsParams) => {
  try {
    // Les conditions de recherche pour les événements : recherche par catégorie
    const categoryCondition = category
      ? await db.category.findFirst({
          where: { name: category },
          select: { id: true },
        })
      : null;

    // Les conditions de recherche pour les événements : recherche par département
    const departementCondition: DepartementCondition = departement
      ? (await getDepartementByName(departement)) || {}
      : {};

    // Pour gérer la pagination : calcul du nombre d'éléments à ignorer
    const skipAmount = (Number(page) - 1) * limit;

    const events = await db.event.findMany({
      where: {
        endDateTime: { gte: new Date() },
        title: {
          contains: query,
          mode: "insensitive",
        },
        category: categoryCondition ? categoryCondition.id : undefined,
        departement: departementCondition.numero,
      },
      include: {
        Category: {
          select: {
            name: true, // Sélectionne uniquement le nom de la catégorie
          },
        },
        Organizer: {
          select: {
            organizationName: true,
            id: true,
          },
        },
      },
      orderBy: { nbFav: "desc" },
      skip: skipAmount,
      take: limit,
    });

    const transformedEvents = events.map((event) => ({
      ...event,
      Category: event.Category?.name,
      Organizer: event.Organizer,
    }));

    const eventsCount = await db.event.count({
      where: {
        endDateTime: { gte: new Date() },
        title: {
          contains: query,
          mode: "insensitive",
        },
        category: categoryCondition ? categoryCondition.id : undefined,
        departement: departementCondition.numero,
      },
    });

    return {
      data: transformedEvents,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

// //! UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    const eventToUpdate = await db.event.findUnique({
      where: { id: event.id },
    });

    if (!eventToUpdate || eventToUpdate.organizer.toString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    const updatedEvent = await db.event.update({
      where: { id: event.id },
      data: { ...event, category: event.category },
    });

    revalidatePath(path);

    return updatedEvent;
  } catch (error) {
    console.log(error);
  }
}

// //! DELETE EVENT
export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    const deletedEvent = await db.event.delete({ where: { id: eventId } });

    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
};

// //! GET EVENTS BY ORGANIZER (FOR PUBLIC PROFILE)
export async function getEventsByUser({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) {
  try {
    const skipAmount = (page - 1) * limit;

    const currentDate = new Date();

    const eventsQuery = await db.event.findMany({
      where: { organizer: userId },
      include: {
        Category: {
          select: {
            name: true, // Sélectionne uniquement le nom de la catégorie
          },
        },
        Organizer: {
          select: {
            organizationName: true,
            id: true,
          },
        },
      },
      skip: skipAmount,
      take: limit,
    });

    const events = eventsQuery.map((event) => ({
      ...event,
      Category: event.Category?.name,
      Organizer: {
        id: event.Organizer.id,
        organizationName: event.Organizer.organizationName,
      },
      isUpcoming: new Date(event.startDateTime) >= currentDate,
    }));

    const upcomingEvents = events.filter((event) => event.isUpcoming);
    const pastEvents = events.filter((event) => !event.isUpcoming);

    // const events = await populateEvent(eventsQuery);
    const eventsCount = await db.event.count({ where: { organizer: userId } });

    return {
      data: {
        upcomingEvents,
        pastEvents,
      },
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// //! GET EVENTS BY ORGANIZER (FOR PRIVATE PROFILE)
export async function getEventsByUserForPrivateProfl({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) {
  try {
    const skipAmount = (page - 1) * limit;

    const eventsQuery = await db.event.findMany({
      where: { organizer: userId },
      include: {
        Category: {
          select: {
            name: true, // Sélectionne uniquement le nom de la catégorie
          },
        },
        Organizer: {
          select: {
            organizationName: true,
            id: true,
          },
        },
      },
      skip: skipAmount,
      take: limit,
    });

    const events = eventsQuery.map((event) => ({
      ...event,
      Category: event.Category?.name,
      Organizer: {
        id: event.Organizer.id,
        organizationName: event.Organizer.organizationName,
      },
    }));

    // const events = await populateEvent(eventsQuery);
    const eventsCount = await db.event.count({ where: { organizer: userId } });

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// //! GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  departementId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    // Étape 1: Récupérer le département de l'événement courant
    const currentEvent = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!currentEvent) {
      throw new Error("Event not found");
    }

    const currentEventDepartmentId = currentEvent.departement;

    const skipAmount = (Number(page) - 1) * limit;

    // const conditions = {
    //   $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    // };

    const events = await db.event.findMany({
      where: {
        AND: [
          { departement: currentEventDepartmentId },
          { id: { not: eventId } },
        ],
      },
      skip: skipAmount,
      take: limit,
    });

    // Étape 3: Modifier la requête pour compter les événements avec les mêmes conditions
    const eventsCount = await db.event.count({
      where: {
        endDateTime: { gte: new Date() },
        AND: [
          { departement: currentEventDepartmentId },
          { id: { not: eventId } },
        ],
      },
    });

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
