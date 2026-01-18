# cPanel Deployment Guide for Vite + React Router SPA

## Prerequisites
- cPanel account with FTP/SFTP access
- Domain connected to cPanel
- Node.js NOT required on server (static files only)

## Deployment Steps

### 1. Build for Production
On your local machine:
```bash
npm run build
```
This creates a `dist/` folder with all optimized files.

### 2. Upload to cPanel

#### Via cPanel File Manager:
1. Log into cPanel
2. Go to **File Manager**
3. Navigate to **public_html** (or your domain folder)
4. Delete all existing files (backup first if needed)
5. Upload all files from `dist/` folder:
   - `index.html`
   - `favicon.ico`
   - `manifest.json`
   - `sw.js`
   - `.htaccess` (very important!)
   - `assets/` folder
   - `icons/` folder
   - `images/` folder

#### Via FTP/SFTP (Recommended for large transfers):
1. Use FileZilla or similar FTP client
2. Connect with credentials from cPanel
3. Navigate to `public_html`
4. Upload all `dist/` contents

### 3. Configure .htaccess

The `.htaccess` file in `dist/` handles:
- **SPA Routing**: All requests go to `index.html` (required for React Router)
- **Cache Control**: Optimized caching for different file types
- **Asset Versioning**: Long-term caching for versioned assets

Ensure `.htaccess` is uploaded (it's a hidden file by default).

### 4. Verify Environment Variables

The app uses environment variables set in `.env.local` at build time. These are embedded in the JavaScript:
- `VITE_API_URL` - Backend API endpoint
- `VITE_ADMIN_USERNAME` - Admin credentials
- `VITE_CLOUDINARY_*` - Image upload service
- `VITE_BANK_*` - Payment configs

**Important**: If you need to change these for production, you must:
1. Update `.env.local` locally
2. Run `npm run build` again
3. Re-upload the `dist/` folder

**Alternative**: Modify `.env.local` values before building the production version.

### 5. Test Deployment

1. Visit your domain: `https://yourdomain.com`
2. Navigate to different pages (e.g., `/dashboard`, `/admin`)
3. Check browser console for errors (F12 → Console)
4. Verify API calls are reaching your backend

### 6. Troubleshooting

**Issue**: Page shows 404 when navigating directly to routes
- **Solution**: Ensure `.htaccess` is uploaded and mod_rewrite is enabled on server

**Issue**: API calls failing
- **Solution**: Verify `VITE_API_URL` in `.env.local` points to correct backend endpoint

**Issue**: Styles not loading
- **Solution**: 
  - Hard refresh browser (Ctrl+Shift+R)
  - Check if CSS files are in `assets/` folder
  - Verify file permissions (644 for files, 755 for directories)

**Issue**: Images not loading
- **Solution**: Verify `images/` and `icons/` folders are uploaded with correct permissions

### 7. File Permissions

After uploading, set proper permissions:
- Directories: 755
- Files: 644

Most hosting providers set these automatically, but if needed:
1. Right-click file in cPanel File Manager
2. Select "Change Permissions"
3. Set accordingly

## Post-Deployment Checklist

- ✅ All files uploaded to public_html
- ✅ .htaccess file present and contains mod_rewrite rules
- ✅ API endpoint configured correctly in VITE_API_URL
- ✅ Domain accessible via HTTPS (recommended)
- ✅ SPA routing works (navigate without page reloads)
- ✅ No 404 errors in console
- ✅ Styles and images loading correctly
- ✅ API calls reaching backend successfully

## Directory Structure (dist/)
```
public_html/
├── index.html              (main app file)
├── favicon.ico            (website icon)
├── manifest.json          (PWA config)
├── sw.js                  (service worker)
├── .htaccess              (routing config - CRITICAL)
├── assets/
│   ├── index-*.js         (app bundle - hashed)
│   ├── index-*.css        (styles - hashed)
│   └── [vendor chunks]
├── icons/
│   ├── icon-192.png       (PWA icon)
│   └── icon-512.png       (PWA icon)
└── images/
    └── [static images]
```

## Notes

- The app is a **static SPA** - no server-side rendering needed
- All routing happens in the browser via React Router
- API requests go to your backend (configured in VITE_API_URL)
- The build is production-optimized with minification and code splitting

## Support

For issues, check:
1. Browser DevTools Console (F12)
2. Network tab to verify file loading
3. .htaccess syntax if routing fails
4. cPanel error logs if upload fails
