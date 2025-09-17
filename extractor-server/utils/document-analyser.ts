import DocumentIntelligence, {
  isUnexpected,
} from '@azure-rest/ai-document-intelligence';
import { AzureKeyCredential } from '@azure/core-auth';
import { azure } from '../config/index.ts';

export default async function analyseDocument(buffer: Buffer) {
  try {
    const client = DocumentIntelligence(
      azure.endpoint,
      new AzureKeyCredential(azure.key)
    );
    // Convert buffer to base64
    const base64String = buffer.toString('base64');

    const initialResponse = await client
      .path('/documentModels/{modelId}:analyze', 'prebuilt-layout')
      .post({
        body: {
          base64Source: base64String,
        },
        queryParameters: {
          outputContentFormat: 'text',
          includeTextContent: true,
          includeFigures: true,
        },
        contentType: 'application/json',
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    // Get the operation-location from headers
    const operationLocation = initialResponse.headers['operation-location'];
    if (!operationLocation) {
      throw new Error('No operation-location returned from service.');
    }

    // Poll until done
    let analyzeResult;
    while (true) {
      const pollResponse = await client.pathUnchecked(operationLocation).get();
      if (isUnexpected(pollResponse)) {
        throw pollResponse.body.error;
      }

      if (pollResponse.body.status === 'succeeded') {
        analyzeResult = pollResponse.body.analyzeResult;
        break;
      } else if (pollResponse.body.status === 'failed') {
        throw new Error('Analysis failed.');
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return analyzeResult;
  } catch (err) {
    console.error('Document analysis failed:', err);
    throw err;
  }
}
