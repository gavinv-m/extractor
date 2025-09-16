import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Exports to process.ts
export default async function processPDF(fileBuffer: Buffer, pagesInput: any) {
  const originalPdf = await PDFDocument.load(fileBuffer);

  let pagesToCrop: number[];
  if (pagesInput === 'all') {
    const totalPages = originalPdf.getPageCount();
    pagesToCrop = Array.from({ length: totalPages }, (_, i) => i);
  } else {
    pagesToCrop = (pagesInput as number[]).map((p) => p - 1);
  }

  // For Azure
  const pdfForAzure = await PDFDocument.create();
  const copiedPagesForAzure = await pdfForAzure.copyPages(
    originalPdf,
    pagesToCrop
  );
  copiedPagesForAzure.forEach((page) => pdfForAzure.addPage(page));

  const azureBytes = await pdfForAzure.save();

  // For client
  const pdfForClient = await PDFDocument.create();
  const copiedPages = await pdfForClient.copyPages(originalPdf, pagesToCrop);
  copiedPages.forEach((page) => pdfForClient.addPage(page));

  const clientBytes = await pdfForClient.save();
  const filename = `processed-${Date.now()}.pdf`;
  const filePath = path.join('tmp', filename);
  fs.writeFileSync(filePath, clientBytes);

  return {
    azureBuffer: Buffer.from(azureBytes),
    clientUrl: `http://localhost:3000/tmp/${filename}`,
  };
}
