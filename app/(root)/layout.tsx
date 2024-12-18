import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="relative flex h-screen w-screen overflow-x-hidden flex-col">
        <div className="absolute w-screen z-30">
          <Header />
        </div>
        <main className="flex-1 bg-dark z-20">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
