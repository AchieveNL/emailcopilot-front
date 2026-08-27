# Email Copilot 2

## Project Overview

Email Copilot 2 is a Next.js application designed to help users manage and automate email operations through AI-powered copilot functionality.

## Project Structure

### Root Level

- `drizzle.config.ts` - Database ORM configuration
- `eslint.config.mjs` - Linting configuration
- `next.config.ts` - Next.js configuration
- `package.json` - Project dependencies and scripts
- `postcss.config.mjs` - CSS processing configuration
- `tsconfig.json` - TypeScript configuration

### Source Code (`src/`)

#### App Directory (`src/app/`)

Contains Next.js app router pages and layouts:

- **`layout.tsx`** - Root layout wrapper
- **`globals.css`** - Global styles
- **`(app)/`** - Grouped routes for authenticated app sections:
  - `billing/` - Billing and subscription management
  - `copilots/` - Copilot management and creation
    - `new/` - Create new copilot page
  - `dashboard/` - Main dashboard view
  - `email-profiles/` - Email Account management
  - `integrations/` - Third-party integrations
  - `target-audiences/` - Web scraping configuration
  - `settings/` - User settings
  - `templates/` - Email Templates

#### Components (`src/components/`)

- **`layout/Sidebar.tsx`** - Application sidebar navigation
- **`ui/`** - Reusable UI components:
  - `CopilotSummary.tsx` - Copilot overview component
  - `Step1Settings.tsx` - Settings configuration step
  - `Step2EmailProfile.tsx` - Email profile setup step
  - `Step3ScrapeProfile.tsx` - Scrape profile setup step
  - `Step4Launch.tsx` - Launch configuration step
  - `Stepper.tsx` - Multi-step form stepper component

#### Store (`src/store/`)

- `copilotStore.ts` - State management for copilot data

## Key Features

- **Copilot Management** - Create and manage AI-powered email copilots
- **Email Profile Management** - Connect and manage multiple email accounts
- **Web Scraping** - Configure profiles for scraping web content
- **Multi-step Setup** - Guided wizard for complex configurations
- **Dashboard** - Central hub for monitoring and control
- **Billing** - Subscription and payment management
- **Settings** - User preferences and configuration

## Technology Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Database**: Drizzle ORM
- **Styling**: PostCSS
- **Linting**: ESLint
- **Package Manager**: pnpm

## Getting Started

1. Install dependencies: `pnpm install`
2. Configure environment variables as needed
3. Set up database with Drizzle: `pnpm drizzle-kit`
4. Run development server: `pnpm dev`
5. Build for production: `pnpm build`

## Development Notes

- The app uses a grouped route structure `(app)/` for organizing authenticated pages
- State management is handled in the `store/` directory using `copilotStore`
- UI components are modular and located in `components/ui/`
- The stepper component supports multi-step workflows for complex user flows
