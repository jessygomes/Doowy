"use client";
import { getFollowers } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";

type Follower = {
  id: string;
  name: string | null;
  image: string | null;
};

export const PersonnesFollowers = ({ userId }: { userId?: string }) => {
  //! Gestion de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  //! State pour les utilisateurs suivis
  const [followers, setFollowers] = useState<Follower[]>([]);

  useEffect(() => {
    if (userId) {
      const loadFollowingUsers = async () => {
        try {
          const responseFollowers = await getFollowers({ userId });
          console.log("Followers:", responseFollowers);
          setFollowers(responseFollowers || []);
          return responseFollowers;
        } catch (error) {
          console.error(
            "Erreur lors du chargement des utilisateurs suivis:",
            error
          );
          setFollowers([]);
        }
      };
      loadFollowingUsers();
    }
  }, [userId]);

  return (
    <div>
      <button
        onClick={toggleModal}
        className="p-medium-14 flex flex-col-reverse items-center justify-center hover:text-grey-400 transition-all ease-in-out"
      >
        Abonné(e)s <span>{followers.length}</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center z-10 ">
          <div className="flex flex-col gap-4 bg-dark p-8 rounded-sm w-[80%] lg:w-[30%] shadow-2xl">
            <div className="flex flex-row-reverse justify-between items-center border-b-2 border-white">
              <span
                className="close cursor-pointer text-center text-2xl text-white hover:text-red-500"
                onClick={toggleModal}
              >
                &times;
              </span>
              <h2 className="h3-bold text-center rubik">ABONNES</h2>
            </div>
            <ul className="flex flex-col gap-4">
              {followers.map((user: any) => (
                <li
                  key={user.id}
                  className="p-medium-14 rubik hover:text-grey-400 transition-all ease-in-out"
                >
                  <Link href={`/profil/${user.id}`}>
                    <div className="flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-linear-hover">
                          <FaUser className="text-white" />
                        </AvatarFallback>
                      </Avatar>
                      {user.organizationName ?? user.name}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
