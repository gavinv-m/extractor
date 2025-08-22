import multer from 'multer';

// Use memory storage so PDFs don't persist on disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Exports to process.ts
export default upload;
