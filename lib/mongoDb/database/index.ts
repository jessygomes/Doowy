import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Si on a pas de mongoose, on crée un objet vide : Initialisation d'une variable "cache"
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDb = async () => {
  // On vérifie si le cache est déjà connecté (surtout dans le cas, on le lance pour la première fois)
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MongoDB URI is missing");

  // Puis soit on se connecte sur un cache existant ou on crée un nouvelle connexion
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "TurnUpDB",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

// let isConnected: boolean = false;

// export const connectToDb = async (): Promise<void> => {
//   mongoose.set("strictQuery", true);

//   if (isConnected) {
//     console.log("Using existing connection");
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URL || "", {
//       dbName: "TurnUpDB",
//     });
//     isConnected = true;
//     console.log("Connected to database");
//   } catch (error) {
//     console.error("Error connecting to database", error);
//   }
// };
