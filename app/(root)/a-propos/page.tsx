import Ripple from "@/components/magicui/ripple";

export default function Apropos() {
  return (
    <div className="relative flex w-screen flex-col items-end justify-end overflow-hidden bg-background pb-8 shadowCj">
      <Ripple />
      <div className="h-[1px] w-full bg-white mt-20 sm:mt-24" />
      <section
        id="events"
        className="wrapper my-30 flex flex-col gap-8 md:gap-12"
      >
        <div className="flex justify-start items-center gap-8 mt-2 sm:mt-10 kronaOne">
          <p className="h3-bold text-dark dark:text-white text-xl uppercase z-20">
            à propos de DOOWY!
          </p>
        </div>

        <div className="flex w-full flex-col gap-5 z-20">
          <p className="text-white">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi,
            fugit harum, excepturi quis atque velit laudantium, nulla veritatis
            corrupti repellendus alias doloremque magnam repellat consequatur
            non! Modi necessitatibus molestiae reprehenderit.
          </p>
          <p className="text-white">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi,
            fugit harum, excepturi quis atque velit laudantium, nulla veritatis
            corrupti repellendus alias doloremque magnam repellat consequatur
            non! Modi necessitatibus molestiae reprehenderit.
          </p>
          <p className="text-white">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi,
            fugit harum, excepturi quis atque velit laudantium, nulla veritatis
            corrupti repellendus alias doloremque magnam repellat consequatur
            non! Modi necessitatibus molestiae reprehenderit. Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Consequuntur doloribus
            corrupti, repellat id officia perferendis quod, qui, deserunt alias
            ullam voluptate. Nisi corporis deleniti soluta repellat accusantium
            quod necessitatibus cupiditate?
          </p>
          <p className="text-white">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi,
            fugit harum, excepturi quis atque velit laudantium, nulla veritatis
            corrupti repellendus alias doloremque magnam repellat consequatur
            non! Modi necessitatibus molestiae reprehenderit.
          </p>
        </div>
      </section>
    </div>
  );
}
