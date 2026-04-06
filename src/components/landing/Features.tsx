import { Sparkles, MessageSquare, Copy, Clock } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Multi-Platform Magic",
    description:
      "Paste once, get content for Twitter, LinkedIn, Instagram, and newsletters. Each piece is native to the platform.",
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
  },
  {
    icon: MessageSquare,
    title: "AI That Gets Your Voice",
    description:
      "Our AI doesn't just rewrite — it adapts your tone, style, and key points for each platform's unique audience.",
    gradient: "from-cyan-500 to-blue-600",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
  },
  {
    icon: Copy,
    title: "One-Click Copy",
    description:
      "Every generated piece comes with a copy button. No formatting issues, no manual tweaking needed.",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
  },
  {
    icon: Clock,
    title: "Save Hours Weekly",
    description:
      "What used to take 3+ hours now takes 30 seconds. Focus on creating, not copy-pasting.",
    gradient: "from-emerald-500 to-green-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-light">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to{" "}
            <span className="gradient-text">repurpose at scale</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted text-lg">
            Stop spending hours reformatting. Let AI handle the grunt work while you focus on creating great content.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-surface/50 p-8 transition-all duration-300 hover:border-primary/30 hover:bg-surface"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.iconBg}`}>
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
