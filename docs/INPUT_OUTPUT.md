# Research Factory: Input & Output Definitions

This document describes the research request data model and the final workflow output model, with sample payloads.

---

## 1. System Input Definition

### 1.1 Quick Reference

Only `topic` is required. The remaining fields are optional; when omitted, the system uses these defaults:

| Field | Accepted values | Default |
| --- | --- | --- |
| `depth` | `quick`, `standard`, `deep` | `standard` |
| `persona` | `executive`, `academic`, `investment`, `technical` | `executive` |
| `searchScope` | `all`, `academic`, `financial`, `medical` | `all` |
| `redTeamMode` | `true`, `false` | `false` |

`customInstructions` can provide additional planning guidance. `customDocuments` can add uploaded material. Gemini options (`apiKey` and `modelName`) are optional; without an API key, the application can use its simulated generation path.

Minimal input:

```json
{
  "topic": "How urban trees affect summer temperatures"
}
```

### 1.2 JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ResearchFactoryInput",
  "type": "object",
  "properties": {
    "topic": {
      "type": "string",
      "description": "Primary research thesis, technological domain, or question to investigate.",
      "minLength": 1
    },
    "depth": {
      "type": "string",
      "enum": ["quick", "standard", "deep"],
      "default": "standard",
      "description": "Research depth controlling search vector count, document count, and extraction density."
    },
    "persona": {
      "type": "string",
      "enum": ["executive", "academic", "investment", "technical"],
      "default": "executive",
      "description": "Target audience tone and structure for the final whitepaper."
    },
    "searchScope": {
      "type": "string",
      "enum": ["all", "academic", "financial", "medical"],
      "default": "all",
      "description": "Requested source domain category. The current search backend does not yet enforce domain filtering."
    },
    "redTeamMode": {
      "type": "boolean",
      "default": false,
      "description": "When true, enables adversarial stress-testing, counter-theses, and failure mode analysis."
    },
    "customInstructions": {
      "type": "string",
      "description": "Optional custom guidance passed to the Strategic Planner."
    },
    "customDocuments": {
      "type": "array",
      "description": "User-uploaded text documents in supported formats (.txt, .md, .csv, or .json) to ingest alongside search results. PDF text extraction is not supported.",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "size": { "type": "number" },
          "content": { "type": "string" },
          "uploadedAt": { "type": "string" }
        },
        "required": ["id", "name", "content"]
      }
    },
    "apiKey": {
      "type": "string",
      "description": "Optional Gemini API key. If omitted, the server environment key may be used; otherwise generation can fall back to local deterministic reasoning."
    },
    "modelName": {
      "type": "string",
      "default": "gemini-1.5-flash",
      "description": "Gemini model variant."
    }
  },
  "required": ["topic"]
}
```

### 1.3 Real Sample Input Payload
```json
{
  "topic": "Commercial Viability of Solid-State Batteries by 2030",
  "depth": "deep",
  "persona": "investment",
  "searchScope": "all",
  "redTeamMode": true,
  "customInstructions": "Highlight cathode chemistries, cost parity with LFP, and Tier-1 automotive OEM roadmap milestones.",
  "customDocuments": [
    {
      "id": "doc-internal-01",
      "name": "Q3_OEM_Battery_Roadmap_Memo.txt",
      "size": 1420,
      "content": "Internal testing confirms solid-state pouch cells achieved 380 Wh/kg at C/3 discharge rates with 92% capacity retention after 800 cycles.",
      "uploadedAt": "2026-10-01T10:00:00.000Z"
    }
  ],
  "modelName": "gemini-1.5-flash"
}
```

---

## 2. System Output Definition

The `/api/research` endpoint streams Server-Sent Events (SSE); it does not return the following schema as one JSON response. The schema and sample below are illustrative summaries, not the exact TypeScript state shape. On successful completion, the `workflow_complete` event contains the report, trace, and final state.

### Reading the Output

- `workflow` records the topic, run status, timing, and replan count.
- `plan` contains the research objectives, questions, hypotheses, and proposed sections.
- `sources` and `facts` hold the collected references and extracted evidence.
- `criticReview` summarizes evidence quality, including the credibility score and review decision.
- `report` contains the generated report and related presentation material.
- `trace` records the chronological interactions between agents and tools.

### 2.1 JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ResearchFactoryOutput",
  "type": "object",
  "properties": {
    "workflow": {
      "type": "object",
      "properties": {
        "topic": { "type": "string" },
        "depth": { "type": "string" },
        "status": { "type": "string", "enum": ["completed", "error"] },
        "startedAt": { "type": "number" },
        "completedAt": { "type": "number" },
        "replanLoops": { "type": "number" }
      },
      "required": ["topic", "status"]
    },
    "plan": {
      "type": "object",
      "properties": {
        "topic": { "type": "string" },
        "targetAudience": { "type": "string" },
        "coreObjectives": { "type": "array", "items": { "type": "string" } },
        "subQuestions": { "type": "array", "items": { "type": "string" } },
        "hypotheses": { "type": "array", "items": { "type": "string" } },
        "searchQueries": { "type": "array", "items": { "type": "string" } },
        "proposedSections": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": { "type": "string" },
              "focus": { "type": "string" }
            }
          }
        }
      }
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "url": { "type": "string" },
          "domain": { "type": "string" },
          "snippet": { "type": "string" },
          "relevanceScore": { "type": "number" }
        }
      }
    },
    "facts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "sourceId": { "type": "string" },
          "fact": { "type": "string" },
          "category": { "type": "string" },
          "confidence": { "type": "number" }
        }
      }
    },
    "criticReview": {
      "type": "object",
      "properties": {
        "overallCredibilityScore": { "type": "number" },
        "totalSourcesEvaluated": { "type": "number" },
        "verifiedFactsCount": { "type": "number" },
        "criticDecision": { "type": "string" },
        "sourceScorecards": { "type": "array" },
        "verifiedClaims": { "type": "array" },
        "questionableClaims": { "type": "array" }
      }
    },
    "report": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "title": { "type": "string" },
        "subtitle": { "type": "string" },
        "executiveSummary": { "type": "string" },
        "markdownContent": { "type": "string" },
        "wordCount": { "type": "number" },
        "readingTimeMinutes": { "type": "number" },
        "citations": { "type": "array" },
        "slides": { "type": "array" },
        "podcastDialogue": { "type": "array" }
      }
    },
    "trace": {
      "type": "object",
      "description": "Full chronological execution trace capturing all inter-agent messages and tool calls."
    }
  },
  "required": ["workflow", "plan", "sources", "facts", "criticReview", "report", "trace"]
}
```

