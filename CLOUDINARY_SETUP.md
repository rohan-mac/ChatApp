# Cloudinary Upload System - Implementation Guide

## Overview

This document describes the production-ready Cloudinary file upload system that replaces local file storage with cloud-based uploads.

## Key Changes

### ✅ Completed Improvements

1. **Memory-Only Storage**
   - Multer configured with `memoryStorage()` only
   - No disk storage or `/uploads` folder
   - Files streamed directly to Cloudinary

2. **Separated Middleware**
   - Created `uploadMiddleware.js` with validation
   - Two separate uploaders: `uploadAvatar` (5MB, images only) and `uploadAttachment` (20MB, mixed types)
   - MIME type validation built into middleware
   - File size validation at middleware level

3. **Production-Ready Service Layer**
   - New `uploadService.js` with clean API
   - Separate functions for avatars and attachments
   - Comprehensive error handling with specific error messages
   - Proper Cloudinary folder structure (chat-app/images, chat-app/videos, chat-app/documents, chat-app/avatars)

4. **Enhanced Cloudinary Config**
   - Throws error if credentials missing (production-safe)
   - Removed fallback to local URLs
   - Added utilities for file deletion and URL signing

5. **Updated Controllers**
   - `userController.js` uses `uploadProfilePicture()` from mediaService
   - `messageController.js` uses `uploadAttachment()` with proper error handling
   - No more try-catch silencing - errors bubble up to error middleware

6. **Logging**
   - Comprehensive debug and info logging throughout
   - Error logs include error codes and details for debugging

## Architecture

```
Request Flow:
  Frontend (FormData) 
    ↓
  Route with uploadMiddleware (validation)
    ↓
  Controller (receives req.file)
    ↓
  mediaService function (uploadProfilePicture or uploadAttachment)
    ↓
  uploadService function (uploadToCloudinary)
    ↓
  Cloudinary API
    ↓
  Database stores: { url, public_id, type, name, size }
```

## Database Schema

### User Model - profilePic
```javascript
profilePic: { type: String, default: '' }
// Stores: "https://res.cloudinary.com/.../v123456/chat-app/avatars/filename.jpg"
```

### Message Model - attachments
```javascript
attachments: [{
  url: { type: String, required: true },           // Cloudinary secure_url
  public_id: { type: String },                      // For deletion
  type: { enum: ['image', 'video', 'document'] },  // File category
  name: { type: String, maxlength: 200 },          // Original filename
  size: { type: Number },                           // Bytes
  width: { type: Number },                          // Image width
  height: { type: Number },                         // Image height
  duration: { type: Number }                        // Video duration in seconds
}]
```

## File Size & Type Limitations

### Avatars
- Maximum: 5MB
- Allowed types: JPEG, PNG, GIF, WebP

### Message Attachments
- Maximum: 20MB
- Allowed types:
  - Images: JPEG, PNG, GIF, WebP
  - Videos: MP4, MOV, AVI
  - Documents: PDF, DOC, DOCX, TXT

## Environment Variables

Create/update `.env.example` and ensure `.env` contains:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

**All three are REQUIRED** - the system will throw an error during startup if any are missing.

### Where to find credentials:

