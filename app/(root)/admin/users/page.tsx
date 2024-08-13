import { getAllUsers } from "@/lib/actions/user.actions";

import Ripple from "@/components/magicui/ripple";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmationUser";
import Link from "next/link";

export default async function UserAdminPage() {
  const users = await getAllUsers();
  console.log("users", users);

  const organizers = users.filter((user) => user.role === "organizer");
  const regularUsers = users.filter((user) => user.role === "user");

  return (
    <>
      {" "}
      <div className="relative flex h-min-screen w-screen flex-col items-end justify-end overflow-hidden bg-background pb-8 shadowCj">
        <Ripple />
        <section
          id="events"
          className="wrapper my-30 flex flex-col gap-8 md:gap-12"
        >
          <div className="flex flex-col justify-start  gap-8 mt-20 kronaOne z-10">
            <p className="h4-bold text-white text-xl uppercase ">
              Organisateurs
            </p>
            <div>
              {organizers.map((organizer) => (
                <div
                  key={organizer.id}
                  className="flex gap-8 justify-between items-center py-2 px-4 bg-transparent backdrop-blur-xl text-sm text-white border-b"
                >
                  <div className="col-span-1 flex items-center gap-8">
                    <Avatar>
                      <AvatarImage src={organizer.image || ""} />
                      <AvatarFallback className="bg-linear-hover">
                        <FaUser className="text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/profil/${organizer.id}`}
                      className="hover:text-second transition-all ease-in-out duration-300"
                    >
                      {organizer.organizationName}
                    </Link>
                  </div>
                  <p>{organizer.name}</p>
                  <p>{organizer.organizationType}</p>
                  <p>{organizer.email}</p>
                  <DeleteConfirmation userId={organizer.id} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="events"
          className="wrapper my-30 flex flex-col gap-8 md:gap-12"
        >
          <div className="flex flex-col justify-start  gap-8 mt-20 kronaOne z-10">
            <p className="h4-bold text-white text-xl uppercase z-10">
              Utilisateurs
            </p>
            <div>
              {regularUsers.map((regularUser) => (
                <div
                  key={regularUser.id}
                  className="grid grid-cols-3 items-center justify-between py-2 px-4 bg-transparent backdrop-blur-xl text-sm text-white border-b"
                >
                  <div className="col-span-1 flex items-center gap-8">
                    <Avatar>
                      <AvatarImage src={regularUser.image || ""} />
                      <AvatarFallback className="bg-linear-hover">
                        <FaUser className="text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/profil/${regularUser.id}`}
                      className="hover:text-second transition-all ease-in-out duration-300"
                    >
                      {regularUser.name}
                    </Link>
                  </div>
                  <p className="col-span-1 flex justify-center">
                    {regularUser.email}
                  </p>
                  <div className="col-span-1 flex justify-end">
                    <DeleteConfirmation userId={regularUser.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
