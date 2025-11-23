import cloudinary from '../config/cloudinary';
import User from '../models/User';

/**
 * Upload file to Cloudinary
 */
export const uploadFile = async (
  filePath: string,
  folder: string = 'kurakani'
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `kurakani/${folder}`,
      resource_type: 'auto',
      eager: [{ width: 300, height: 300, crop: 'fill' }],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      type: result.resource_type,
      size: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Upload image
 */
export const uploadImage = async (
  filePath: string,
  folder: string = 'images'
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `kurakani/${folder}`,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

/**
 * Upload video
 */
export const uploadVideo = async (
  filePath: string,
  folder: string = 'videos'
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `kurakani/${folder}`,
      resource_type: 'video',
      quality: 'auto',
      fetch_format: 'auto',
      streaming_profile: 'hd',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Video upload error:', error);
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFile = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

/**
 * Generate thumbnail for video
 */
export const generateVideoThumbnail = async (
  videoUrl: string
): Promise<string> => {
  try {
    const publicId = videoUrl.split('/').pop()?.split('.')[0];
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        { quality: 'auto' },
      ],
    });

    return thumbnailUrl;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw error;
  }
};

/**
 * Get file size
 */
export const getFileSize = async (publicId: string): Promise<number> => {
  try {
    const resource = await cloudinary.api.resource(publicId);
    return resource.bytes;
  } catch (error) {
    console.error('Get file size error:', error);
    return 0;
  }
};