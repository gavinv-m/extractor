import { Router } from 'express';
import { PDFDocument } from 'pdf-lib';
import upload from '../utils/upload.ts';
import analyseDocument from '../utils/document-analyser.ts';
import formatContent from '../utils/format.ts';
import fs from 'fs';
import path from 'path';

const processRouter = Router();

processRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });

    const raw = req.body.pagesToCrop; // could be '"all"' or "[1,2,5]"
    let pagesToCrop: number[];

    let input: any;
    try {
      input = JSON.parse(raw);
    } catch {
      input = raw;
    }

    const originalPdf: PDFDocument = await PDFDocument.load(req.file.buffer);

    if (input === 'all') {
      const totalPages: number = originalPdf.getPageCount();
      pagesToCrop = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      pagesToCrop = (input as number[]).map((p) => p - 1); // convert to 0-based
    }

    // Break pdf into two-page documents, needed for testing
    // TODO: Remove and send entire document to analyseDocument
    const buffers: Buffer[] = [];

    for (let i = 0; i < pagesToCrop.length; i += 2) {
      const newPdf: PDFDocument = await PDFDocument.create();

      const pageIndices = pagesToCrop.slice(i, i + 2);
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();

      buffers.push(Buffer.from(pdfBytes));
    }

    const pages: string[] = await analyseDocument(buffers);
    const processedPages: any = await formatContent(pages);

    // Create a new PDF with only selected pages, send as response
    const newPdf: PDFDocument = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(originalPdf, pagesToCrop);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();

    const filename = `processed-${Date.now()}.pdf`;
    const filePath = path.join('tmp', filename);
    fs.writeFileSync(filePath, pdfBytes);

    const outputPath = path.join(process.cwd(), 'processed-text.txt');
    // Clear the file at the start (so you don't keep appending across runs)
    fs.writeFileSync(outputPath, '', 'utf8');
    // Gemini Output
    processedPages.forEach((page: any, index: number) => {
      const pageText = `
        === PAGE ${index + 1} ===
        ${page.structuredText}`;

      fs.appendFileSync(outputPath, pageText, 'utf8');
    });

    // TODO: Toggle betweeen development and production
    res.json({
      docUrl: `http://localhost:3000/tmp/${filename}`,
      text: processedPages,
    });
  } catch (error) {
    console.error('Failed to parse file:', error);
    res.status(500).json({ error: 'Error occured' });
  }
});

export default processRouter;
