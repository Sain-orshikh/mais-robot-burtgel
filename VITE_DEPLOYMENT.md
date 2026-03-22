# Frontend Deployment Guide for cPanel

## ✅ Build Completion

The frontend has been successfully converted from Next.js to Vite and built for static deployment!

### What Was Done

1. **Framework Migration**: Converted from Next.js 16.1.0 to Vite 5.0.8 with React Router v6.20.0
2. **Build Generated**: The `dist/` folder is ready for production
3. **SPA Routing Configured**: `.htaccess` file included for client-side routing support

## 📦 Deployment to cPanel

### Prerequisites
- cPanel hosting account with SSH/FTP access
- `dist/` folder from this build

### Deployment Steps

#### Option A: Using FTP (GUI)

1. Connect to your cPanel server via FTP client (e.g., FileZilla)
2. Navigate to `public_html` directory
3. Delete all existing files (if starting fresh)
4. Upload all contents of the `dist/` folder to `public_html`
5. Verify `.htaccess` file was uploaded (hidden file - enable viewing in FTP client)

#### Option B: Using SSH (Terminal)

```bash
# Connect to your server
ssh username@yourdomain.com

# Navigate to public_html
cd public_html

# Clear existing files (optional)
rm -rf *

# Upload files (from your local machine, not on server)
# Use SCP from your local terminal:
scp -r dist/* username@yourdomain.com:~/public_html/
```

#### Option C: Using cPanel File Manager

1. Log into cPanel
2. Go to **File Manager**
3. Navigate to **public_html**
4. Click **Upload** and upload the `dist/` folder contents
5. Make sure `.htaccess` is visible (enable hidden files in File Manager)

### File Structure in public_html

```
public_html/
├── .htaccess              (SPA routing - CRITICAL)
├── index.html             (Entry point)
├── favicon.ico
├── manifest.json          (PWA manifest)
├── sw.js                  (Service worker)
├── assets/                (CSS and JS files)
├── icons/                 (App icons)
├── images/                (Static images)
└── news/                  (News data)
```

## 🔧 Post-Deployment Configuration

### 1. cPanel Settings

In cPanel, set your primary domain to point to `public_html`:

1. Go to **Domains**
2. Select your domain
3. Ensure **Document Root** is set to `public_html`

### 2. SSL/HTTPS Configuration

1. Go to **AutoSSL** or **SSL/TLS**
2. Install a free Let's Encrypt certificate
3. Ensure all traffic is redirected to HTTPS

### 3. Environment Variables

The frontend uses `VITE_*` environment variables. These are baked into the build, so ensure you built with the correct:

- `VITE_API_URL` - Backend API URL (e.g., https://api.yourdomain.com)
- `VITE_ADMIN_USERNAME` - Admin username for admin panel
- `VITE_ADMIN_PASSWORD` - Admin password for admin panel

If you need to change these after deployment, you must **rebuild and redeploy**.

## ✨ Testing After Deployment

### 1. Verify Basic Functionality

- Visit `https://yourdomain.com/` - should show login page
- Try navigating to different routes (they should all load index.html)
- Test responsive design on mobile devices

### 2. Test SPA Routing

- Visit `https://yourdomain.com/login` directly - should load without 404
- Visit `https://yourdomain.com/dashboard/events` - should work
- F5 refresh on any page - should maintain content (not 404)

### 3. Browser Console

- Open DevTools (F12)
- Check **Console** tab for any errors
- Check **Network** tab to ensure API calls reach your backend

### 4. Performance

- Go to [Google PageSpeed Insights](https://pagespeed.web.dev/)
- Enter your domain
- Check for any critical issues

## 🔄 Rebuilding & Redeploying

If you need to make changes:

```bash
# Make your code changes
# Then rebuild:
npm run build

# The dist/ folder will be updated
# Upload the new dist/* contents to public_html

# Or use this command to deploy with SCP:
npm run build && scp -r dist/* username@yourdomain.com:~/public_html/
```

## 📝 Important Files

| File | Purpose |
|------|---------|
| `.htaccess` | Enables SPA routing (ALL requests without file/folder → index.html) |
| `index.html` | Entry point for the entire SPA |
| `dist/assets/index-*.js` | Bundled React app (minified) |
| `dist/assets/index-*.css` | Tailwind CSS styles (minified) |
| `manifest.json` | PWA manifest for installable app |
| `sw.js` | Service worker for offline support |

## 🚀 Backend Integration

Ensure your backend is running and accessible:

- **Backend URL**: Must match `VITE_API_URL` in environment variables
- **CORS**: Backend must allow requests from your frontend domain
- **Database**: Connected and migrations applied

## ❌ Troubleshooting

### 404 Errors on Page Refresh

**Symptom**: Page works on navigation but shows 404 on F5 refresh

**Solution**: Ensure `.htaccess` file is in `public_html` and mod_rewrite is enabled

```bash
# Check .htaccess is present:
ls -la public_html/.htaccess

# If missing, re-upload it
```

### CSS Not Loading

**Symptom**: Page loads but looks unstyled

**Solution**: Check browser DevTools Network tab for 404s on CSS files

- Verify `assets/` folder was uploaded
- Check file paths in HTML

### API Calls Failing

**Symptom**: Login form shows error after submission

**Solution**: 
1. Check `VITE_API_URL` is correct
2. Verify backend is running and accessible
3. Check CORS headers on backend
4. Use browser DevTools Network tab to inspect API requests

### Performance Issues

**Symptom**: Slow page load or freezing

**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Check cPanel CPU/Memory usage in Resource Usage
- Consider upgrading hosting plan if consistently high

## 📞 Support

For cPanel-specific issues, contact your hosting provider's support team.

For application-specific issues, check the browser console for error messages.

---

**Deployment Complete! Your React Router SPA is now running on cPanel.** 🎉
