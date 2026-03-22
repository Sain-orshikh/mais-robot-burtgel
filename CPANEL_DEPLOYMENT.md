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

### 1a. (Optional but Recommended) Zip the dist/ folder
Zipping makes upload faster, especially on slow connections:

**On Windows (PowerShell):**
```bash
Compress-Archive -Path dist -DestinationPath dist.zip
```

**On Mac/Linux:**
```bash
zip -r dist.zip dist/
```

This creates `dist.zip` - much smaller and faster to upload than individual files.

### 2. Upload to cPanel

#### Option A: Upload Individual Files (Slower)

##### Via cPanel File Manager:
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

#### Option B: Upload ZIP File (Faster - Recommended)

##### Via cPanel File Manager:
1. Log into cPanel → **File Manager**
2. Navigate to **public_html**
3. Delete existing files (or upload to new domain)
4. Upload `dist.zip` 
5. Right-click `dist.zip` → **Extract**
6. Select destination as current folder (`public_html`)
7. All files will be extracted automatically
8. Delete the `dist.zip` file after extraction

##### Via cPanel Compressed File Manager:
1. UploEnvironment Variables

**Important Understanding:**
- Vite processes environment variables **at build time**
- Your `.env.local` values are compiled directly into the JavaScript
- **NO .env file is needed in public_html** - values are already embedded
- The app works completely standalone after build

**If you need to change variables for different environments:**
1. Create environment-specific files:
   ```bash
   .env.local              # Local development
   .env.production         # For production build
   .env.staging           # For staging build
   ```

2. Build for the target environment:
   ```bash
   npm run build                                    # Uses .env.local
   npm run build -- --mode production             # Uses .env.production
   ```

3. Upload the resulting `dist/` folder

**Example .env.production:**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_PASSWORD=your_admin_password
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_secret
VITE_BANK_NAME=Bank_Name
VITE_BANK_ACCOUNT_NAME=Account_Name
VITE_BANK_ACCOUNT_NUMBER=Account_Number
```

Then build with: `npm run build -- --mode production`

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
