import { currentUser } from "@/lib/auth";
import { getUserByIdForProfile } from "@/lib/actions/user.actions";
import { SettingForm } from "@/components/auth/SettingForm";

export default async function ParametreProfil() {
  const user = await currentUser();

  if (!user) {
    return (
      <>
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 ">
          <h3 className="wrapper h3-bold text-center sm:text-left">
            Paramètres
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
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 ">
        <h3 className="wrapper h3-bold text-center sm:text-left">Paramètres</h3>
      </section>
      <div className="wrapper my-8">
        {user && userProfile && (
          <SettingForm type={user.role} userProfile={userProfile} />
        )}
      </div>
    </>
  );
}
