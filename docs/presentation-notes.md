# Presentation Notes

## Project
Multi-Agent Research and Report Factory

## Overview
A Next.js application that coordinates specialized AI agents to research a user-provided topic and create a structured report. It can run in simulated mode, with an optional Gemini API integration for live generation.

## Key Features
- Planner creates focused research questions from a topic.
- Searcher identifies relevant sources and research gaps.
- Reader extracts evidence from documents and uploaded files.
- Critic reviews confidence, bias, quality, and contradictions.
- Writer combines the research into a structured report.
- Dashboard displays agent status, progress, and workflow events.
- Includes red-team review modes, document uploads, and automated tests.

## Presentation Points
- Show how one topic moves through the Planner, Searcher, Reader, Critic, and Writer workflow.
- Explain how the Critic checks evidence and can request additional research.
- Demonstrate the dashboard and generated report.
- Mention that Gemini API integration is optional; the app also supports simulated mode.

## Short Introduction
“This project turns a research topic into a structured report. Five specialized agents plan the research, find sources, extract evidence, review its quality, and write the final report. The dashboard lets us follow their progress.”

## Likely Questions
- **What happens if evidence is weak?** The Critic can identify gaps and request more targeted research.
- **Is an API key required for the demo?** No. The app can run in simulated mode; Gemini is optional.
- **What can users provide?** A research topic, preferences such as depth and persona, and optional supporting documents.

## Demo Walkthrough
1. Open the application and enter a focused research topic.
2. Choose a research depth and report persona, then review the search scope and optional red-team settings.
3. Start the workflow and point out the Planner's research questions and the Searcher's source coverage.
4. Show how the Reader extracts evidence and how the Critic evaluates confidence, bias, and contradictions.
5. Open the generated report and highlight its sourced findings and structured sections.
6. Explain that simulated mode works without an API key; live Gemini generation is optional.

## Team Notes
- Make changes on a feature branch, not directly on `main`.
- Push the feature branch to your fork and open a pull request for review.