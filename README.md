# 🇮🇳 BharatCMS

> The Headless CMS for Indian developers.
> Razorpay + GST-ready invoices + Mumbai hosting, built into a Strapi-compatible CMS.

[![Status](https://img.shields.io/badge/status-pre--mvp-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Built in Public](https://img.shields.io/badge/build-in%20public-cyan)]()
[![Made in India](https://img.shields.io/badge/made%20in-🇮🇳-saffron)]()

🌐 **Live preview:** [bharatcms-landing.vercel.app](https://bharatcms-landing.vercel.app)
📅 **Status:** Day 1 of #BuildInPublic — Pre-MVP, pre-revenue, 100% honest scope.

---

## Why BharatCMS?

Every Indian developer wastes 3-4 weeks on every new project setting up the same things:

- ⏳ **2 weeks** integrating Razorpay (docs, webhooks, testing)
- ⏳ **5 days** building GST invoice logic (HSN, tax splits, PDFs)
- ⏳ **3 days** configuring Mumbai-region hosting
- ⏳ **∞ days** wrapping Stripe-first tools that don't fit India

BharatCMS gives you all of this on **day one**.

---

## What's Included

### ✅ Core (in MVP)

| Feature | Status | Description |
|---------|--------|-------------|
| 💳 **Razorpay Plugin** | 🚧 Building | UPI, cards, subscriptions, webhooks |
| 📄 **GST Invoice Generator** | 🚧 Building | PDFs with HSN, CGST/SGST/IGST splits |
| 🇮🇳 **Mumbai Hosting** | ✅ Active | ap-south-1, sub-50ms latency |
| 🔌 **Strapi-Compatible** | ✅ Active | Same APIs, plugins, content types |
| 🔓 **Open Source** | ✅ Active | MIT license, self-host friendly |

### ⏳ Add-ons (Phase 2, pay-as-you-go)

| Feature | Status | Pricing |
|---------|--------|---------|
| 🤖 **AI Helpers** | 📋 Planned | ₹500 / 1K generations |
| 💬 **WhatsApp Notifications** | 📋 Planned | ₹1.50 / message |
| 📧 **Email Sends** | 📋 Planned | ₹200 / 10K emails |
| 💾 **Extra Storage** | 📋 Planned | ₹300 / 50GB |

---

## What it's NOT

To keep expectations honest:

- ❌ **Not a Shopify replacement** — we're a CMS, not a storefront builder
- ❌ **Not Tally / Zoho Books** — generates GST invoices, doesn't file returns
- ❌ **Not WATI / Gupshup** — WhatsApp is a paid usage-based add-on
- ❌ **Not no-code** — for developers, you write code
- ❌ **Not magic AI** — AI is a helper feature, not the core product

> *"We'd rather lose a customer to clarity than win one with confusion."*

---

## Tech Stack

### Backend
- **CMS:** [Strapi v4.25.23](https://strapi.io) (forked, MIT)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL via [Supabase](https://supabase.com) (Mumbai)
- **Storage:** [Cloudflare R2](https://www.cloudflare.com/products/r2/) *(planned)*
- **Email:** [Resend](https://resend.com) *(planned)*
- **Hosting:** [Railway.app](https://railway.app) *(planned)*

### Indian Integrations
- **Payments:** [Razorpay](https://razorpay.com) (UPI, cards, subscriptions)
- **AI:** [Groq](https://groq.com) (free tier, Indic languages)
- **Notifications:** WhatsApp Business API (Meta Cloud) *(planned)*

### Landing Page
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Hosting:** [Vercel](https://vercel.com)

---

## Quick Start

> ⚠️ **Note:** This is a pre-MVP project. Things are changing fast. Use at your own adventure.

### Prerequisites

- Node.js 20+ (use [NVM](https://github.com/nvm-sh/nvm))
- PostgreSQL or Supabase account
- npm or yarn

### Installation

\```bash
# Clone the repo
git clone https://github.com/codecay7/bharatcms.git
cd bharatcms

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, secrets, etc.

# Start development server
npm run develop
\```

Visit **`http://localhost:1337/admin`** to access the admin panel.

---

## Pricing (When Launched)

| Tier | Price | For |
|------|-------|-----|
| **Hobby** | ₹0/mo | Side projects, learning |
| **Starter** ⭐ | ₹499/mo | Indie devs |
| **Pro** | ₹1,499/mo | Studios, startups |
| **Business** | ₹3,999/mo | Agencies, teams |
| **Lifetime Starter** | ₹2,999 once | First 100 only |

Add-ons (AI, WhatsApp, etc.) remain pay-as-you-go on all tiers.

[See full pricing →](https://bharatcms-landing.vercel.app/#pricing)

---

## Roadmap

### Phase 1: Foundation ✅
- [x] Strapi v4 fork + rebrand
- [x] PostgreSQL on Supabase Mumbai
- [x] Custom admin theme
- [x] Landing page live on Vercel

### Phase 2: Razorpay + GST 🚧 (Current)
- [ ] Razorpay plugin (UPI, cards, webhooks)
- [ ] GST invoice PDF generator
- [ ] Subscription management

### Phase 3: Multi-tenant + Auth 📋
- [ ] Clerk authentication
- [ ] Multi-tenant data isolation
- [ ] Customer dashboard

### Phase 4: First Template 📋
- [ ] E-commerce starter schema
- [ ] Storefront frontend
- [ ] End-to-end checkout flow

### Phase 5: AI + WhatsApp Add-ons 📋
- [ ] Groq integration (Vayu AI)
- [ ] WhatsApp Business API
- [ ] Pay-per-use billing

### Phase 6: Public Launch 🚀
- [ ] Product Hunt
- [ ] Indie Hackers
- [ ] Reddit + LinkedIn

---

## Built by

**[Diwakar Kumar](https://github.com/codecay7)** — Solo founder, full-stack developer based in India 🇮🇳

- 🐦 Twitter: [@codecay](https://x.com/codecay)
- 🌐 Live demo: [bharatcms-landing.vercel.app](https://bharatcms-landing.vercel.app)
- 📧 Hire me / collab: kumardiwakar487@gmail.com

> Building in public. Day 1. No fluff. No vapor features. Just shipping.

---

## Contributing

This is currently a solo project in heavy development. Once we hit MVP (~Week 6), contributions will be welcomed.

**For now:**
- ⭐ Star the repo if you'd find this useful
- 📧 Join the waitlist: [bharatcms-landing.vercel.app](https://bharatcms-landing.vercel.app)
- 🐦 Follow the journey on [Twitter](https://x.com/codecay)
- 💬 DM me feedback (especially "this is useless because X")

---

## License

MIT License — see [LICENSE](./LICENSE) and [NOTICE.md](./NOTICE.md) for details.

This project is a fork of [Strapi v4](https://github.com/strapi/strapi) (MIT licensed).

---

## Acknowledgments

Built on the shoulders of giants:

- [Strapi](https://strapi.io) — for the open-source CMS foundation
- [Supabase](https://supabase.com) — for Mumbai-region PostgreSQL
- [Razorpay](https://razorpay.com) — for India's best payment gateway
- [Vercel](https://vercel.com) — for hosting the landing page
- [Next.js](https://nextjs.org) — for the landing page framework

---

<p align="center">
  Built with ❤️ in India 🇮🇳<br>
  <strong>By Indians, for Indians.</strong>
</p>
