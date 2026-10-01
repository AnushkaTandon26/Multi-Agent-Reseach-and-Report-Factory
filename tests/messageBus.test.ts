import { describe, it, expect } from 'vitest';
import { AgentMessageBus } from '../src/lib/agents/messageBus';
import { AgentMessage } from '../src/lib/types';

describe('Typed Inter-Agent Message Bus', () => {
  it('dispatches typed messages to subscribed agents and records history', () => {
    const bus = new AgentMessageBus();
    const received: AgentMessage[] = [];

    const unsubscribe = bus.subscribe((msg) => {
      received.push(msg);
    });

    bus.publish(
      'planner',
      'searcher',
      'task',
      { queries: ['quantum encryption benchmarks 2025'] },
      'Deconstructed topic into targeted retrieval queries.'
    );

    bus.publish(
      'searcher',
      'reader',
      'result',
      { sourcesCount: 5 },
      'Retrieved 5 authoritative candidate documents.'
    );

    expect(received.length).toBe(2);
    expect(received[0].from).toBe('planner');
    expect(received[0].to).toBe('searcher');
    expect(received[0].type).toBe('task');
    expect(received[1].from).toBe('searcher');
    expect(received[1].type).toBe('result');

    expect(bus.getMessages().length).toBe(2);

    unsubscribe();
    bus.publish('reader', 'critic', 'result', {}, 'Next step');
    expect(received.length).toBe(2); // no new received after unsubscribe
    expect(bus.getMessages().length).toBe(3); // still stored in history
  });
});
