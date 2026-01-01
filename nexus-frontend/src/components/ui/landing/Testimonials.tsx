import Section from './Section';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Testimonial {
  stars: number;
  text: string;
  name: string;
  role: string;
  img: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    stars: 5,
    text: `"Nexus completely changed the way I manage my web projects. The sync speed is honestly unbelievable."`,
    name: 'Sarah Jenkins',
    role: 'Frontend Dev @ TechCorp',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzZs6SaLLNHO2Z0vzlyIcyBGIur5di2dsTmtyN8jMNNS_XA63PPqBlZ8IX4PfeQudz0iS715SNLBRW3IIER3DNq_KIiLXTUAcm46dX8H-H0A3h0EEgECH0xkmYV8JtPJkasaY4hAloD_RADQIrKtr-Ld0RwJEzcwg_x6PwQe0dxUFc_RF4fLnpCmUKqvu6RAaeketxD555d7iWKKi5BQJ4WCvtttPOI_WkTPO2s9puHX094fU9VBrsDJe-DWzfG4Ngw-JAqyON6oXN',
  },
  {
    stars: 5,
    text: `"The security features give me peace of mind. It's rare to find a tool that looks this good and works this well."`,
    name: 'Marcus Chen',
    role: 'CTO @ FinStart',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-HBwv_uB1kbz88ExRUi060aB9pvY5nTOzWC03NAWSAvB4mMvMjs6C529CEv_7_BE_s90gOXbP7VyAfd8Cej_xqH0BzizficluMXIW_FpzVs1mFuS3aYHmCZL2m-Rhb6QcwC44WBcjCFgSzEC6GbonjJS4_VTTkNGsA0RpWksLz1FpHdSI7wWDrQu-Z66Z1wBtokXnqvnEbGLWeIOp3mtsG44DuSKSmVSBUsu8Rk4P1MQQsJ9gLW9xPrRUo8uA_90H7ppIWB1NpiUk',
  },
  {
    stars: 5,
    text: `"Finally, a dashboard that doesn't feel like a spreadsheet. The analytics are actionable and beautiful."`,
    name: 'Elara Vane',
    role: 'Freelance Designer',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwzCjpdu20d4BTbbOexmEBDvNwhnNkhpG3fi1Zy30SEjvXHq9H07sOgXKgbJi_PfuGVaHapA9Zzhl6lWb4Tw5blI6l4-2NK15CnfrEf6WV9DWetO-OQzSygCBnoRhahgr-bQo0B8yru7piDynfZ07tc7bk8w9RPZqjg2cAZSTlm-0rISRx_-w5TGWZMeIPGUMuAV6a97dR0Sn1kzF4YY5ypKX6GHSMBuKFIV8r2W8rMWbvoD9DaBkRe1M4JV5UL2fUWwdZeBLH6U-0',
  },
];

interface StarsProps {
  value: number;
}

function Stars({ value }: StarsProps) {
  return (
    <div className="flex items-center gap-1 text-[#46ec13]">
      {Array.from({ length: Math.floor(value || 0) }).map((_, i) => (
        <Star key={i} className="size-4 fill-[#46ec13]" />
      ))}
    </div>
  );
}

/**
 * ИСПРАВЛЕНО: Добавлена проверка на существование name.
 * Если name === undefined, метод .split(" ") вызовет ошибку, которую вы видели.
 */
function initials(name: string): string {
  if (!name) return '??';
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => (p ? p[0].toUpperCase() : ''))
    .join('');
}

interface TestimonialCardProps {
  stars: number;
  text: string;
  name: string;
  role: string;
  img: string;
}

function TestimonialCard({ stars, text, name, role, img }: TestimonialCardProps) {
  return (
    <Card className="min-w-[280px] rounded-2xl border-white/10 bg-[#1f3319]/45 backdrop-blur-md shadow-[0_0_40px_rgba(70,236,19,0.08)] sm:min-w-0">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <Stars value={stars} />
        <p className="text-sm font-medium leading-relaxed text-gray-200/80">{text}</p>

        <div className="mt-auto flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={img} alt={name || 'User'} />
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-bold text-white">{name || 'Anonymous'}</div>
            <div className="text-xs text-gray-400">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  return (
    <Section
      className="py-16 md:py-24 bg-[#142210]"
      glowClassName="right-10 top-24 h-80 w-80 bg-[#46ec13]/10 blur-[180px]"
    >
      <div className="mb-8 px-2 text-center sm:text-left">
        <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">What Users Say</h3>
        <p className="mt-2 text-sm text-gray-400">Trusted by over 10,000 developers worldwide.</p>
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {/* Используем опциональную проверку массива на всякий случай */}
        {(TESTIMONIALS || []).map((t, idx) => (
          <TestimonialCard key={t.name || idx} {...t} />
        ))}
      </div>
    </Section>
  );
}


