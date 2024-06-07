import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

type UserFormProps = {
  user: {
    username: string;
    description: string;
    instagram: string;
    twitter: string;
    tiktok: string;
  };
};

const UserForm = ({ user }: UserFormProps) => {
  const initialValue = {
    username: user.username,
    description: user.description,
    instagram: user.instagram,
    twitter: user.twitter,
    tiktok: user.tiktok,
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="button hidden sm:flex">Modifier</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier mes informations</SheetTitle>
          <SheetDescription>
            Cliquez sur sauvegarder pour enregistrer les modifications.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Pseudo
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Instagram
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              X
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              TikTok
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Sauvegarder</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserForm;
