import { Button } from "@/components/ui/button";
import { Hexagon, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#142210]/80 backdrop-blur-md">
      <div className="flex items-center justify-between p-4 absolute inset-0 z-0 opacity-100 mix-blend-overlay pointer-events-none bg-cover bg-center">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#46ec13]/10 text-[#46ec13]">
            <Hexagon className="size-5" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            Nexus
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <a className="hidden text-sm font-bold text-white/80 hover:text-[#46ec13] sm:block">
            Login
          </a>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/5 text-white hover:bg-white/10"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}







