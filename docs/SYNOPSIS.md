# Project Synopsis: Research Factory

## 1. Problem Statement
In academic, scientific, and enterprise intelligence gathering, synthesizing comprehensive, verifiable reports on complex topics requires navigating hundreds of heterogeneous sources, isolating quantitative data from corporate marketing hyperbole, cross-checking conflicting claims, and adhering to strict citation rigor. Single-prompt Large Language Models (LLMs) or rigid, linear automation workflows fail at this task: single prompts suffer from hallucinations, cognitive bias, and context saturation, while linear pipelines execute blindly without evaluating evidence quality, missing critical knowledge gaps, and failing to adjust search strategies dynamically.

## 2. Our Multi-Agent Solution
**Research Factory** is an autonomous multi-agent intelligence system consisting of five specialized AI agents: **Strategic Planner**, **Literature Scout (Searcher)**, **Deep Reader**, **Epistemic Critic**, and **Executive Synthesizer (Writer)**. Unlike traditional scripted assembly lines, our architecture employs an **Adaptive Orchestrator-Worker with Evaluator-Optimizer Critique Loop** pattern:
- **Strategic Planner**: Deconstructs research taxonomy, sub-questions, and multi-perspective hypotheses based on the target persona (Executive, Academic, Investment, Technical).
- **Literature Scout (Searcher)**: Autonomously probes multi-perspective search vectors, filters out low-authority domains, and discovers candidate references.
- **Deep Reader**: Mines reference documents and BYOD document uploads (PDF, TXT, MD) to extract structured claims, empirical statistics, and expert quotes with exact source provenance.
- **Epistemic Critic**: Acts as the cognitive auditor, evaluating domain authority, calculating an Epistemic Reliability Index (0–100), running adversarial Red Team stress-tests, and detecting knowledge gaps.
- **Dynamic Replanning & Feedback Loops**: If the Critic identifies evidence deficits or conflicting claims, it dynamically formulates follow-up queries and dispatches the Searcher and Reader on supplementary investigation loops. Furthermore, the Critic performs a post-draft anti-hallucination audit on the Writer's draft, demanding targeted revisions before final sign-off.
- **Executive Synthesizer (Writer)**: Synthesizes the hardened evidence into an exhaustive whitepaper with standard footnote citations (`[^n]`), interactive presentation slides, and a two-speaker audio briefing dialogue.

## 3. Target User & Real-World Impact
The platform targets executive strategists, technical researchers, investment analysts, and academic scholars who require audit-grade, cited intelligence. By visualizing real-time thought streams, inter-agent message bus handoffs, and feedback loops on an interactive dashboard, the system transforms research operations into a transparent, trustworthy, and verifiable process.

---

## 4. Scope Refinement & Response to CA2 Feedback
> **Note on Scope Evolution (CA2 $\rightarrow$ CA3)**:  
> In CA2 approval feedback, evaluators noted that while the 5 named roles mapped well onto research workflows, the initial pipeline risked behaving like a sequential assembly line. In response, CA3 implements an **Evaluator-Optimizer Architecture with Bidirectional Replan Loops**:
> 1. **Critic-Driven Search Re-dispatch (Loop 1)**: The Critic audits fact sufficiency; if confidence is below 85% or gaps exist, it triggers targeted follow-up queries back to the Searcher.
> 2. **Post-Draft Anti-Hallucination Audit (Loop 2)**: The Critic evaluates draft reports for ungrounded claims and mandates structural revisions from the Writer prior to publication.
> 3. **Typed Message Bus & Run Memory**: All agent communication flows through a typed message bus (`id`, `timestamp`, `from`, `to`, `type`, `payload`, `reasoning`) with shared run memory.
