import Ripple from "@/components/magicui/ripple";

export default function Apropos() {
  return (
    <div className="relative flex h-full w-screen flex-col items-end justify-end overflow-hidden bg-background shadowCj">
      <Ripple />
      <section
        id="events"
        className="wrapper my-30 flex flex-col gap-8 md:gap-12"
      >
        {/* <h2 className="h2-bold">
Trust by <br /> Thousands of Events
</h2> */}
        <div className="flex justify-start items-center gap-8 mt-10 kronaOne">
          <p className="h3-bold text-dark dark:text-white text-xl uppercase">
            à propos de vibey!
          </p>
        </div>
      </section>
    </div>
  );
}
