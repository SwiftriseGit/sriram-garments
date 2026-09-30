import { Truck, RotateCcw, ShieldCheck, Headset } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const features: Feature[] = [
  { icon: Truck, title: "Free Shipping", subtitle: "on orders above ₹999" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "within 7 days" },
  { icon: ShieldCheck, title: "Quality Assured", subtitle: "Premium Fabric" },
  {
    icon: Headset,
    title: "Customer Support",
    subtitle: "We're here to help",
  },
];

export default function FeaturesBanner() {
  return (
    <section className="border-y border-zinc-200 py-5 sm:py-7">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-zinc-200">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-2.5 sm:gap-3 lg:justify-center px-2 sm:px-4"
            >
              <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-600 shrink-0" />
              <div>
                <h4 className="font-semibold text-[12px] sm:text-[13px] text-zinc-900">
                  {feature.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-zinc-500">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
