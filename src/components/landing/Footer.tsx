export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="text-lg font-bold tracking-tight">
            <span className="gradient-text">ContentMill</span>
          </a>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {["Features", "Pricing", "Sign In", "Privacy", "Terms"].map((link) => (
              <a
                key={link}
                href={link === "Features" ? "#features" : link === "Pricing" ? "#pricing" : "#"}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted">
            &copy; 2026 ContentMill
          </p>
        </div>
      </div>
    </footer>
  );
}
