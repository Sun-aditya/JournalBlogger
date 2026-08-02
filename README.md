# field.notes

A personal engineering blog for Aditya Kumar Maurya. The site is a place to publish build logs and notes on developer tools, backend systems, DevOps, and problem solving.

## Features

- Editorial home page and responsive blog archive.
- Public blog feed backed by Supabase.
- Individual posts at `/blog/[slug]`.
- Private `/admin` dashboard with Supabase authentication.
- Draft and publish workflow.
- Categories, URL slugs, summaries, and post content.
- Secure Cloudinary cover-image and inline-image uploads.
- Inline images render wherever they were inserted in an article.
- Portfolio link: <https://os-portfolio-livid.vercel.app/>.

## Tech stack

- Next.js + TypeScript
- Supabase: PostgreSQL, authentication, and row-level security
- Cloudinary: image storage and delivery
- Vercel: deployment
- Custom CSS with Zilla Slab, Public Sans, and JetBrains Mono

## Local development

```bash
pnpm install
pnpm dev
```

Open <https://fieldnotes-gamma.vercel.app>.

## Environment variables

Create `.env.local` from `.env.example` and provide your own values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_or_publishable_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Never commit `.env.local`, expose the Cloudinary API secret, or use a Supabase service-role key in browser code.

## Supabase setup

1. Create a Supabase project.
2. Run [supabase/schema.sql](supabase/schema.sql) in **SQL Editor**.
3. Set your Vercel deployment URL as **Site URL** in **Authentication → URL Configuration**.
4. Add both the Vercel URL and `http://localhost:3000` to **Redirect URLs**.

## Cloudinary setup

Add the Cloudinary values to `.env.local` locally and to Vercel environment variables for production. Image uploads are signed through `/api/cloudinary/sign` and require an authenticated admin user.

## Publishing workflow

1. Sign in at `/admin`.
2. Click **New post**.
3. Add a title, slug, category, summary, and content.
4. Upload a cover image if needed.
5. Use **Insert image at cursor** to place images inside the post.
6. Select **Save draft** or **Publish now**.
7. Published posts appear automatically on `/blog` and `/blog/[slug]`.

## Deployment

Deploy to Vercel and add every environment variable above in **Project Settings → Environment Variables**. Redeploy after changing environment variables.

## Verify production build

```bash
pnpm run build
```
