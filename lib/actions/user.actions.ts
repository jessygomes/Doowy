"use server";
import * as z from "zod";

import { db } from "../db";
import { userProfileSchema, userSettingSchema } from "../validator";
import { generateVerificationToken } from "../tokens";
import { sendVerificationEmail } from "../mail";

import { revalidatePath } from "next/cache";
import {
  CreateUserParams,
  DeleteUserParams,
  GetSuscriptionEvent,
  UpdateUserParams,
} from "@/types";
import { handleError } from "../utils";

//! GET USER BY ID ----- PRISMA MODE
export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch {
    return null;
  }
}

//! GET USER BY EMAIL ----- PRISMA MODE
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  } catch {
    return null;
  }
};

//! TOUS LES USERS
export async function getAllUsers() {
  try {
    const users = await db.user.findMany();
    return users;
  } catch {
    return null;
  }
}

//! GET USER BY ID POUR LE PROFIL
export async function getUserByIdForProfile(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        description: true,
        followers: true,
        following: true,
        instagram: true,
        twitter: true,
        tiktok: true,
        departement: true,
        role: true,
        organizationName: true,
        organizationType: true,
        isTwofactorEnabled: true,
        isHidenWishlist: true,
        followersList: {
          select: {
            followerId: true,
          },
        },
        followingList: {
          select: {
            followingId: true,
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
}

//! UPDATE USER FOR PROFILE
export async function updateProfileUser(
  values: z.infer<typeof userProfileSchema>
) {
  // Importation de currentUser ici : éviter les conflits d'importation qui génere une erreur
  const { currentUser } = await import("../auth");
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "User not found" };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User not found" };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Profil mis à jour !" };
}

//! UPDATE USER FOR SETTINGS
export async function updateSettingUser(
  values: z.infer<typeof userSettingSchema>
) {
  const { currentUser } = await import("../auth");
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "User not found" };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User not found" };
  }

  // Le user est connecté avec Google ou pas ? On ne peut pas changer son adresse mail ni avoir une authentification à deux facteurs : on les met à undefined pour que leur valeur ne change pas quoi qu'il arrive.
  if (user.isOAuth) {
    values.email = undefined;
    values.isTwofactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser) {
      return { error: "Email déjà utilisé" };
    }

    // Envoyer un email de vérification
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success:
        "Un email de vérification a été envoyé à votre adresse mail. Veuillez vérifier votre boîte de réception.",
    };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Paramètres mis à jour !" };
}

//! DELETE USER
export const deleteUser = async ({ userId, path }: DeleteUserParams) => {
  try {
    const deletedUser = await db.user.delete({
      where: { id: userId },
    });

    if (deletedUser) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
};

//! AJOUTER AUX FAVORIS
export async function addFavoriteEvent({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { wishlist: true },
    });
    if (!user) throw new Error("User not found");

    // Véririfier si l'événement est déjà dans la wishlist de l'utilisateur
    const isLiked = await db.userWishlist.findFirst({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    console.log("isLiked", isLiked);

    const event = await db.event.findUnique({
      where: { id: eventId },
      select: { nbFav: true },
    });

    // event.nbFav = Number(event.nbFav) || 0;

    if (isLiked) {
      // Si l'event est déja dans les FAV, on le retire et on décrémente le nbFav
      await db.userWishlist.delete({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: eventId,
          },
        },
      });

      if (event && event.nbFav > 0) {
        await db.event.update({
          where: { id: eventId },
          data: {
            nbFav: {
              decrement: 1,
            },
          },
        });
      }
    } else {
      // Si l'event n'est pas dans les FAV, on l'ajoute dans la wishlist et on incrémente le nbFav
      await db.userWishlist.create({
        data: {
          userId: userId,
          eventId: eventId,
        },
      });
      await db.event.update({
        where: { id: eventId },
        data: {
          nbFav: {
            increment: 1,
          },
        },
      });
    }

    // Récupérer l'événement mis à jour pour obtenir le nbFav mis à jour
    const updatedEvent = await db.event.findUnique({
      where: { id: eventId },
      select: { nbFav: true }, // Sélectionner uniquement le nbFav si c'est tout ce dont vous avez besoin
    });

    // Return the updated user and the updated nbFav of the event
    return {
      nbFav: updatedEvent?.nbFav, // Ajouter le nbFav mis à jour à l'objet retourné
    };
  } catch (error: string | any) {
    console.log(error);
    throw new Error(`Erreur lors de l'ajout aux favoris : ${error.message}`);
  }
}

//! GET LA WISHLIST
export async function getWishlist({
  userId,
  page = 1,
}: {
  userId: string;
  page: number;
}) {
  try {
    const skipAmount = (Number(page) - 1) * 6;

    const userWithWishlist = await db.user.findUnique({
      where: { id: userId },
      select: {
        wishlist: {
          take: 6,
          skip: skipAmount,
        },
      },
    });

    if (!userWithWishlist) throw new Error("User not found");

    return userWithWishlist.wishlist;
  } catch (error) {
    console.log(error);
  }
}

