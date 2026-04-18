# Cloudinary Upload System - Developer API Reference

## Module Structure

### Middleware Layer (`uploadMiddleware.js`)

```javascript
import { uploadAvatar, uploadAttachment, fileUtils } from '../middleware/uploadMiddleware.js';

// Use in routes
router.patch('/me', uploadAvatar.single('avatar'), authMiddleware, updateProfile);
router.post('/', uploadAttachment.single('file'), authMiddleware, sendMessage);
```

**Exports:**
- `uploadAvatar` - Multer instance for profile pictures
- `uploadAttachment` - Multer instance for message files
- `fileUtils` - Utilities for file validation

**Default Behavior:**
- If file validation fails: Returns 400 error with specific message
- If file passes: Attached to `req.file` with buffer
- Error types automatically thrown by middleware

### Service Layer (`uploadService.js`)

```javascript
import { 
  uploadToCloudinary, 
  uploadAvatar, 
  uploadMessageAttachment,
  uploadMultipleFiles 
} from '../services/uploadService.js';

// Upload single avatar
const result = await uploadAvatar(req.file);
// Returns: { url, public_id, type, name, size, width, height }

// Upload single attachment
const result = await uploadMessageAttachment(req.file);
// Returns: { url, public_id, type, name, size, width, height, duration }

// Upload multiple files
const results = await uploadMultipleFiles(req.files, 'attachment');
// Returns: Array of upload results
```

**Function Signatures:**

#### `uploadToCloudinary(file, options)`
```javascript
/**
 * @param {Object} file - Multer file object with buffer
 * @param {Object} options
 *   - folder: string (default: 'chat-app/documents')
 *   - resourceType: 'image' | 'video' | 'auto' (default: 'auto')
 *   - timeout: number in ms (default: 60000)
 * @returns {Promise<Object>}
 *   - url: Cloudinary secure URL
 *   - public_id: ID for deletion/management
 *   - type: 'image' | 'video' | 'document'
 *   - name: Original filename
 *   - size: File size in bytes
 *   - width: Image width (if image)
 *   - height: Image height (if image)
 *   - duration: Video duration in seconds (if video)
 * @throws {AppError} 400/408/413/500
 */
```

#### `uploadAvatar(file)`
```javascript
/**
 * Upload user profile avatar
 * Pre-configured: folder='chat-app/avatars', resourceType='image', timeout=30s
 * Validates: 5MB max, image only
 * 
 * @returns {Promise<Object>} Upload result
 * @throws {AppError} 400/500
 */
```

#### `uploadMessageAttachment(file)`
```javascript
/**
 * Upload message attachment (smart routing)
 * Auto-detects file type and routes to correct folder:
 *   - Images → chat-app/images
 *   - Videos → chat-app/videos
 *   - Documents → chat-app/documents
 * Validates: 20MB max, supported types only
 * 
 * @returns {Promise<Object|null>} Upload result or null if no file
 * @throws {AppError} 400/500
 */
```

### Media Service Layer (`mediaService.js`)

```javascript
import { 
  uploadAttachment,
  uploadProfilePicture,
  extractPublicIdFromUrl
} from '../services/mediaService.js';

// In controllers
const attachments = await uploadAttachment(req.file);
// Returns: [{ url, public_id, type, name, size, ... }]

const avatarUrl = await uploadProfilePicture(req.file);
// Returns: "https://res.cloudinary.com/.../chat-app/avatars/..."

const publicId = extractPublicIdFromUrl(url);
// Extract public ID for deletion: "chat-app/avatars/filename"
```

### Configuration (`cloudinary.js`)

```javascript
import cloudinary, { 
  isCloudinaryEnabled,
  generateSignedUrl,
  deleteCloudinaryFile 
} from '../config/cloudinary.js';

// Check if Cloudinary is configured
if (isCloudinaryEnabled) {
  // Safe to use uploadService
}

// Future: Generate signed URL for secure delivery
const signedUrl = generateSignedUrl('chat-app/images/file123');

// Future: Delete file after user deletes message
await deleteCloudinaryFile('chat-app/images/file123', 'image');
```

## Data Flow Diagrams

### Avatar Upload Flow
```
Frontend Form Submit
    ↓
FormData { avatar: File }
    ↓
PATCH /api/users/me
    ↓
uploadAvatar.single('avatar')
    ↓ [Valid: 5MB, image only]
ValidaRequest middleware
    ↓
userController.updateProfile
    ↓
uploadProfilePicture(req.file)
    ↓
uploadAvatar() in uploadService
    ↓
uploadToCloudinary() in uploadService
    ↓
cloudinary.uploader.upload_stream
    ↓
Cloudinary API
    ↓
Return: { url, public_id, ... }
    ↓
User.findByIdAndUpdate({ profilePic: url })
    ↓
Response: { user: { profilePic: "https://..." } }
    ↓
Frontend updates profile picture
```

### Message Attachment Flow
```
Frontend Chat Input
    ↓
User selects file + types message
    ↓
FormData { file: File, body: { chatId, text } }
    ↓
POST /api/messages
    ↓
uploadAttachment.single('file')
    ↓ [Valid: 20MB, supported type]
validateRequest middleware
    ↓
messageController.sendMessage
    ↓
uploadAttachment(req.file)
    ↓
uploadMessageAttachment() in uploadService
    ↓
[Detect file type: image/video/document]
    ↓
uploadToCloudinary(file, { folder: 'chat-app/...' })
    ↓
cloudinary.uploader.upload_stream
    ↓
Cloudinary API
    ↓
Return: { url, public_id, type, ... }
    ↓
Message.create({
  attachments: [{ url, public_id, type, ... }]
})
    ↓
Chat.update({ lastMessageId: message._id })
    ↓
Socket emit: 'message:new'
    ↓
Response: { message: { attachments: [...] } }
    ↓
Frontend displays message with attachment
```

