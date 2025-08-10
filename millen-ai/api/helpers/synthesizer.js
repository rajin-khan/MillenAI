// /millen-ai/api/helpers/synthesizer.js
export class Synthesizer {
  async createFinalVerdict(evidence, judge, groqClient) {
    const synthesisPrompt = `
      You are The Judge. You have been presented with evidence from a council of AI experts regarding the user's request: "${evidence.prompt}"

      Here is the evidence you must consider:

      ---
      ### 1. The Researcher's Findings (Raw Data)
      ${evidence.research}
      ---
      ### 2. The Analyst's Interpretation (Practical View)
      ${evidence.analysis}
      ---
      ### 3. The Philosopher's Perspective (Alternative/Ethical View)
      ${evidence.philosophy}
      ---

      Based on all the evidence presented, structure your response *exactly* as follows, using the headings provided:

      ## ⚖️ Final Verdict
      **[Your single, definitive, bolded sentence answering the user's request]**

      ## 🏛️ The Council's Reasoning
      [Your explanation of HOW you arrived at the verdict, referencing the specific findings from The Researcher, The Analyst, and The Philosopher to support your conclusion.]
    `;

    const response = await groqClient.chat({
      model: judge.id,
      messages: [{ role: 'user', content: synthesisPrompt }],
      max_tokens: judge.allocatedTokens,
      temperature: 0.5,
      reasoning_effort: 'medium',
    });

    // We now create a single, unified markdown document with clear separators
    const finalReport = `
      # 🏛️ AI Council Final Decree
      **Regarding**: ${evidence.prompt}

      ${response.choices[0].message.content}

      ---
      
      ## 🔬 Individual Analyses
      
      --- [The Researcher START] ---
      ${evidence.research}
      --- [The Researcher END] ---

      --- [The Analyst START] ---
      ${evidence.analysis}
      --- [The Analyst END] ---

      --- [The Philosopher START] ---
      ${evidence.philosophy}
      --- [The Philosopher END] ---
    `;

    return finalReport;
  }
}