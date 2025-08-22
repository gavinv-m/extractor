import { Router } from 'express';
import { PDFDocument } from 'pdf-lib';
import upload from '../utils/upload.ts';

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
      const totalPages = originalPdf.getPageCount();
      pagesToCrop = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      pagesToCrop = (input as number[]).map((p) => p - 1); // convert to 0-based
    }

    const newPdf: PDFDocument = await PDFDocument.create();

    const copiedPages = await newPdf.copyPages(originalPdf, pagesToCrop);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();

    res
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=extracted.pdf',
        'Content-Length': pdfBytes.length,
      })
      .send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Failed to parse file:', error);
    res.status(500).json({ error: 'Error occured' });
  }
});

export default processRouter;
