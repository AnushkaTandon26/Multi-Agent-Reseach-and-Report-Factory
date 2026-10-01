import { ExecutionTrace } from '../types';

export class TraceFormatter {
  /**
   * Converts an ExecutionTrace into a publication-grade markdown document
   */
  public static toMarkdown(trace: ExecutionTrace): string {
    const dateStr = new Date(trace.timestamp).toUTCString();
    const durationSec = (trace.totalDurationMs / 1000).toFixed(2);

    let md = `# Multi-Agent Execution Trace

**Run ID**: \`${trace.traceId}\`  
**Timestamp**: ${dateStr}  
**Topic**: *${trace.topic}*  
**Research Depth**: \`${trace.depth.toUpperCase()}\`  
**Target Persona**: \`${trace.persona.toUpperCase()}\`  
**Total Run Duration**: ${durationSec} seconds  
**Agents Engaged**: ${trace.agentsExecuted.map(a => `\`${a.toUpperCase()}\``).join(', ')}  

---

## 1. Executive Summary & Deliverable Metrics
${trace.finalReportSummary ? `
- **Final Report Title**: ${trace.finalReportSummary.title}
- **Word Count**: ${trace.finalReportSummary.wordCount} words
- **Verified In-Text Citations**: ${trace.finalReportSummary.citationCount}
- **Epistemic Reliability Index**: ${trace.finalReportSummary.epistemicScore}/100
- **Total Feedback & Replan Loops**: ${trace.replanLoops.length}
` : 'Workflow completed before report finalization.'}

---

## 2. Adaptive Replanning & Feedback Cycles
${trace.replanLoops.length === 0 ? '_No replanning loops required; evidence met quality thresholds on initial pass._' : ''}
${trace.replanLoops.map(loop => `
### Loop #${loop.loopNumber}: \`${loop.from.toUpperCase()}\` ➔ \`${loop.to.toUpperCase()}\`
- **Timestamp**: ${new Date(loop.timestamp).toISOString()}
- **Trigger Reason**: ${loop.reason}
- **Directives / Details**: ${loop.details || 'N/A'}
`).join('\n')}

---

## 3. Inter-Agent Typed Message Bus Log
All agent coordination occurred over the structured message bus:

| Time | From | To | Message Type | Reasoning / Purpose |
| :--- | :--- | :--- | :--- | :--- |
${trace.messages.map(m => {
  const time = new Date(m.timestamp).toISOString().split('T')[1].replace('Z', '');
  return `| \`${time}\` | **${m.from.toUpperCase()}** | **${m.to.toUpperCase()}** | \`${m.type}\` | ${m.reasoning.replace(/\|/g, '-')} |`;
}).join('\n')}

---

## 4. Agent Tool Call Records
Discrete tools executed by autonomous agents during research:

| Time | Agent | Tool Name | Success | Latency | Input Summary |
| :--- | :--- | :--- | :---: | :---: | :--- |
${trace.toolCalls.map(t => {
  const time = new Date(t.timestamp).toISOString().split('T')[1].replace('Z', '');
  const inputSummary = JSON.stringify(t.input).substring(0, 70).replace(/\|/g, '-');
  return `| \`${time}\` | \`${t.agent}\` | \`${t.toolName}\` | ${t.success ? '✅' : '❌'} | ${t.durationMs}ms | \`${inputSummary}\` |`;
}).join('\n')}

---

## 5. Shared Run Memory State (Post-Execution Snapshot)
- **Verified Facts in Memory**: ${trace.sharedMemorySnapshot.verifiedFacts.length}
- **Rejected Sources**: ${trace.sharedMemorySnapshot.rejectedSources.length}
- **Active Hypotheses Tracked**: ${trace.sharedMemorySnapshot.activeHypotheses.length}
- **Unresolved Knowledge Gaps**: ${trace.sharedMemorySnapshot.knowledgeGaps.length}

_End of Execution Trace._
`;

    return md;
  }
}
