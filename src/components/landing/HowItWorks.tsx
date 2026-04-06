import { ClipboardPaste, Settings2, Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardPaste,
    title: "Paste your content",
    description:
      "Drop in a blog post, newsletter, script, or any long-form content. We handle the rest.",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Choose your platforms",
    description:
      "Select which platforms you want to publish to — Twitter, LinkedIn, Instagram, newsletters, or all of them.",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  {
    number: "03",
    icon: Zap,
    title: "Get 20+ ready-to-post pieces",
    description:
      "In seconds, get platform-optimized content that sounds like you wrote each piece by hand. Copy, paste, publish.",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-20 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-light">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Three steps.{" "}
            <span className="gradient-text">Thirty seconds.</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted text-lg">
            No complicated setup, no learning curve. Just paste and go.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Connecting line (desktop only) */}
          <div className="pointer-events-none absolute top-16 left-[20%] right-[20%] hidden md:block">
            <div className="h-px w-full bg-gradient-to-r from-violet-500/40 via-cyan-500/40 to-amber-500/40" />
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative text-center">
                {/* Step number */}
                <div className="relative mx-auto mb-6">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${step.borderColor} ${step.iconBg} bg-surface`}
                  >
                    <Icon className={`h-7 w-7 ${step.iconColor}`} />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-light border border-border text-xs font-bold text-muted">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto max-w-xs text-muted leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
