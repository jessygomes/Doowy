import UserForm2 from "@/components/shared/UserForm2";
import { getUserByIdForProfile } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";

export default async function UpdateProfil() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const userProfile = await getUserByIdForProfile(
    userId,
    "firstName lastName photo description instagram twitter tiktok"
  );

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 ">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Modifier mon profil
        </h3>
      </section>
      <div className="wrapper my-8">
        <UserForm2 user={userProfile} userId={userId} />
      </div>
    </>
  );
}
