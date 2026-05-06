import { Check } from "lucide-react";

const plans = [
  { name: "Free", price: "$0", period: "/month", features: ["5 daily credits", "Standard support", "Basic license"], cta: "Get Started" },
  { name: "Pro", price: "$29", period: "/month", features: ["200 downloads / month", "Priority support", "Commercial license", "Early access"], cta: "Go Pro", featured: true },
  { name: "Studio", price: "$99", period: "/month", features: ["Unlimited credits", "Dedicated manager", "Extended license", "API access"], cta: "Contact Sales" },
];

export default function PricingPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-16">
      <h1 className="text-4xl font-semibold text-center">Simple, transparent pricing</h1>
      <p className="text-neutral-600 text-center mt-3">Choose a plan that fits your workflow.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {plans.map((p) => (
          <div key={p.name} className={`p-8 border ${p.featured ? "border-black bg-black text-white" : "border-neutral-200"}`}>
            <h3 className="text-sm font-semibold tracking-wide">{p.name.toUpperCase()}</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-4xl font-bold">{p.price}</span>
              <span className={p.featured ? "text-neutral-300" : "text-neutral-500"}>{p.period}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><Check className="w-4 h-4 mt-0.5" /> {f}</li>
              ))}
            </ul>
            <button className={`mt-8 w-full rounded-full py-3 text-sm font-medium ${p.featured ? "bg-white text-black" : "bg-black text-white"}`}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
