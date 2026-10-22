# User and Operations Guide

This guide covers the main research settings, evidence limitations, API endpoints, and local checks for the Multi-Agent Research and Report Factory.

## 1. Choose research settings

- **Depth** (`quick`, `standard`, or `deep`) controls how much planning and source retrieval the workflow attempts.
- **Persona** (`executive`, `academic`, `investment`, or `technical`) guides the report's intended audience and style.
- **Search scope** (`all`, `academic`, `financial`, or `medical`) is accepted by the workflow. The current search backend does not yet enforce domain filtering, so treat this setting as a preference rather than a guarantee.
- **Red-team mode** asks the Critic to look more deliberately for counterarguments, blind spots, and failure modes.
- **Custom instructions** add guidance for the Planner. Uploaded documents can be included as additional research material.

## 2. Understand the workflow

The workflow runs through the Planner, Searcher, Reader, Critic, and Writer. The Critic can request targeted follow-up searches when evidence gaps remain; the orchestrator also considers a credibility score below 85 when deciding whether to replan. The Writer then creates a report from the gathered material and review guidance.

## 3. Verify search evidence

Search first tries DuckDuckGo and Wikipedia endpoints. If those do not provide enough results, the current implementation fills the remaining slots with generated placeholder sources. These placeholders are not independently retrieved publications: verify source URLs and claims before relying on or citing them.

The Critic's scores and labels are aids for reviewing evidence, not guarantees that a claim is true. Check important claims against the original source.

## 4. Prepare uploaded documents

Use `.txt`, `.md`, `.csv`, or `.json` files. The browser reads uploads as text. Although the picker also accepts `.pdf`, the app does not extract PDF text; convert PDFs to a supported text format before uploading.

The browser sends uploaded document text to `/api/research` as part of the workflow request. Do not upload confidential material unless your deployment and any configured model provider are approved for that data.

## 5. Configure Gemini

Gemini is optional. For a deployment, configure `GEMINI_API_KEY` as a server-side environment variable. The app also has API key and model fields in its settings. The default model name is `gemini-1.5-flash`.

Without a usable key, or when Gemini generation is unavailable, agents can use the local deterministic fallback. This fallback does not make generated search placeholders into verified sources.

## 6. Use the HTTP endpoints

### Health check

`GET /api/health` returns a JSON status response with the application version, agent names, and feature flags. For a local server:

```bash
curl http://localhost:3000/api/health
```

### Start a research run

`POST /api/research` accepts JSON. `topic` is required; other fields are optional. For the complete request data model, see [INPUT_OUTPUT.md](./INPUT_OUTPUT.md).

```bash
curl -N http://localhost:3000/api/research \
  -H 'Content-Type: application/json' \
  -d '{"topic":"How urban trees affect summer temperatures","depth":"standard","persona":"executive"}'
```

The response is a Server-Sent Events (SSE) stream, not one JSON response. Each event is sent as a `data: { ... }` line. A blank line separates events.

## 7. Read the event stream

The event `type` is one of: `workflow_start`, `agent_start`, `agent_thought`, `agent_progress`, `agent_artifact`, `agent_complete`, `agent_replan_loop`, `agent_message`, `agent_tool_call`, `report_chunk`, `workflow_complete`, or `workflow_error`.

On success, `workflow_complete` includes `report`, `trace`, and the final workflow `state` in its `data`. On failure, `workflow_error` includes an error message. See the `StreamEvent` type in `src/lib/types.ts` for the event structure.

## 8. Run local checks and diagnose common issues

From the repository root:

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

- A `400` response from `/api/research` means the topic is missing, empty, or not a string.
- If Gemini is not configured, the workflow can still run with local fallback generation.
- If a PDF upload produces unreadable text, convert it to `.txt` or `.md` and upload the converted file.
- If a result URL or publication cannot be found, treat it as unverified; the search fallback may have generated a placeholder.
