import dotenv from 'dotenv';
dotenv.config();

// Exports to document-analyser.ts
export const azure = {
  key: process.env.AZURE_DOC_INTEL_KEY as string,
  endpoint: process.env.AZURE_DOC_INTEL_ENDPOINT as string,
};
