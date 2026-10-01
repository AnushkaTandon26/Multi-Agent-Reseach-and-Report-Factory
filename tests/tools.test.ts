import { describe, it, expect } from 'vitest';
import { DocumentParserTool } from '../src/lib/tools/documentParserTool';
import { WebSearchTool } from '../src/lib/tools/searchTool';

describe('Agent Tools Suite', () => {
  it('DocumentParserTool parses BYOD uploads and extracts word counts and metric densities', () => {
    const rawText = `Internal laboratory testing on Gen-3 sulfide electrolyte samples confirmed 380 Wh/kg specific energy density at 25C. Cycle life degraded by less than 8% across 900 cycles under 5 MPa stack pressure.`;
    
    const parsed = DocumentParserTool.execute({
      documentId: 'doc-1',
      title: 'Lab Test Memo',
      content: rawText,
      sourceType: 'custom_upload',
    });

    expect(parsed.documentId).toBe('doc-1');
    expect(parsed.wordCount).toBeGreaterThan(20);
    expect(parsed.extractedCandidateFacts).toBeGreaterThan(0);
  });

  it('WebSearchTool executes query and returns structured SearchToolResult', async () => {
    const result = await WebSearchTool.execute({
      query: 'Quantum Key Distribution security proofs',
      maxResults: 2,
    });

    expect(result.query).toBe('Quantum Key Distribution security proofs');
    expect(Array.isArray(result.sources)).toBe(true);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
});
