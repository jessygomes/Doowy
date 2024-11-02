"use client";

import { logout } from "@/lib/actions/auth.actions";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../shared/Header/AuthContext";

interface LogoutBtnProps {
  children?: React.ReactNode;
}

export const LogoutBtn = ({ children }: LogoutBtnProps) => {
  const router = useRouter();

  const onClick = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <span onClick={onClick} className="rounded-full cursor-pointer">
      {children}
    </span>
  );
};
