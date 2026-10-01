import { NextRequest } from 'next/server';
import { ResearchOrchestrator } from '@/lib/agents/orchestrator';
import { ResearchDepth, ReportPersona, SearchScope, StreamEvent } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic,
      depth = 'standard',
      persona = 'executive',
      searchScope = 'all',
      redTeamMode = false,
      customInstructions,
      customDocuments = [],
      apiKey,
      modelName,
    } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Research topic is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start background asynchronous orchestration
    (async () => {
      const sendEvent = async (event: StreamEvent) => {
        try {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          await writer.write(encoder.encode(payload));
        } catch {
          // Client disconnected
        }
      };

      try {
        const orchestrator = new ResearchOrchestrator(
          topic.trim(),
          depth as ResearchDepth,
          persona as ReportPersona,
          searchScope as SearchScope,
          Boolean(redTeamMode),
          customInstructions,
          customDocuments,
          { apiKey, modelName },
          (event) => {
            sendEvent(event);
          }
        );

        await orchestrator.run();
      } catch (err: any) {
        console.error('[API Research] Orchestrator error:', err);
        await sendEvent({
          type: 'workflow_error',
          timestamp: Date.now(),
          data: { error: err?.message || 'Research pipeline encountered an unexpected failure.' },
        });
      } finally {
        try {
          await writer.close();
        } catch {
          // Closed
        }
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Invalid request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
