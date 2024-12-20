"use server";
import { db } from "../db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetFavoriteEvent,
  GetRelatedEventsByCategoryParams,
  GetSuggestionEventsParams,
  UpdateEventParams,
} from "@/types";

import { getUserById } from "./user.actions";
import { currentRole } from "../auth";
import { Role } from "@prisma/client";
import { handleError } from "../utils";

import { departements } from "@/constants";

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
    console.log("FUNCTION CREATE EVENT", event);
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

    // Validation de maxPlaces
    if (typeof event.maxPlaces !== "number" || event.maxPlaces < 0) {
      throw new Error("Invalid maxPlaces value");
    }

    // Créer l'événement sans les tags
    const newEvent = await db.event.create({
      data: {
        ...event,
        stock: event.maxPlaces,
        category: event.category,
        organizer: userId,
        tags: {
          connect: event.tags?.map((tag) => ({ id: tag.id })) || [],
        },
      },
    });

    return newEvent;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update event");
  }
};

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    // Récupérer l'événement à mettre à jour, y compris les tags actuels
    const eventToUpdate = await db.event.findUnique({
      where: { id: event.id },
      include: { tags: true },
    });

    if (!eventToUpdate || eventToUpdate.organizer.toString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    // Calculer la différence de stock
    let stockDifference = 0;
    if (
      event.maxPlaces !== undefined &&
      event.maxPlaces !== eventToUpdate.maxPlaces
    ) {
      stockDifference = event.maxPlaces - eventToUpdate.maxPlaces;
    }

    // Gérer les tags
    const currentTagIds = eventToUpdate.tags.map((tag) => tag.id);
    const newTagIds = event.tags?.map((tag) => tag.id) || [];

    console.log("CURRENT TAGS", currentTagIds);

    // Tags à ajouter
    const tagsToConnect = newTagIds
      .filter((id) => !currentTagIds.includes(id))
      .map((id) => ({ id }));

    // Tags à retirer
    const tagsToDisconnect = currentTagIds
      .filter((id) => !newTagIds.includes(id))
      .map((id) => ({ id }));

    // Mettre à jour l'événement avec les nouveaux tags
    const updatedEvent = await db.event.update({
      where: { id: event.id },
      data: {
        ...event,
        category: event.category,
        stock: eventToUpdate.stock + stockDifference, // Mettre à jour le stock
        tags: {
          disconnect: tagsToDisconnect,
          connect: tagsToConnect,
        },
      },
    });

    // Revalidation du chemin pour les changements côté client
    revalidatePath(path);

    return updatedEvent;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update event");
  }
}

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
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    return {
      ...event,
      description: event.description ?? "Aucune description disponible",
      Category:
        event.Category && event.Category.name
          ? { name: event.Category.name }
          : {
              name: "Non spécifiée",
            },
      Organizer: {
        ...event.Organizer,
        organizationName: event.Organizer.organizationName ?? "Non spécifié",
      },
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

    const eventsQuery = await db.event.findMany({
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

    const events = eventsQuery.map((event) => ({
      ...event,
      Category:
        event.Category && event.Category.name
          ? { name: event.Category.name }
          : {
              name: "Non spécifiée",
            },
      Organizer: {
        id: event.Organizer.id,
        organizationName: event.Organizer.organizationName,
      },
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
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

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
      Category:
        event.Category && event.Category.name
          ? { name: event.Category.name }
          : {
              name: "Non spécifiée",
            },
      Organizer: {
        id: event.Organizer.id,
        organizationName: event.Organizer.organizationName,
      },
      isUpcoming: new Date(event.endDateTime) > currentDate,
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
      Category:
        event.Category && event.Category.name
          ? { name: event.Category.name }
          : {
              name: "Non spécifiée",
            },
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

    const currentDate = new Date();

    // const conditions = {
    //   $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    // };

    const eventsQuery = await db.event.findMany({
      where: {
        endDateTime: { gte: new Date() },
        AND: [
          { departement: currentEventDepartmentId },
          { id: { not: eventId } },
        ],
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
            id: true,
          },
        },
      },
      skip: skipAmount,
      take: limit,
    });

    const events = eventsQuery.map((event) => ({
      ...event,
      description: event.description ?? "Aucune description disponible",
      Category:
        event.Category && event.Category.name
          ? { name: event.Category.name }
          : {
              name: "Non spécifiée",
            },
      Organizer: {
        id: event.Organizer.id,
        organizationName: event.Organizer.organizationName,
      },
    }));

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

export const getEventsByUserPreferences = async ({
  userId,
  limit,
  page,
}: GetSuggestionEventsParams) => {
  // Récupérer l'utilisateur et ses tags
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { tags: true },
  });

  console.log("USER", user);

  if (!user) {
    throw new Error("User not found");
  }

  const userDepartment = user.departement;
  const userTagIds = user.tags.map((tag) => tag.id);

  console.log("USER DEPARTMENT", userDepartment);
  console.log("USER TAG IDS", userTagIds);

  const skipAmount = (Number(page) - 1) * limit;

  // Récupérer les événements ayant le même département et au moins un tag similaire
  const events = await db.event.findMany({
    where: {
      departement: userDepartment ?? undefined,
      // tags: {
      //   some: {
      //     id: { in: userTagIds },
      //   },
      // },
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
          id: true,
        },
      },
    },
    orderBy: { nbFav: "desc" },
    skip: skipAmount,
    take: limit,
  });

  console.log("EVENTS", events);

  return {
    data: events,
    totalPages: Math.ceil(events.length / limit),
  };
};
