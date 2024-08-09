import UserForm2 from "@/components/shared/UserForm2";
import { getUserByIdForProfile } from "@/lib/actions/user.actions";
import { currentUser } from "@/lib/auth";
import Ripple from "@/components/magicui/ripple";

export default async function UpdateProfil() {
  const user = await currentUser();

  if (!user) {
    return (
      <>
        <section className=" py-5 md:py-10 ">
          <h3 className="wrapper h3-bold text-center sm:text-left">
            Modifier mon profil
          </h3>
        </section>
        <div></div>
      </>
    );
  }

  const userId = user.id;
  const userProfile = await getUserByIdForProfile(userId ?? "");
  console.log(userProfile);

  return (
    <>
      <section className="">
        <div className="relative flex w-screen flex-col items-end justify-end overflow-hidden bg-background bg-dark shadowCj pt-20 sm:pt-20">
          <Ripple />
          <h3 className="wrapper h3-bold text-center sm:text-left">
            Modifier mon profil
          </h3>
        </div>
      </section>
      <div className="wrapper my-8">
        {user && userProfile && <UserForm2 organizer={userProfile} />}
      </div>
    </>
  );
}
