import { Router } from 'express';
import upload from '../utils/upload.ts';
import analyseDocument from '../utils/document-analyser.ts';
import processPDF from '../utils/pdf-processor.ts';
import processImage from '../utils/image-processor.ts';
import { convertToPDF } from '../utils/convert.ts';
import structureForClient from '../utils/structure-text.ts';
import fs from 'fs';
import path from 'path';

const processRouter = Router();

processRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });

    const supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    ];

    let pagesToCrop: any = undefined; // could be '"all"' or "[1,2,5]"
    if (supportedTypes.includes(req.file.mimetype) && req.body.pagesToCrop) {
      try {
        pagesToCrop = JSON.parse(req.body.pagesToCrop);
      } catch {
        pagesToCrop = req.body.pagesToCrop; // e.g., "all"
      }
    }

    let azureBuffer: Buffer | null = null;
    let clientUrl: string = '';

    if (req.file.mimetype === 'application/pdf') {
      // PDFs
      const result = await processPDF(req.file.buffer, pagesToCrop);
      azureBuffer = result.azureBuffer;
      clientUrl = result.clientUrl;
    } else if (req.file.mimetype.startsWith('image/')) {
      // Images
      const result = await processImage(req.file.buffer, req.file.mimetype);
      azureBuffer = result.azureBuffer;
      clientUrl = result.clientUrl;
    } else if (
      req.file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      req.file.mimetype ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      // DOCX / PPTX → convert to PDF using LibreOffice
      const tmpDir = 'tmp';
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const inputPath = path.join(
        tmpDir,
        `${Date.now()}-${req.file.originalname}`
      );
      fs.writeFileSync(inputPath, req.file.buffer);

      const outputPath = await convertToPDF(inputPath, tmpDir);

      // Read the converted PDF back into buffer
      const pdfBuffer = fs.readFileSync(outputPath);

      // Reuse processPDF for consistency (so pagesToCrop works too)
      const result = await processPDF(pdfBuffer, pagesToCrop);
      azureBuffer = result.azureBuffer;
      clientUrl = result.clientUrl;
    }

    if (!azureBuffer) {
      throw new Error('azureBuffer not set');
    }

    const azureResponse = await analyseDocument(azureBuffer);
    const structuredText = structureForClient(azureResponse);

    // TODO: Toggle betweeen development and production
    res.json({
      text: structuredText,
      docUrl: clientUrl,
    });
  } catch (error) {
    console.error('Failed to parse file:', error);
    res.status(500).json({ error: 'Error occured' });
  }
});

export default processRouter;
