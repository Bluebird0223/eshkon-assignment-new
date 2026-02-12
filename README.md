# Eshkon - Premium RBAC Content Platform

Eshkon is a modern, high-performance content management platform built with Next.js 16, featuring a multi-level Role-Based Access Control (RBAC) system and a rich WYSIWYG page builder.

## ✨ Core Features

### 🔐 Multi-Level RBAC
- **Super Admin**: Full system access, including user role management and all content permissions.
- **Admin**: Can manage all pages, preview drafts, and publish content.
- **Editor**: Can create, edit, and manage their own page drafts.
- **Viewer**: Read-only access to the dashboard and public pages.

### 📝 WYSIWYG Page Builder
- **Rich Text Editor**: Integrated Tiptap editor with support for headings, lists, code blocks, and blockquotes.
- **Auto-slugging**: Real-time URL-friendly slug generation from page titles.
- **Draft/Publish Flow**: Secure workflow for content creation and approval.

### 📊 Modern Dashboard
- **Dynamic Statistics**: Overview of total pages, published status, and user distribution.
- **Premium UI**: Clean, responsive layout using Tailwind CSS and Lucide icons.

## 🛠️ Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- A Neon PostgreSQL database

### 2. Installation
```bash
git clone https://github.com/Bluebird0223/eshkon-assignment.git
cd eshkon-assignment
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="your_neon_connection_string"
NEXTAUTH_SECRET="your_random_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
```bash
# Push schema to database
npx drizzle-kit push

# Seed the database with test users
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```

## 🧪 Test Users
| Email | Password | Role |
| :--- | :--- | :--- |
| `super@example.com` | `password123` | Super Admin |
| `admin@example.com` | `password123` | Admin |
| `editor@example.com` | `password123` | Editor |
| `viewer@example.com` | `viewer123` | Viewer |

## 📦 Deployment on Vercel
For detailed instructions on deploying to Vercel, please refer to [deployment.md](./deployment.md).

## 🛠️ Maintenance & Compatibility
This project is optimized for **Next.js 15/16+**:
- Handles asynchronous `params` and `searchParams`.
- Optimized for **Edge Runtime** compatibility.
- Fixed SSR hydration for rich text components.
