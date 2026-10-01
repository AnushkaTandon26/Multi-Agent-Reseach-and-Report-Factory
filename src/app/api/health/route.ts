import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      system: 'Multi-Agent Research and Report Factory',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      agents: ['planner', 'searcher', 'reader', 'critic', 'writer'],
      activeFeatures: {
        evaluatorOptimizerLoop: true,
        typedMessageBus: true,
        sharedRunMemory: true,
        executionTraceExport: true,
        byodDocumentIngestion: true,
      },
    },
    { status: 200 }
  );
}
