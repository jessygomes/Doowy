"use server";
import { revalidatePath } from "next/cache";
import { CreateUserParams, UpdateUserParams } from "@/types";
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
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDb();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

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
  } catch (error) {
    handleError(error);
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
