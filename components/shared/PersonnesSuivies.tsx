"use client";
import { getMyFollowingUsers } from "@/lib/actions/user.actions";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const PersonnesSuivies = ({ userId }: { userId: string }) => {
  //! Gestion de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  //! State pour les utilisateurs suivis
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
    if (userId) {
      const loadFollowingUsers = async () => {
        try {
          const response = await getMyFollowingUsers({ userId });
          setFollowingUsers(response);
        } catch (error) {
          console.error(
            "Erreur lors du chargement des utilisateurs suivis:",
            error
          );
        }
      };
      loadFollowingUsers();
    }
  }, [userId]);

  return (
    <div>
      <button
        onClick={toggleModal}
        className="p-medium-14 flex flex-col-reverse items-center justify-center hover:text-primary transition-all ease-in-out"
      >
        Suivi(e)s <span>{followingUsers.length}</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center z-10">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border-4 border-primary-500 w-[80%] lg:w-[30%]">
            <div className="flex flex-row-reverse justify-between items-center border-b-2">
              <span
                className="close cursor-pointer text-center text-2xl hover:text-red-500"
                onClick={toggleModal}
              >
                &times;
              </span>
              <h2 className="h2-bold text-center">SUIVI(E)S</h2>
            </div>
            <ul className="flex flex-col gap-4">
              {followingUsers.map((user: any) => (
                <li
                  key={user._id}
                  className="p-medium-14 hover:text-primary transition-all ease-in-out"
                >
                  <Link href={`/profil/${user._id}`}>
                    {user.firstName} {user.lastName}
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
