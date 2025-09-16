import { Router } from 'express';
import upload from '../utils/upload.ts';
import analyseDocument from '../utils/document-analyser.ts';
import processPDF from '../utils/pdf-processor.ts';
import structureForClient from '../utils/structure-text.ts';

const processRouter = Router();

processRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });

    const raw = req.body.pagesToCrop; // could be '"all"' or "[1,2,5]"
    let pagesToCrop;
    try {
      pagesToCrop = JSON.parse(raw);
    } catch {
      pagesToCrop = raw;
    }

    let input: any;
    try {
      input = JSON.parse(raw);
    } catch {
      input = raw;
    }

    let azureBuffer: Buffer | null = null;
    let clientUrl: string = '';

    if (req.file.mimetype === 'application/pdf') {
      const result = await processPDF(req.file.buffer, pagesToCrop);
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
