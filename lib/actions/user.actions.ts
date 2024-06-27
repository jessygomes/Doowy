"use server";
import { revalidatePath } from "next/cache";
import {
  CreateUserParams,
  GetSuscriptionEvent,
  UpdateUserParams,
} from "@/types";
import { handleError } from "../utils";
import { connectToDb } from "../mongoDb/database";
import User from "../mongoDb/database/models/User";
import Event from "../mongoDb/database/models/Event";
import Order from "../mongoDb/database/models/Order";
import Category from "../mongoDb/database/models/Category";

//! CREER UN USER
export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDb();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

//! GET USER BY ID
export async function getUserById(userId: string) {
  try {
    await connectToDb();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

//! GET USER BY ID
export async function getUserByIdForProfile(userId: string, fields: string) {
  try {
    await connectToDb();

    const user = await User.findById(userId, fields);

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

//! UPDATE USER
export async function updateUser({ userId, user, path }: UpdateUserParams) {
  console.log("UPDATE USER", userId, user, path);
  try {
    await connectToDb();

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { ...user },
      {
        new: true,
      }
    );
    revalidatePath(path);

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

//! DELETE USER
export async function deleteUser(clerkId: string) {
  try {
    await connectToDb();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

//! AJOUTER AUX FAVORIS
export async function addFavoriteEvent({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) {
  try {
    await connectToDb();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    const isLiked = user.wishlist
      .map((event: any) => event._id.toString())
      .includes(eventId);

    // Trouver l'événement et incrémenter nbFav
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    event.nbFav = Number(event.nbFav) || 0;

    if (isLiked) {
      user.wishlist = user.wishlist.filter(
        (event: any) => event._id.toString() !== eventId
      );
      event.nbFav = Math.max(event.nbFav - 1, 0);
      await event.save();
    } else {
      user.wishlist.push(eventId);

      event.nbFav = event.nbFav + 1;
      await event.save();
    }
    await user.save();

    return JSON.parse(JSON.stringify(user));
  } catch (error: string | any) {
    handleError(error);
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
    await connectToDb();

    const skipAmount = (Number(page) - 1) * 6;

    const user = await User.findById(userId).populate({
      path: "wishlist",
      populate: [
        { path: "organizer" },
        { path: "category", model: Category, select: "_id name" },
      ],

      options: { sort: { createdAt: "desc" }, skip: skipAmount, limit: 6 },
    });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user.wishlist));
  } catch (error) {
    handleError(error);
  }
}

//! ADD & REMOVE FOLLOWER
export async function addOrRemoveFollower({
  userId,
  followerId,
}: {
  userId: string;
  followerId: string;
}) {
  try {
    await connectToDb();

    const currentUser = await User.findById(userId);
    if (!currentUser) throw new Error("currentUser not found");

    const userToFollow = await User.findById(followerId);
    if (!userToFollow) throw new Error("userToFollow not found");

    const isFollowed = currentUser.following.includes(followerId);
    console.log("isFollowed -- ACTIONS", isFollowed);

    if (isFollowed) {
      // Retirer l'ID de l'utilisateur courant de la liste des followers de l'utilisateur à suivre
      // currentUser.following = currentUser.following.filter(
      //   (idToFollow: string) => idToFollow !== followerId
      // );
      // userToFollow.followers = userToFollow.followers.filter(
      //   (IdOfUserFollowing: string) => IdOfUserFollowing !== userId
      // );
      await User.findByIdAndUpdate(userId, {
        $pull: { following: followerId },
      });
      await User.findByIdAndUpdate(followerId, {
        $pull: { followers: userId },
      });
    } else {
      // Ajouter l'ID de l'utilisateur à suivre à la liste des following de l'utilisateur courant
      // currentUser.following.push(followerId);
      // userToFollow.followers.push(userId);
      await User.findByIdAndUpdate(userId, {
        $push: { following: followerId },
      });
      await User.findByIdAndUpdate(followerId, {
        $push: { followers: userId },
      });
    }

    // await currentUser.save();
    // await userToFollow.save();

    return JSON.parse(JSON.stringify(currentUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getFollowers({ userId }: { userId: string }) {
  try {
    await connectToDb();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user.following));
  } catch (error) {
    handleError(error);
  }
}

export async function getEventSubscriptions({
  userId,
  limit = 6,
  page,
}: GetSuscriptionEvent) {
  try {
    await connectToDb();

    // Étape 1: Trouver l'utilisateur et obtenir la liste des abonnements
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Pour gérer la pagination : calcul du nombre d'éléments à ignorer
    const skipAmount = (Number(page) - 1) * limit;

    // Étape 2: Trouver les événements organisés par les abonnements
    const events = await Event.find({
      organizer: { $in: user.following },
    })
      .populate("organizer", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit); // Ajoutez d'autres champs si nécessaire

    const eventsCount = await Event.countDocuments();

    // Étape 3: Retourner les événements formatés
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
