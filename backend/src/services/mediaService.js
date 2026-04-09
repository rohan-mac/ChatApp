import cloudinary, { isCloudinaryEnabled } from '../config/cloudinary.js';

export const uploadAttachment = async (file) => {
  if (!file) return [];

  const type = file.mimetype.startsWith('image')
    ? 'image'
    : file.mimetype.startsWith('video')
      ? 'video'
      : 'document';

  if (!isCloudinaryEnabled) {
    return [
      {
        url: `local://${file.originalname}`,
        type,
        name: file.originalname,
        size: file.size
      }
    ];
  }

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: 'auto', folder: 'chatapp/media' },
        (error, uploadResult) => (error ? reject(error) : resolve(uploadResult))
      )
      .end(file.buffer);
  });

  return [
    {
      url: result.secure_url,
      type,
      name: file.originalname,
      size: file.size
    }
  ];
};
