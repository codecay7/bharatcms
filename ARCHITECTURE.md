# BharatCMS Architecture

## Multi-Tenancy: HYBRID
- Hobby/Starter/Pro → Shared Strapi + Postgres RLS
- Business → Dedicated instance

## Stack
- CMS: Strapi v4
- DB: Supabase Postgres (Mumbai)
- Hosting: Render
- Auth: Clerk
- Payments: Razorpay
- Storage: Cloudflare R2

## Tenant Isolation
- Every table has `tenant_id` column
- Postgres RLS enforces access
- JWT contains tenant_id
