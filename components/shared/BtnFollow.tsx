"use client";
import { IEvent } from "@/lib/mongoDb/database/models/Event";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { addOrRemoveFollower } from "@/lib/actions/user.actions";
import { useState } from "react";

const BtnFollow = ({
  userToFollowId,
  isFollowing,
}: {
  userToFollowId: string;
  isFollowing: any;
}) => {
  const { user } = useUser();
  const currentUserId = user?.publicMetadata.userId as string;

  const [isFollow, setIsFollow] = useState(isFollowing);

  const handleFollow = async () => {
    try {
      await addOrRemoveFollower({
        userId: currentUserId,
        followerId: userToFollowId,
      });
      setIsFollow(!isFollow);
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris", error);
    }
  };

  const isCurrentUser = currentUserId === userToFollowId;

  return (
    <>
      <SignedOut>
        <Button asChild className=" rounded-full">
          <Link href="/sign-in">Suivre</Link>
        </Button>
      </SignedOut>

      <SignedIn>
        {!isCurrentUser ? (
          <Button onClick={handleFollow} className="rounded-full">
            {isFollow ? "Abonné" : "Suivre"}
          </Button>
        ) : (
          <Button disabled className="rounded-full">
            {/* {user?.following} favoris */}
          </Button>
        )}
      </SignedIn>
    </>
  );
};

export default BtnFollow;