1. Go to [Cloudinary Console](https://cloudinary.com/console/)
2. Click on your cloud name in the top toolbar
3. Copy:
   - **Cloud Name** (top of page)
   - **API Key** (Settings tab)
   - **API Secret** (Settings tab - keep this private!)

## Implementation Files

### New Files Created

1. **`backend/src/middleware/uploadMiddleware.js`**
   - Exports: `uploadAvatar`, `uploadAttachment`, `fileUtils`
   - Validates MIME types and file sizes
   - Replaces inline multer configuration

2. **`backend/src/services/uploadService.js`**
   - Exports: `uploadToCloudinary()`, `uploadAvatar()`, `uploadMessageAttachment()`
   - Core upload logic with stream handling
   - Comprehensive error handling

### Modified Files

1. **`backend/src/config/cloudinary.js`**
   - Enhanced error handling
   - Requires all credentials at startup
   - Added utility functions

2. **`backend/src/services/mediaService.js`**
   - Removed local fallback (`local://` URLs)
   - Uses new `uploadService` functions
   - Cleaner interface

3. **`backend/src/routes/userRoutes.js`**
   - Uses `uploadAvatar` middleware from `uploadMiddleware`
   - Removed inline multer config

4. **`backend/src/routes/messageRoutes.js`**
   - Uses `uploadAttachment` middleware from `uploadMiddleware`
   - Removed inline multer config

5. **`backend/src/controllers/userController.js`**
   - Uses `uploadProfilePicture()` from mediaService
   - Better error handling and logging
   - No more silent failures

6. **`backend/src/controllers/messageController.js`**
   - Uses `uploadAttachment()` from mediaService
   - Proper error propagation
   - Added debug logging

## Error Handling

The system now properly handles:

- ✅ Missing Cloudinary credentials (throws at startup)
- ✅ Invalid MIME types (400 Bad Request at middleware)
- ✅ File size exceeded (400/413 at middleware)
- ✅ Cloudinary auth failures (500 with specific message)
- ✅ Upload timeouts (408 Request Timeout)
- ✅ Stream errors (500 with details)

## Testing

### Test Avatar Upload
```bash
curl -X PATCH http://localhost:5000/api/users/me \
  -H "Authorization: Bearer TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

### Test Message Attachment
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F 'body={"chatId":"...", "text":"Check this out"}'
```

## Production Deployment

### On Render.com

1. Set environment variables in Render dashboard:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

2. Restart the service

3. Monitor logs for upload success/errors

### Cleanup (Remove old local storage)

1. Delete `/uploads` folder if it exists (no longer needed)
2. Remove any references to `diskStorage` in old code
3. Update any documentation referencing local uploads

## Database Migration (if needed)

If you have existing local URLs in the database, you can:

1. Keep them as-is (they won't break anything, just won't display)
2. Delete old message/avatar records with `local://` prefix:
   ```javascript
   await User.updateMany(
     { profilePic: { $regex: '^local://' } },
     { profilePic: '' }
   );
   ```

## Monitoring & Debugging

### Check Upload Status
- Look for `logger.info('Avatar uploaded successfully')` in logs
- Look for `logger.info('Message sent successfully')` with `hasAttachment: true`

### Debug Failed Uploads
- Check Cloudinary credentials in .env
- Look for `logger.error('Cloudinary upload failed')` with error code
- Verify file size/type against limits

### Verify Cloudinary Connection
```javascript
// In any controller - CloudenaryConnects at startup
const cloudinary = require('cloudinary').v2;
console.log(cloudinary.config().cloud_name); // Should print your cloud name
```

## Rollback (if needed)

To revert to previous system:
1. Restore `mediaService.js` with fallback logic
2. Restore inline multer in routes
3. Restore old controller code

However, this is NOT recommended as the new system is more robust.

## Cost Implications

Cloudinary free tier includes:
- 25 GB storage
- 25 GB bandwidth/month
- Unlimited uploads
- Basic transformations

For production apps, consider Cloudinary paid plans based on your usage.

## Best Practices

1. **Don't expose API Secret** - Never commit to repo, keep in `.env`
2. **Use different folders** - Helps organize and manage uploads
3. **Store public_id** - Needed for deletion/updates
4. **Monitor bandwidth** - Set up Cloudinary alerts
5. **Optimize images** - Use Cloudinary transformations on frontend

## Support & Troubleshooting

### Issue: "Cloudinary authentication failed"
- ✅ Verify credentials in .env
- ✅ Restart backend service
- ✅ Check on https://cloudinary.com/console that credentials are correct

### Issue: "File size exceeds limit"
- ✅ Check actual file size
- ✅ Increase limits in `uploadMiddleware.js` if needed (⚠️ requires testing)

### Issue: "Timeout" errors
- ✅ Usually means slow network or very large file
- ✅ Increase timeout in `uploadService.js` (currently 60s for attachments)

### Issue: Uploads work on localhost but not production
- ✅ Verify Cloudinary credentials set in Render environment
- ✅ Check firewall/CORS isn't blocking Cloudinary
- ✅ Verify free tier isn't exhausted