### 2.2 Real Sample Output Excerpt
```json
{
  "workflow": {
    "topic": "Commercial Viability of Solid-State Batteries by 2030",
    "depth": "deep",
    "status": "completed",
    "startedAt": 1740000000000,
    "completedAt": 1740000012400,
    "replanLoops": 1
  },
  "plan": {
    "topic": "Commercial Viability of Solid-State Batteries by 2030",
    "targetAudience": "Venture Capital & Investment Decision Makers",
    "coreObjectives": [
      "Evaluate manufacturing yield rates for solid electrolyte separators",
      "Benchmark gravimetric energy density against NMC811 baselines",
      "Forecast cell-level cost parity milestones ($/kWh)"
    ],
    "subQuestions": [
      "What are current pilot-line yield rates across sulfide vs oxide electrolytes?",
      "How do Projected 2028-2030 pack costs compare to LFP baselines?",
      "Which automotive OEM joint ventures lead commercialization?"
    ],
    "hypotheses": [
      "Solid-state battery cells will reach pack-level parity with premium NMC by 2029.",
      "Anode-less lithium metal designs encounter severe calendar life degradation without active pressure management."
    ],
    "searchQueries": [
      "solid state battery commercialization timeline OEM 2028 2030",
      "sulfide oxide electrolyte cost comparison per kWh",
      "lithium metal dendrite stack pressure cycle life"
    ]
  },
  "criticReview": {
    "overallCredibilityScore": 91,
    "totalSourcesEvaluated": 12,
    "verifiedFactsCount": 16,
    "criticDecision": "approved",
    "sourceScorecards": [
      {
        "sourceId": "src-1",
        "domain": "nature.com",
        "credibilityScore": 96,
        "authorityLevel": "High",
        "biasRating": "Academic",
        "flags": [],
        "verdict": "Verified reference passed rigor audit (96/100)"
      }
    ]
  },
  "report": {
    "title": "Commercial Viability of Solid-State Batteries by 2030: Strategic Investment Memo",
    "wordCount": 1845,
    "readingTimeMinutes": 8,
    "citations": [
      {
        "id": "src-1",
        "index": 1,
        "title": "Progress and Perspectives on Halide and Sulfide Solid Electrolytes",
        "url": "https://nature.com/articles/s41565",
        "domain": "nature.com",
        "authorOrOrg": "Nature Materials",
        "credibilityScore": 96
      }
    ]
  }
}
```