## Error Handling Flow

```
Request received
    ↓
[MIDDLEWARE LAYER]
├─ File missing? → No error (file optional for profile)
├─ File invalid type? → 400 AppError via fileFilter
├─ File too large? → 400/413 AppError via fileFilter
└─ File valid? → Pass to controller
    ↓
[SERVICE LAYER]
├─ uploadToCloudinary() error
│   ├─ Auth error (401/403)? → 500 "Cloudinary authentication failed"
│   ├─ Size check failed? → 413 "File too large"
│   ├─ Timeout? → 408 "File upload timeout"
│   └─ Other? → 500 "File upload failed: [message]"
└─ Returns result
    ↓
[CONTROLLER LAYER]
├─ Catches service errors
├─ Logs error
└─ Throws to error middleware
    ↓
[ERROR MIDDLEWARE]
├─ Formats error response
├─ Logs full error
└─ Response: { message, statusCode }
    ↓
Frontend receives error with specific message
```

## Example Usage in Controllers

### Profile Update

```javascript
import { uploadProfilePicture } from '../services/mediaService.js';
import { AppError } from '../lib/appError.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};

  // Process text fields
  if (req.validated.body.name) {
    updates.name = req.validated.body.name;
  }

  // Process avatar file if provided
  if (req.file) {
    try {
      const avatarUrl = await uploadProfilePicture(req.file);
      updates.profilePic = avatarUrl;
    } catch (error) {
      logger.error('Avatar upload failed', { error });
      throw error; // Error middleware handles it
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.json({ message: 'No updates', user: req.user });
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-passwordHash');

  res.json({ message: 'Profile updated', user });
});
```

### Message Send

```javascript
import { uploadAttachment } from '../services/mediaService.js';
import { AppError } from '../lib/appError.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, text = '' } = req.validated.body;

  if (!text.trim() && !req.file) {
    throw new AppError('Message text or attachment required', 400);
  }

  let attachments = [];
  if (req.file) {
    try {
      attachments = await uploadAttachment(req.file);
    } catch (error) {
      logger.error('Attachment upload failed', { error });
      throw error;
    }
  }

  const message = await Message.create({
    chatId,
    senderId: req.user._id,
    text,
    attachments,
    mediaUrl: attachments[0]?.url || '',
    messageType: attachments[0]?.type || 'text'
  });

  const io = req.app.get('io');
  io?.to(chatId).emit('message:new', message);

  res.status(201).json(message);
});
```

## Database Schema Examples

### User Model
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  profilePic: "https://res.cloudinary.com/dexd5mxv5/image/upload/v123456/chat-app/avatars/john-profile.jpg",
  // ... other fields
}
```

### Message Model
```javascript
{
  _id: ObjectId,
  chatId: ObjectId,
  senderId: ObjectId,
  text: "Check this image!",
  attachments: [
    {
      url: "https://res.cloudinary.com/dexd5mxv5/image/upload/v123456/chat-app/images/photo.jpg",
      public_id: "chat-app/images/photo",
      type: "image",
      name: "photo.jpg",
      size: 234567,
      width: 1920,
      height: 1080
    },
    {
      url: "https://res.cloudinary.com/dexd5mxv5/video/upload/v123456/chat-app/videos/video.mp4",
      public_id: "chat-app/videos/video",
      type: "video",
      name: "video.mp4",
      size: 5234567,
      duration: 45
    }
  ],
  messageType: "video",
  mediaUrl: "https://res.cloudinary.com/.../chat-app/videos/video.mp4",
  // ... other fields
}
```

## Testing with cURL

### Setup Auth Token
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Pass123!"}'

# 2. Login to get token
RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123!"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"
```

### Test Avatar Upload
```bash
curl -X PATCH http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "avatar=@image.jpg"
```

### Test Message with Attachment
```bash
# First create a chat or get chatId
CHAT_ID="..."

curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@document.pdf" \
  -F 'body={"chatId":"'$CHAT_ID'","text":"Check this PDF"}'
```

## Performance Considerations

### Upload Speed
- **Avatar**: ~1-2s (5MB, optimized for profile pics)
- **Attachment**: ~2-5s (varies by file size)
- **Network**: Major factor in production

### Optimization Options (Future)
```javascript
// In uploadService.js, could add:
const uploadStream = cloudinary.uploader.upload_stream({
  // ... existing options
  quality: 'auto', // Auto-optimize quality
  eager: [ // Pre-generate transformations
    { width: 200, height: 200, crop: 'fill' } // Avatar thumbnail
  ]
}, ...);
```

### Database Queries
- Attachment lookups: Indexed on `chatId` and `createdAt`
- Avatar lookups: Indexed on `email` and `_id`
- Consider pagination for large attachment lists

## Security Notes

1. ✅ **API Secret**: Never exposed (kept in .env only)
2. ✅ **MIME Type Validation**: Both middleware and service layers
3. ✅ **File Size Limits**: Enforced at middleware
4. ✅ **Cloudinary Folder Structure**: Organized by type
5. ⚠️ **Consider**: Add image transformation to prevent abuse
6. ⚠️ **Consider**: Rate limit uploads per user per hour

## Future Enhancements

```javascript
// 1. Image Transformation
cloudinary.url('chat-app/images/file', {
  width: 300,
  height: 300,
  crop: 'fill',
  quality: 'auto'
});

// 2. Image Optimization
await cloudinary.uploader.upload_stream({
  quality: 'auto',
  fetch_format: 'auto'
}, ...);

// 3. Virus scanning (Cloudinary add-on)
// 4. Audio transcoding for voice messages
// 5. Video thumbnail generation
// 6. EXIF data stripping for privacy
```

---

**System ready for production use**
