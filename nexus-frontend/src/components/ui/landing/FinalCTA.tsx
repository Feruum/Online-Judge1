import Section from "./Section";
import { Button } from "@/components/ui/button";
import { Rocket, Download } from "lucide-react";

export default function FinalCTA() {
  return (
    <Section
      className="py-16 md:py-24"
      glowClassName="left-1/2 top-10 h-72 w-72 -translate-x-1/2 bg-[#46ec13]/18 blur-[160px]"
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-[#46ec13]/10 p-4">
          <Rocket className="size-10 text-[#46ec13]" />
        </div>

        <h2 className="text-3xl font-black text-white md:text-4xl">
          Ready to join the Nexus?
        </h2>

        <p className="text-base text-gray-400">
          Get started today and take control of your digital infrastructure. No credit
          card required.
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <Button className="h-14 rounded-full bg-[#46ec13] px-8 text-lg font-bold text-[#142210] shadow-[0_0_15px_rgba(70,236,19,0.4)] hover:bg-[#46ec13] hover:shadow-[0_0_25px_rgba(70,236,19,0.6)]">
            <Download className="mr-2 size-5" />
            Download Now
          </Button>
          <p className="mt-2 text-xs text-gray-500">Available on iOS and Android</p>
        </div>
      </div>
    </Section>
  );
}







