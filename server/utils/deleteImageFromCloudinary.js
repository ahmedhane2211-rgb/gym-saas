import { v2 as cloudinary } from 'cloudinary';

export const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;
    try {
        const parts = imageUrl.split('/');
        const fileNameWithExtension = parts.pop();
        const folderName = parts.pop();
        const publicId = `${folderName}/${fileNameWithExtension.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
    }
};