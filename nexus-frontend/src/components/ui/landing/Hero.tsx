import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/A-serene-landscape-with-Pokemon-in-their-natural-habitat-perfect-as-a-HD-wallpaper.jpg";

export default function Hero() {
  return (
    <header className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-12 md:py-24 bg-[#142210]">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 opacity-50 mix-blend-soft-light pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#142210]/80 to-[#142210]" />

      {/* Content */}
      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6 text-center">
        <Badge className="rounded-full border border-[#46ec13]/30 bg-[#46ec13]/10 px-3 py-1 text-[#46ec13] shadow-[0_0_15px_rgba(70,236,19,0.4)]">
          v2.0 is Live
        </Badge>

        <h1 className="text-5xl font-black leading-[1.1] tracking-tighter text-white sm:text-6xl md:text-7xl">
          Future of Web <br />
          <span className="text-[#46ec13] drop-shadow-[0_0_15px_rgba(70,236,19,0.25)]">
            Management
          </span>
        </h1>

        <p className="text-lg font-medium leading-relaxed text-gray-300 md:text-xl">
          Control your digital nexus with one tap. Experience the next generation
          of web tools designed for speed and security.
        </p>

        <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            className="
              group
              h-12 rounded-full bg-[#46ec13] px-8 text-[#142210]
              shadow-[0_0_15px_rgba(70,236,19,0.4)]
              transition-all duration-200 ease-out
              hover:scale-105 hover:shadow-[0_0_25px_rgba(70,236,19,0.6)]
              active:scale-95
            "
          >
            Start Free
            <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-full border-white/20 bg-white/5 px-8 text-white hover:bg-white/10 hover:text-white"
          >
            View Demo
          </Button>
        </div>
      </div>
    </header>
  );
}







