// utils/convert.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function convertToPDF(inputPath: string, outputDir: string) {
  const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
  try {
    await execAsync(command);
    const outputFile = path.join(
      outputDir,
      path.basename(inputPath, path.extname(inputPath)) + '.pdf'
    );
    return outputFile;
  } catch (err) {
    console.error('Conversion error:', err);
    throw err;
  }
}
