import Section from "./Section";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ShieldCheck, BarChart3, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  { icon: Zap, title: "Instant Sync", desc: "Seamlessly sync across all devices in milliseconds using our proprietary low-latency network." },
  { icon: ShieldCheck, title: "Bank-Grade Security", desc: "Enterprise-level AES-256 encryption ensures your data remains yours, always." },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track your growth with live dashboards and AI-driven insights delivered instantly." },
];

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

function FeatureCard({ icon: Icon, title, desc }: FeatureCardProps) {
  return (
    <Card className="group rounded-2xl border-white/10 bg-[#1f3319]/55 backdrop-blur-md shadow-[0_0_40px_rgba(70,236,19,0.08)] transition-all hover:border-[#46ec13]/40 hover:bg-[#1f3319]/75">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#46ec13]/20 to-[#46ec13]/5 text-[#46ec13] shadow-inner">
          <Icon className="size-5" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <p className="text-sm font-medium leading-relaxed text-gray-300/80">
            {desc}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Features() {
  return (
    <Section className="py-16 md:py-24" glowClassName="left-1/3 top-10 h-80 w-80 bg-[#46ec13]/12 blur-[170px]">
      <div className="mb-8 flex items-end justify-between px-2">
        <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Why Nexus?
        </h3>
        <div className="h-1 w-12 rounded-full bg-[#46ec13]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </Section>
  );
}







