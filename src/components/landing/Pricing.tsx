import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "For trying things out",
    features: ["3 repurposes / month", "All platforms", "Standard processing"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For serious creators",
    badge: "Most Popular",
    features: [
      "50 repurposes / month",
      "All platforms",
      "Priority processing",
      "Email support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Unlimited",
    price: "$79",
    period: "/mo",
    description: "For teams and agencies",
    features: [
      "Unlimited repurposes",
      "All platforms",
      "Priority processing",
      "Priority support",
      "API access",
    ],
    cta: "Go Unlimited",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-light">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple pricing.{" "}
            <span className="gradient-text">No surprises.</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted text-lg">
            Start free, upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl border p-8 transition-all duration-300 ${
                tier.highlighted
                  ? "border-primary/50 bg-surface glow-purple md:scale-105 md:-my-4 md:py-12"
                  : "border-border bg-surface/50 hover:border-border hover:bg-surface"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-primary to-violet-500 px-4 py-1 text-xs font-semibold text-white">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                <p className="text-sm text-muted">{tier.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted">{tier.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary-light" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40"
                    : "border border-border text-foreground hover:bg-surface-light"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
