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