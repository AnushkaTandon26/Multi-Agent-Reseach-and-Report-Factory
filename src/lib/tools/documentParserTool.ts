import { CustomDocument, ExtractedFact, SearchSource } from '../types';

export interface DocumentParserInput {
  documentId: string;
  title: string;
  content: string;
  sourceType: 'web_snippet' | 'custom_upload';
}

export interface DocumentParserResult {
  documentId: string;
  title: string;
  wordCount: number;
  extractedCandidateFacts: number;
  previewSummary: string;
}

export class DocumentParserTool {
  public static readonly toolName = 'document_parser_and_ingestion';
  public static readonly description = 'Parses unstructured text, PDF/TXT/CSV uploads, and web payloads to extract numerical metrics and factual assertions.';

  public static execute(input: DocumentParserInput): DocumentParserResult {
    const cleanContent = input.content.trim();
    const words = cleanContent.split(/\s+/).filter(Boolean);
    const sentences = cleanContent.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);

    // Heuristically detect numerical or statistical density
    const numStatSentences = sentences.filter(s => /\d+(\.\d+)?%?|\$\d+|\b(increase|decrease|growth|billion|million)\b/i.test(s));

    return {
      documentId: input.documentId,
      title: input.title,
      wordCount: words.length,
      extractedCandidateFacts: Math.max(1, numStatSentences.length),
      previewSummary: cleanContent.substring(0, 200) + '...',
    };
  }
}
