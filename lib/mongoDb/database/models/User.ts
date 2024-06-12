import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String, required: true },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
  description: { type: String, default: "" },
  instagram: { type: String, default: "" },
  twitter: { type: String, default: "" },
  tiktok: { type: String, default: "" },
  followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
});

const User = models.User || model("User", UserSchema);

export default User;
