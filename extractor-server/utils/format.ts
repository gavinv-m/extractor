// // Exports to process.ts
// export default function formatContent() {
//   const processedPages = await Promise.all(
//     pageObjects.map(async (page) => {
//       const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: page.text,
//         config: { temperature: 0 },
//       });
//       return { ...page, structuredText: response.text };
//     })
//   );
// }
