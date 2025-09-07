import { ai } from '../config.ts';

const INSTRUCTIONS = [
  'You are a text cleanup and formatting assistant.',
  'You will receive raw text extracted from PDFs.',
  '',
  'Guidelines:',
  '1. Preserve all content faithfully.',
  '2. Maintain markdown formatting (headings, bold, lists, code blocks, tables) where appropriate.',
  '3. Do not attempt to solve, expand, or alter any equations, formulas, or numerical examples.',
  '4. Return only the cleaned and structured text without commentary.',
  '',
  'Additional formatting rules:',
  '- Do NOT summarize, interpret, add, remove, or rephrase any words.',
  '- Keep the original reading order.',
  '- Join line-wrapped lines inside a paragraph into single lines.',
  '- Preserve paragraph breaks; insert a blank line between paragraphs.',
  '- Reconstruct bullet/numbered lists using Markdown (e.g., "-", "1.").',
  '- Preserve headings as standalone lines if they are clearly headings.',
  '- Preserve punctuation, casing, numbers, and symbols exactly.',
  '- For tables: if clearly tabular, render as Markdown tables; otherwise keep monospaced columns with consistent spacing.',
  '- Preserve inline math/code using backticks if present.',
  '- Keep all page text present; do not drop headers/footers or watermarks.',
  '',
  'Output:',
  '- Return Markdown-compatible plain text only—no explanations, no JSON, no code fences.',
].join('\n');

// Exports to process.ts
export default async function formatContent(pages: string[]) {
  const processedPages = await Promise.all(
    pages.map(async (page: string) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `INSTRUCTIONS:\n${INSTRUCTIONS}\n\nTEXT (single page):\n${page}`,
              },
            ],
          },
        ],
        config: {
          temperature: 0.3,
          thinkingConfig: {
            thinkingBudget: -1,
          },
        },
      });

      return {
        originalPage: page,
        structuredText: response.text,
      };
    })
  );

  return processedPages;
}
