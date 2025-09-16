import { Router } from 'express';
import { PDFDocument } from 'pdf-lib';
import upload from '../utils/upload.ts';
import analyseDocument from '../utils/document-analyser.ts';
import structureForClient from '../utils/structure-text.ts';
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

    // For Azure
    const newPdfForAzure: PDFDocument = await PDFDocument.create();
    const copiedPagesForAzure = await newPdfForAzure.copyPages(
      originalPdf,
      pagesToCrop
    );
    copiedPagesForAzure.forEach((page) => newPdfForAzure.addPage(page));

    const pdfBytesForAzure = await newPdfForAzure.save();
    const buffers: Buffer[] = [Buffer.from(pdfBytesForAzure)];

    const azureResponse: any = await analyseDocument(buffers);
    const structuredText = structureForClient(azureResponse[0]);

    // For client
    const newPdf: PDFDocument = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(originalPdf, pagesToCrop);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();

    const filename = `processed-${Date.now()}.pdf`;
    const filePath = path.join('tmp', filename);
    fs.writeFileSync(filePath, pdfBytes);

    // TODO: Toggle betweeen development and production
    res.json({
      text: structuredText,
      docUrl: `http://localhost:3000/tmp/${filename}`,
    });
  } catch (error) {
    console.error('Failed to parse file:', error);
    res.status(500).json({ error: 'Error occured' });
  }
});

export default processRouter;
