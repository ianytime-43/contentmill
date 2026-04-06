# ContentMill - AI Content Repurposer

## Problem
Creators, marketers, and founders spend hours manually repurposing content across platforms. A blog post should become tweets, LinkedIn posts, newsletters, and Instagram captions — but doing this manually is tedious and inconsistent.

## Solution
ContentMill: Paste any content (blog post, article, notes) → instantly get platform-optimized versions for Twitter/X, LinkedIn, Newsletter, and Instagram. Powered by Claude AI.

## Target Users
- Content creators
- Social media managers
- Startup founders
- Marketing teams at small companies

## Pricing
- **Free tier:** 3 repurposes/month
- **Pro ($29/mo):** 50 repurposes/month
- **Unlimited ($79/mo):** Unlimited repurposes + priority processing

## Core Features (MVP)
1. **Content Input:** Paste text or URL of blog post
2. **Platform Selection:** Choose which platforms to generate for
3. **AI Generation:** Claude API generates platform-optimized content
4. **Output Display:** Copy-ready outputs organized by platform
5. **Landing Page:** Professional conversion-optimized page
6. **Auth:** Email/password sign-up
7. **Payments:** Stripe Checkout for Pro/Unlimited plans
8. **Usage Tracking:** Track repurposes per billing cycle

## Platform Outputs
- **Twitter/X:** 5-10 tweet thread + 5 standalone tweets
- **LinkedIn:** 3 professional posts (different angles)
- **Newsletter:** 1 email draft with subject line
- **Instagram:** 3 captions with hashtag suggestions

## Tech Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes
- **AI:** Anthropic Claude API (@anthropic-ai/sdk)
- **Payments:** Stripe Checkout + webhooks
- **Auth:** NextAuth.js with credentials provider
- **Database:** SQLite via better-sqlite3 (simple, no external deps)
- **Deployment:** Vercel-ready

## Non-Goals (MVP)
- URL scraping (paste text only for v1)
- Team/collaboration features
- Content scheduling
- Analytics/tracking of posted content
- Social media API integrations
