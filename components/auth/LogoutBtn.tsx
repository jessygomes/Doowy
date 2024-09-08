"use client";

import { logout } from "@/lib/actions/auth.actions";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LogoutBtnProps {
  children?: React.ReactNode;
}

export const LogoutBtn = ({ children }: LogoutBtnProps) => {
  const router = useRouter();

  const onClick = () => {
    logout();
    router.push("/");
    revalidatePath("/");
    toast.success("Déconnexion");
  };
  return (
    <span onClick={onClick} className="rounded-full cursor-pointer">
      {children}
    </span>
  );
};
