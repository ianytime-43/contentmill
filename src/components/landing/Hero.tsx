import { ArrowRight, Play } from "lucide-react";

function MockAppWindow() {
  return (
    <div className="relative mx-auto max-w-4xl animate-fade-in-up animate-delay-300">
      {/* Glow behind the window */}
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-cyan-500/10 to-primary/20 blur-3xl" />

      {/* Window chrome */}
      <div className="relative rounded-xl border border-border bg-surface overflow-hidden glow-purple">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="ml-2 text-xs text-muted font-mono">contentmill.app</span>
        </div>

        {/* App content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Input side */}
          <div className="border-r border-border p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs font-medium text-muted uppercase tracking-wider">Source Content</span>
            </div>
            <div className="space-y-2 text-sm text-foreground/70 leading-relaxed">
              <p>We just launched our new AI feature that helps teams collaborate 3x faster. Here&apos;s what makes it different from everything else on the market...</p>
              <div className="h-px bg-border" />
              <p className="text-foreground/40">The key insight is that most AI tools try to replace human creativity. We built ours to amplify it instead...</p>
            </div>
          </div>

          {/* Output side */}
          <div className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-light" />
              <span className="text-xs font-medium text-muted uppercase tracking-wider">Generated</span>
            </div>
            <div className="space-y-3">
              {[
                { platform: "Twitter", color: "bg-sky-500/10 text-sky-400 border-sky-500/20", text: "We just shipped something big." },
                { platform: "LinkedIn", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", text: "Excited to announce our latest AI feature..." },
                { platform: "Newsletter", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", text: "This week: How we rethought AI collaboration" },
              ].map((item) => (
                <div key={item.platform} className="rounded-lg border border-border bg-background/50 p-3">
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${item.color} mb-1.5`}>
                    {item.platform}
                  </span>
                  <p className="text-xs text-foreground/60">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvatarGroup() {
  const colors = ["bg-violet-500", "bg-cyan-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500"];
  return (
    <div className="flex items-center gap-3 animate-fade-in-up animate-delay-300">
      <div className="flex -space-x-2">
        {colors.map((color, i) => (
          <div
            key={i}
            className={`h-8 w-8 rounded-full ${color} border-2 border-background flex items-center justify-center text-[10px] font-bold text-white`}
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted">
        Trusted by <span className="text-foreground font-semibold">2,000+</span> creators
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-8">
          <a href="/" className="text-lg font-bold tracking-tight">
            <span className="gradient-text">ContentMill</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/signin" className="hidden sm:inline-block text-sm text-muted hover:text-foreground transition-colors">
            Sign In
          </a>
          <a
            href="/signin"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Powered by Claude AI
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
          One Post.{" "}
          <span className="gradient-text">Every Platform.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up animate-delay-100 mx-auto max-w-2xl text-lg sm:text-xl text-muted leading-relaxed mb-10">
          Turn a single blog post into 20+ ready-to-publish posts for Twitter, LinkedIn, newsletters, and Instagram.{" "}
          <span className="text-foreground">In seconds, not hours.</span>
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up animate-delay-200 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/signin"
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            Start Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
          >
            <Play className="h-4 w-4 text-primary-light" />
            See How It Works
          </a>
        </div>

        {/* Social proof */}
        <div className="flex justify-center mb-20">
          <AvatarGroup />
        </div>

        {/* App mockup */}
        <MockAppWindow />
      </div>
    </section>
  );
}
