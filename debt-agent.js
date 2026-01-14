// debt-agent.js
// Last updated: January 14, 2026
// Production webhook for Debt & Credit Chatbot (Singapore)
// Use this file together with index.html that imports it as a module

const WEBHOOK_URL = 'https://n8ngc.codeblazar.org/webhook/a3b1c9b0-839f-4c97-8dd8-b7b66ccc9524';

export async function getAIResponse(userInput) {
  if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
    return "Please type a question about debt or credit in Singapore.";
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: userInput.trim(),
        // You can add more fields here later if needed, e.g.:
        // sessionId: someUserId,
        // timestamp: new Date().toISOString()
      }),
      // Optional: prevent hanging forever
      signal: AbortSignal.timeout(15000)  // 15 seconds timeout
    });

    if (!response.ok) {
      throw new Error(`n8n webhook returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Try multiple common output locations n8n might use
    let reply = 
      data.output ||
      data.response ||
      data.text ||
      data.message ||
      data.result ||
      (data.json && (data.json.output || data.json.text || data.json.message)) ||
      'No reply content received from assistant';

    // Clean up unwanted prefixes that sometimes appear in misconfigured workflows
    reply = reply
      .replace(/^Workflow was started\s*/i, '')
      .replace(/^\s*Workflow executed\s*/i, '')
      .trim();

    // Add Singapore-specific disclaimer if not already present
    const disclaimer = 
      "\n\n**Disclaimer:** This is general information only and not personalized financial advice. " +
      "Consult a qualified professional or Credit Counselling Singapore (CCS) for advice tailored to your situation.";

    if (!reply.includes('Disclaimer')) {
      reply += disclaimer;
    }

    return reply;

  } catch (error) {
    console.error('Debt & Credit Agent – fetch error:', error);

    let friendlyMessage = "Sorry, I'm having trouble connecting to the assistant right now.";

    if (error.name === 'TimeoutError') {
      friendlyMessage = "The assistant took too long to respond. Please try again.";
    } else if (error.message.includes('404')) {
      friendlyMessage = "Chat service not found. The link may have changed.";
    } else if (error.message.includes('CORS')) {
      friendlyMessage = "Connection blocked (CORS issue). This usually needs to be fixed on the server side.";
    }

    return friendlyMessage + "\n\nPlease try again in a moment or refresh the page.";
  }
}
