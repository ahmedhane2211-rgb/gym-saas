import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// ── Cloudinary Configuration ──────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Storage: saves directly to Cloudinary ─────────────────────────────────────
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "gym-saas",           // اسم الفولدر في Cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, crop: "limit" }], // ضغط اختياري
    },
});

// ── File Filter: صور فقط ──────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("نوع الملف غير مسموح به. الأنواع المقبولة: JPG, PNG, WEBP"), false);
    }
};

// ── Multer Instance ───────────────────────────────────────────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB حد أقصى
});

// ── Helper: رفع صورة برمجياً (بدون middleware) ────────────────────────────────
export const uploadToCloudinary = (buffer, folder = "gym-saas") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// ── Delete image from Cloudinary ──────────────────────────────────────────────
export const deleteFromCloudinary = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

export default upload;