//! RECUP DE LA WISHLIST AVEC LES INFOS COMPLETE
export async function getWishlistProfil({
  userId,
  limit = 6,
  page,
}: {
  userId: string;
  limit?: number;
  page: number;
}) {
  try {
    const skipAmount = (page - 1) * limit;

    const wishlistUser = await db.user.findUnique({
      where: { id: userId },
      select: {
        wishlist: true,
      },
    });

    if (!wishlistUser) throw new Error("User not found");

    const eventIds = wishlistUser.wishlist.map((item) => item.eventId);

    // Récupérer les détails complets des événements en utilisant les identifiants extraits.
    const eventsDetails = await db.event.findMany({
      where: {
        id: {
          in: eventIds, // Utiliser l'opérateur `in` pour filtrer les événements par leurs identifiants.
        },
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

    const events = eventsDetails.map((event) => ({
      ...event,
      Category: event.Category?.name,
      Organizer: {
        id: event.Organizer.id,
        organizationName: event.Organizer.organizationName,
      },
    }));

    return {
      data: events,
      totalPages: Math.ceil(events.length / limit),
    };
  } catch (error) {
    console.log(error);
  }
}

//! ADD & REMOVE FOLLOWER
export async function addOrRemoveFollower({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) {
  try {
    const currentUser = await db.user.findUnique({
      where: { id: userId },
    });
    if (!currentUser) throw new Error("User not found");

    const userToFollow = await db.user.findUnique({
      where: { id: targetUserId },
    });
    if (!userToFollow) throw new Error("User not found");

    // Vérifier si l'utilisateur courant suit déjà l'utilisateur à suivre
    const existingFollow = await db.userFollowing.findFirst({
      where: {
        userId: userId,
        followingId: targetUserId,
      },
    });

    console.log("existingFollow", existingFollow);

    if (existingFollow) {
      // Si suivi, retirer le follower et le following
      await db.userFollowing.delete({
        where: {
          userId_followingId: {
            userId: userId, // L'ID de l'utilisateur qui suit
            followingId: userToFollow.id, // L'ID de l'utilisateur à ne plus suivre
          },
        },
      });

      await db.userFollowers.delete({
        where: {
          userId_followerId: {
            userId: targetUserId, // L'ID de l'utilisateur qui est suivi
            followerId: userId, // L'ID de l'utilisateur qui suit
          },
        },
      });
    } else {
      // Si non suivi, ajouter le follower et le following
      await db.userFollowing.create({
        data: {
          userId: userId,
          followingId: targetUserId,
        },
      });

      await db.userFollowers.create({
        data: {
          userId: targetUserId,
          followerId: userId,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

//! GET FOLLOWERS
export async function getFollowers({ userId }: { userId: string }) {
  try {
    const userFollowers = await db.userFollowers.findMany({
      where: { userId: userId },
      select: {
        Follower: {
          select: {
            id: true,
            organizationName: true,
            name: true, // Assurez-vous d'ajuster ceci pour correspondre à votre modèle si vous utilisez firstName + lastName
            image: true,
          },
        },
      },
    });

    if (!userFollowers) throw new Error("User not found");

    return userFollowers.map((follower) => follower.Follower);
  } catch (error) {
    console.log(error);
  }
}

//! GET FOLLOWING USERS
export async function getMyFollowingUsers({ userId }: { userId: string }) {
  try {
    const userFollowing = await db.userFollowing.findMany({
      where: { userId: userId },
      select: {
        Following: {
          select: {
            id: true,
            organizationName: true,
            name: true, // Assurez-vous d'ajuster ceci pour correspondre à votre modèle si vous utilisez firstName + lastName
            image: true,
          },
        },
      },
    });

    if (!userFollowing) throw new Error("User not found");

    return userFollowing.map((follower) => follower.Following);
  } catch (error) {
    console.log(error);
  }
}

//! RECUPERATION DES EVENTS EN FONCTION DES ABONNEMENTS
export async function getEventSubscriptions({
  userId,
  limit = 6,
  page,
}: GetSuscriptionEvent) {
  try {
    // Étape 1: Trouver l'utilisateur et obtenir la liste des abonnements
    const user = await db.userFollowing.findMany({
      where: { userId: userId },
      select: {
        Following: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user) throw new Error("User not found");

    // Liste des IDs des organisateurs suivis
    const followingIds = user.map(
      (userFollowing) => userFollowing.Following.id
    );

    // Filtrer les événements à venir
    const currentDate = new Date();

    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = await db.event.findMany({
      where: {
        organizer: { in: followingIds },
        endDateTime: { gte: currentDate },
      },
      include: {
        Category: {
          select: {
            name: true,
          },
        },
        Organizer: {
          select: { organizationName: true, id: true },
        },
      },
      orderBy: { createdAt: "desc" },
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
        organizer: { in: followingIds },
        endDateTime: { gte: currentDate },
      },
    });

    return {
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    console.log(error);
  }
}
