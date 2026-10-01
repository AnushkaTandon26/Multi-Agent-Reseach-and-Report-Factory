import { describe, it, expect } from 'vitest';
import { ScoringRubricTool } from '../src/lib/tools/scoringRubricTool';
import { SearchSource, ExtractedFact } from '../src/lib/types';

describe('Epistemic Critic & Scoring Rubric Tool', () => {
  const sampleAcademicSource: SearchSource = {
    id: 'src-academic',
    title: 'Solid-State Battery Electrolyte Stability Under Extreme Cycles',
    url: 'https://nature.com/articles/s41565-battery',
    domain: 'nature.com',
    snippet: 'Extensive cycling shows 94% retention across 1,000 charge cycles in pouch configurations.',
    publishDate: '2025-01-15',
    query: 'solid state battery retention',
  };

  const sampleCommercialSource: SearchSource = {
    id: 'src-commercial',
    title: 'Breakthrough Energy Pack Launch - Press Release',
    url: 'https://pr-newswire.com/sponsor-battery-launch',
    domain: 'pr-newswire.com',
    snippet: 'Our sponsored partner announcement promises infinite range with zero degradation.',
    publishDate: '2021-03-10',
    query: 'commercial battery breakthrough',
  };

  const sampleFacts: ExtractedFact[] = [
    {
      id: 'fact-1',
      sourceId: 'src-academic',
      sourceTitle: 'Nature Report',
      sourceUrl: 'https://nature.com/articles/s41565-battery',
      fact: 'Pouch cell demonstrated 94% retention after 1,000 cycles.',
      category: 'statistic',
      confidence: 0.95,
      numericValue: 94,
    },
    {
      id: 'fact-2',
      sourceId: 'src-academic',
      sourceTitle: 'Nature Report',
      sourceUrl: 'https://nature.com/articles/s41565-battery',
      fact: 'Electrochemical impedance spectroscopy confirmed minimal dendrite penetration.',
      category: 'finding',
      confidence: 0.92,
    },
  ];

  it('awards high credibility score to peer-reviewed academic domain with statistics', () => {
    const result = ScoringRubricTool.evaluateSource({
      source: sampleAcademicSource,
      facts: sampleFacts,
    });

    expect(result.credibilityScore).toBeGreaterThanOrEqual(85);
    expect(result.scorecard.authorityLevel).toBe('High');
    expect(result.scorecard.biasRating).toBe('Academic');
    expect(result.passedThreshold).toBe(true);
  });

  it('penalizes commercial/sponsored sources with PR flags', () => {
    const result = ScoringRubricTool.evaluateSource({
      source: sampleCommercialSource,
      facts: [],
    });

    expect(result.biasPenalty).toBeGreaterThan(0);
    expect(result.scorecard.biasRating).toBe('Commercial');
    expect(result.scorecard.flags.length).toBeGreaterThan(0);
  });
});
