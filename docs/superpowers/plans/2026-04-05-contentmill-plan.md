# ContentMill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready AI content repurposing SaaS that converts blog posts into platform-optimized social media content, with Stripe payments and user auth.

**Architecture:** Next.js App Router full-stack app. Landing page at `/`, app at `/app`. API routes handle Claude AI calls, Stripe webhooks, and auth. SQLite for user/usage data. Server components for pages, client components for interactive UI.

**Tech Stack:** Next.js 14, Tailwind CSS, shadcn/ui, @anthropic-ai/sdk, Stripe, NextAuth.js, better-sqlite3

---

## File Structure

```
src/
  app/
    page.tsx                    # Landing page
    layout.tsx                  # Root layout with fonts, metadata
    globals.css                 # Tailwind + custom styles
    app/
      page.tsx                  # Main app dashboard
      layout.tsx                # App layout with nav
    api/
      auth/[...nextauth]/route.ts  # NextAuth handler
      generate/route.ts         # Claude AI content generation
      webhooks/stripe/route.ts  # Stripe webhook handler
      checkout/route.ts         # Create Stripe checkout session
      usage/route.ts            # Get user usage stats
  lib/
    db.ts                       # SQLite database setup + queries
    ai.ts                       # Claude API content generation
    stripe.ts                   # Stripe client config
    auth.ts                     # NextAuth config
    prompts.ts                  # Platform-specific prompts
  components/
    landing/
      Hero.tsx
      Features.tsx
      Pricing.tsx
      Footer.tsx
    app/
      ContentInput.tsx          # Text input + platform selector
      OutputDisplay.tsx         # Generated content display
      PlatformCard.tsx          # Individual platform output
      UsageBadge.tsx            # Usage counter
      Navbar.tsx                # App navigation
```

---

### Task 1: Project Scaffold + Landing Page

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `tsconfig.json`, `next.config.js`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/components/landing/Hero.tsx`, `Features.tsx`, `Pricing.tsx`, `Footer.tsx`

Build the Next.js project with Tailwind + a high-converting landing page. The landing page must look premium — dark theme, gradients, animations. This is what sells the product.

### Task 2: Database + Auth

**Files:**
- Create: `src/lib/db.ts`, `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`

SQLite database with users table (id, email, password_hash, plan, usage_count, usage_reset_date). NextAuth with credentials provider.

### Task 3: AI Content Generation Engine

**Files:**
- Create: `src/lib/ai.ts`, `src/lib/prompts.ts`
- Create: `src/app/api/generate/route.ts`

Claude API integration with platform-specific prompts. Each platform gets a tailored system prompt that produces native-feeling content. The API route accepts { content, platforms[] } and returns generated content for each platform.

### Task 4: App Dashboard UI

**Files:**
- Create: `src/app/app/page.tsx`, `src/app/app/layout.tsx`
- Create: `src/components/app/ContentInput.tsx`, `OutputDisplay.tsx`, `PlatformCard.tsx`, `UsageBadge.tsx`, `Navbar.tsx`

The main app interface: textarea input, platform checkboxes, generate button, and a beautiful output display with copy buttons for each piece of generated content.

### Task 5: Stripe Payments

**Files:**
- Create: `src/lib/stripe.ts`
- Create: `src/app/api/checkout/route.ts`, `src/app/api/webhooks/stripe/route.ts`
- Create: `src/app/api/usage/route.ts`

Stripe Checkout for Pro ($29) and Unlimited ($79) plans. Webhook handler to update user plan on successful payment. Usage tracking endpoint.

### Task 6: Integration + Polish

Wire everything together. Auth guards on app routes. Usage limits enforcement. Loading states. Error handling. Mobile responsiveness. Final polish pass.
