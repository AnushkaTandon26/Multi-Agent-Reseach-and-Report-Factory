import { describe, it, expect } from 'vitest';
import { ResearchOrchestrator } from '../src/lib/agents/orchestrator';

describe('ResearchOrchestrator End-to-End Suite', () => {
  it('executes full 5-agent pipeline in mock mode and produces verified report and execution trace', async () => {
    const orchestrator = new ResearchOrchestrator(
      'Commercial Viability of Solid-State Batteries by 2030',
      'quick',
      'executive',
      'all',
      false,
      undefined,
      [],
      { mockMode: true }
    );

    const state = await orchestrator.run();

    expect(state.status).toBe('completed');
    expect(state.plan).toBeDefined();
    expect(state.sources.length).toBeGreaterThan(0);
    expect(state.facts.length).toBeGreaterThan(0);
    expect(state.criticReview).toBeDefined();
    expect(state.report).toBeDefined();
    expect(state.messages.length).toBeGreaterThan(0);
    expect(state.toolCalls.length).toBeGreaterThan(0);
    expect(state.trace).toBeDefined();
    expect(state.trace?.agentsExecuted).toContain('planner');
    expect(state.trace?.agentsExecuted).toContain('writer');
  }, 30000);
});
