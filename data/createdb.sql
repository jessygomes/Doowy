BEGIN;

DROP TABLE IF EXISTS "user", "event", "category", "user_wishlist", "user_followers", "user_following" CASCADE;

--! TABLE USER
CREATE TABLE "user" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(255) NOT NULL,
  "departement" VARCHAR(255),
  "photo" VARCHAR(255),
  "description" TEXT,
  "instagram" VARCHAR(255),
  "twitter" VARCHAR(255),
  "tiktok" VARCHAR(255),
  "followers" INTEGER DEFAULT 0,
  "following" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--! TABLE EVENT
CREATE TABLE "event" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "location" VARCHAR(255) NOT NULL,
  "departement" VARCHAR(255) NOT NULL,
  "startDateTime" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endDateTime" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "imageUrl" VARCHAR(255) NOT NULL,
  "price" VARCHAR(255),
  "isFree" BOOLEAN NOT NULL,
  "url" VARCHAR(255),
  "category" INTEGER, -- CLE ETRANGERE "category" table
  "organizer" INTEGER, -- CLE ETRANGERE "user" table
  "nbFav" INTEGER DEFAULT 0,
  "stock" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("category") REFERENCES "category"("id"),
  FOREIGN KEY ("organizer") REFERENCES "user"("id")
);

--! TABLE CATEGORY
CREATE TABLE "category" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL
);

--! WIHSLIST
-- Création de la table de liaison "user_wishlist" pour la relation "one-to-many" avec "event"
CREATE TABLE "user_wishlist" (
  "userId" INTEGER NOT NULL,
  "eventId" INTEGER NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
  FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE,
  PRIMARY KEY ("userId", "eventId")
);

--! FOLLOWERS & FOLLOWING
-- Création de la table de liaison "user_followers" pour la relation "many-to-many" (followers)
CREATE TABLE "user_followers" (
  "userId" INTEGER NOT NULL,
  "followerId" INTEGER NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
  FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE,
  PRIMARY KEY ("userId", "followerId")
);

-- Création de la table de liaison "user_following" pour la relation "many-to-many" (following)
CREATE TABLE "user_following" (
  "userId" INTEGER NOT NULL,
  "followingId" INTEGER NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
  FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE,
  PRIMARY KEY ("userId", "followingId")
);

COMMIT;