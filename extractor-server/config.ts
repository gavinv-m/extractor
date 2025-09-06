import dotenv from 'dotenv';
dotenv.config();

export const azure = {
  key: process.env.AZURE_DOC_INTEL_KEY as string,
  endpoint: process.env.AZURE_DOC_INTEL_ENDPOINT as string,
};
