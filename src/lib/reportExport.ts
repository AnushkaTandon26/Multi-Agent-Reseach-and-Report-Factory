/**
 * Utility helper for exporting generated research reports to Markdown and Plaintext
 */
export function formatReportForDownload(title: string, markdown: string, citationsCount: number): string {
  const header = `---\nTitle: ${title}\nCitations: ${citationsCount}\nExported: ${new Date().toISOString()}\n---\n\n`;
  return header + markdown;
}
