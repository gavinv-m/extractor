import { Router } from 'express';
import { PDFDocument } from 'pdf-lib';
import upload from '../utils/upload.ts';
import analyseDocument from '../utils/document-analyser.ts';

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

    // Break pdf into two-page documents
    const buffers: Buffer[] = [];

    for (let i = 0; i < pagesToCrop.length; i += 2) {
      const newPdf: PDFDocument = await PDFDocument.create();

      const pageIndices = pagesToCrop.slice(i, i + 2);
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();

      buffers.push(Buffer.from(pdfBytes));
    }

    const result = await analyseDocument(buffers);

    res.send('ok');
  } catch (error) {
    console.error('Failed to parse file:', error);
    res.status(500).json({ error: 'Error occured' });
  }
});

export default processRouter;
