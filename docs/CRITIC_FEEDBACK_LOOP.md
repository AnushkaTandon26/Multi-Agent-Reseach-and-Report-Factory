# Multi-Agent Dynamic Replanning Architecture

## Overview
This architecture establishes a closed-loop bidirectional coordination between the CriticAgent, PlannerAgent, and SearcherAgent.

### Replanning Workflow
1. **Evaluation Phase**: The Critic assesses extracted facts against credibility metrics.
2. **Feedback Generation**: When information gaps remain and the credibility score is below 85, the Critic can request more evidence and provide follow-up search queries.
3. **Query Expansion**: The Planner expands search vectors to resolve specific evidentiary gaps.
4. **Directed Search**: SearcherAgent executes targeted probes.

The orchestrator uses the Critic's `request_more_evidence` decision to trigger another research pass. It also considers follow-up queries together with a score below 85. The score threshold is 85/100; it is not 80.
