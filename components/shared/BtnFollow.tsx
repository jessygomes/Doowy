"use client";
import Link from "next/link";
import { useState } from "react";

import { addOrRemoveFollower } from "@/lib/actions/user.actions";
import { useCurrentUser } from "@/hooks/use-current-user";

import { Button } from "../ui/button";

const BtnFollow = ({
  userToFollowId,
  isFollowing,
}: {
  userToFollowId: string;
  isFollowing: boolean;
}) => {
  const [isFollow, setIsFollow] = useState(isFollowing);

  const user = useCurrentUser();
  const currentUserId = user?.id;

  const handleFollow = async () => {
    if (typeof currentUserId === "string") {
      try {
        await addOrRemoveFollower({
          userId: currentUserId,
          targetUserId: userToFollowId,
        });
        setIsFollow(!isFollow);
      } catch (error) {
        console.error("Erreur lors de l'ajout aux favoris", error);
      }
    }
  };

  const isCurrentUser = currentUserId === userToFollowId;

  if (currentUserId === null || currentUserId === undefined) {
    // Si aucun utilisateur n'est connecté, afficher le bouton avec un lien vers la page de connexion
    return (
      <Button asChild className="button rounded-sm">
        <Link href="/auth/connexion">Suivre</Link>
      </Button>
    );
  } else {
    // Si un utilisateur est connecté, afficher le bouton pour suivre ou indiquer déjà suivi
    return (
      <>
        {!isCurrentUser && (
          <Button onClick={handleFollow} className="button">
            {isFollow ? "Abonné(e)" : "Suivre"}
          </Button>
        )}
      </>
    );
  }
};

export default BtnFollow;
