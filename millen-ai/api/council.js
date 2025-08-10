// /millen-ai/api/council.js

import { ModelSelector } from './helpers/modelSelector.js';
import { Synthesizer } from './helpers/synthesizer.js';
import { GroqClient } from './helpers/groqClient.js';

export const config = {
  runtime: 'edge',
  maxDuration: 60,
};

// Helper to add a small delay to avoid hitting TPM limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { prompt, apiKey } = await req.json();

    if (!prompt || !apiKey) {
      return new Response(JSON.stringify({ error: 'Missing prompt or apiKey' }), { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendUpdate = (type, data) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, data })}\n\n`));
        };

        try {
          const modelSelector = new ModelSelector();
          const synthesizer = new Synthesizer();
          const groqClient = new GroqClient(apiKey);
          let evidence = { prompt };

          sendUpdate('phase', { phase: 'selecting', message: 'Convening the Council...' });
          const councilMembers = await modelSelector.selectOptimalModels();
          sendUpdate('members_selected', { members: councilMembers });

          // PHASE 1: RESEARCH (Compound Beta)
          const researcher = councilMembers.find(m => m.role === 'The Researcher');
          sendUpdate('member_status', { memberId: researcher.id, status: 'researching' });
          const researchResponse = await groqClient.chat({
            model: researcher.id,
            messages: [{ role: 'user', content: `Perform a web search to gather raw data, facts, and diverse sources about: "${prompt}". Synthesize the top 5-7 key points into a bulleted list.` }],
            max_tokens: researcher.allocatedTokens,
          });
          evidence.research = researchResponse.choices[0].message.content;
          sendUpdate('member_status', { memberId: researcher.id, status: 'complete' });
          await delay(1000); // Stagger requests

          // PHASE 2: ANALYSIS (Llama 8b)
          const analyst = councilMembers.find(m => m.role === 'The Analyst');
          sendUpdate('member_status', { memberId: analyst.id, status: 'analyzing' });
          const analysisResponse = await groqClient.chat({
            model: analyst.id,
            messages: [{ role: 'user', content: `Based on this research data:\n\n${evidence.research}\n\nProvide a concise, practical analysis of the original topic: "${prompt}". Identify the main arguments and implications.` }],
            max_tokens: analyst.allocatedTokens,
          });
          evidence.analysis = analysisResponse.choices[0].message.content;
          sendUpdate('member_status', { memberId: analyst.id, status: 'complete' });
          await delay(1000);

          // PHASE 3: PHILOSOPHICAL VIEW (Llama 70b)
          const philosopher = councilMembers.find(m => m.role === 'The Philosopher');
          sendUpdate('member_status', { memberId: philosopher.id, status: 'pondering' });
          const philosophyResponse = await groqClient.chat({
            model: philosopher.id,
            messages: [{ role: 'user', content: `Here is research and an analysis on "${prompt}":\n\nResearch:\n${evidence.research}\n\nAnalysis:\n${evidence.analysis}\n\nNow, provide a contrarian or alternative perspective. Discuss the long-term consequences, ethical considerations, or hidden assumptions.` }],
            max_tokens: philosopher.allocatedTokens,
          });
          evidence.philosophy = philosophyResponse.choices[0].message.content;
          sendUpdate('member_status', { memberId: philosopher.id, status: 'complete' });
          await delay(1000);

          // PHASE 4: FINAL JUDGEMENT & SYNTHESIS (GPT-OSS)
          const judge = councilMembers.find(m => m.role === 'The Judge');
          sendUpdate('member_status', { memberId: judge.id, status: 'judging' });
          sendUpdate('phase', { phase: 'synthesizing', message: 'The Judge is delivering the final verdict...' });
          const finalSynthesis = await synthesizer.createFinalVerdict(evidence, judge, groqClient);
          sendUpdate('synthesis_complete', { synthesis: finalSynthesis });

        } catch (error) {
          console.error('[COUNCIL API ERROR]', error);
          sendUpdate('error', { message: error.message.toString() });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }
}