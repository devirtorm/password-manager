# Vercel Deployment Guide

This document will guide you step by step to deploy your password manager on Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Create an account at [vercel.com](https://vercel.com)
2. **GitHub Account**: Make sure your project is in a GitHub repository
3. **Environment Variables**: Have your Supabase credentials ready

## 🚀 Deployment Steps

### 1. Prepare the Repository

Make sure your code is up to date on GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect with Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Select "Import Git Repository"
4. Connect your GitHub account if you haven't already
5. Select the `password-manager-v2` repository
6. Click "Import"

### 3. Configure Environment Variables

In the project configuration page on Vercel:

1. Go to the "Environment Variables" section
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### 4. Build Configuration

Vercel will automatically detect that it's a Next.js project. The default configuration should work:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Deploy

1. Click "Deploy"
2. Wait for the build to finish (usually takes 1-3 minutes)
3. Once completed, you'll get a production URL

## 🔧 Additional Configuration

### Custom Domain

If you want to use your own domain:

1. Go to the "Domains" section in your Vercel project
2. Add your custom domain
3. Configure DNS according to Vercel's instructions

### Environment Variables for Different Environments

- **Development**: For local testing
- **Preview**: For development branches
- **Production**: For the main branch

### Supabase Configuration

Make sure to configure allowed URLs in Supabase:

1. Go to your Supabase project
2. Go to Authentication > URL Configuration
3. Add your Vercel URL to "Site URL" and "Redirect URLs"

## 📊 Monitoring

Vercel provides:

- **Analytics**: Performance metrics
- **Logs**: For debugging
- **Speed Insights**: Speed analysis

## 🚨 Troubleshooting

### Build Failed

If the build fails:

1. Check the logs in Vercel
2. Make sure environment variables are configured
3. Verify that the project compiles locally with `npm run build`

### Supabase Errors

If there are connection issues with Supabase:

1. Verify environment variables
2. Check allowed URLs in Supabase
3. Confirm that the keys are correct

### Performance

To optimize performance:

1. Use image compression
2. Implement lazy loading
3. Minimize bundle size

## 🔄 Future Updates

To update your application:

1. Make changes to your local code
2. Commit and push to GitHub
3. Vercel will automatically deploy

## 📞 Support

If you have issues:

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
