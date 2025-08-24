# password-manager
Modern and simple password manager built with Next.js 14, TypeScript, and Supabase. Secure password storage with categories and search.

## ✨ Features

**🔒 Secure Password Storage** - End-to-end encrypted password storage
**📁 Category Management** - Organize passwords with custom categories and colors
**🔍 Smart Search** - Quickly find passwords with real-time search functionality
**🗑️ Trash System** - Safely delete and restore passwords when needed
**🎨 Modern UI** - Clean, responsive design with dark/light mode support
**🔐 Master Password** - Additional security layer with master password protection
**📱 Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

**Framework**: Next.js 15
**Language**: TypeScript
**Styling**: Tailwind CSS
**UI Components**: shadcn components
**Database**: Supabase (PostgreSQL)
**Authentication**: Supabase Auth
**Icons**: Lucide React
**Notifications**: Sonner

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

### Installation
1. Clone the repository with `git clone https://github.com/devirtorm/password-manager.git`.  
2. Install dependencies using `npm install`.  
3. Create a `.env.local` file in the root of the project and add your Supabase credentials:  
   `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`  
   `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key`  
4. Start the development server with `npm run dev`.  
5. Open `http://localhost:3000` in your browser.

## 🚀 Deployment

### Deploy to Vercel

This project is optimized for deployment on Vercel. Follow these steps:

1. **Push to GitHub**: Make sure your code is in a GitHub repository
2. **Connect to Vercel**: Import your repository from [vercel.com](https://vercel.com)
3. **Configure Environment Variables**: Add your Supabase credentials in Vercel dashboard
4. **Deploy**: Vercel will automatically build and deploy your application

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Development
npm run dev
```  

