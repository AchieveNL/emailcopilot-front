This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

Create `.env.local` in the project root (including the leading dot). Next.js
does not load a file named `env.local`. Set `NEXT_PUBLIC_API_URL` to the backend
URL and configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and
your Clerk redirect URLs there. Restart the development server after changing
environment variables. Without `NEXT_PUBLIC_API_URL`, the client uses
`http://localhost:3001`.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

emailcopilot/
├── src/
├── app/
│ ├── layout.tsx # Root layout (no font imports — system fonts)
│ ├── page.tsx # Redirects to /copilots
│ ├── globals.css # Tailwind base + custom scrollbar
│ └── dashboard/ # Route group with sidebar layout
│ ├── layout.tsx # Wraps all pages with <Sidebar />
│ ├── copilots/
│ │ ├── page.tsx # Copilots list
│ │ └── new/
│ │ ├── page.tsx # Step 4
│ ├── email-profiles/page.tsx
│ ├── target-audiences/page.tsx
│ ├── templates/page.tsx
│ ├── billing/page.tsx
│ ├── sign-in/
│ ├── sign-up/
├── components/
│ ├── layout/
│ │ └── Sidebar.tsx # Main nav sidebar (client component)
│ └── ui/
│ ├── Stepper.tsx  
 │ └── CopilotSummary.tsx  
 ├── lib/
│ ├── api.ts  
 │ ├── hooks.ts  
 │ ├── providers.tsx  
 │ ├── useBilling.ts
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
