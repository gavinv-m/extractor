import fs from 'fs';
import path from 'path';

// Exports to process.ts
export default async function processImage(
  fileBuffer: Buffer,
  mimetype: string
) {
  // For Azure → just send the raw buffer
  const azureBuffer = Buffer.from(fileBuffer);

  // For client → save the file in tmp with the right extension
  const extension = mimetype.split('/')[1] || 'png'; // e.g. image/png → png
  const filename = `processed-${Date.now()}.${extension}`;
  const filePath = path.join('tmp', filename);

  fs.writeFileSync(filePath, fileBuffer);

  return {
    azureBuffer,
    clientUrl: `http://localhost:3000/tmp/${filename}`,
  };
}
