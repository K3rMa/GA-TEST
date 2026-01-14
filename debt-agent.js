// debt-agent.js
// Updated: January 14, 2026
// Production webhook for Debt & Credit Chatbot (Singapore)
// Use together with index.html that imports this file as a module

const WEBHOOK_URL = 'https://n8ngc.codeblazar.org/webhook-test/9689c730-bc37-434b-8d31-3c3bf0e4e1b8';

export async function getAIResponse(userInput) {
  if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
    return "Please type a question about debt or credit in Singapore.";
  }

  const trimmedInput = userInput.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: trimmedInput,
        // optional future fields
        // timestamp: new Date().toISOString(),
        // source: 'web-chat'
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Try common n8n output locations
    let reply = 
      data.output ||
      data.response ||
      data.text ||
      data.message ||
      data.result ||
      (data.json && (data.json.output || data.json.text || data.json.message)) ||
      '';

    // Clean up common unwanted n8n prefixes
    reply = reply
      .replace(/^Workflow (was )?(started|executed|got started)\s*/i, '')
      .replace(/^\s*Workflow response\s*/i, '')
      .trim();

    if (!reply) {
      throw new Error('Empty or invalid response from n8n');
    }

    // Add disclaimer only if not already present
    const disclaimer = 
      "\n\n**Disclaimer:** This is general information only and not personalized financial advice. " +
      "Consult a qualified professional or Credit Counselling Singapore (CCS) for advice tailored to your situation.";

    if (!reply.toLowerCase().includes('disclaimer')) {
      reply += disclaimer;
    }

    return reply;

  } catch (error) {
    console.error('Debt & Credit Agent – fetch error:', error);

    let friendlyMessage = "Sorry, I'm having trouble connecting to the assistant right now.";

    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      friendlyMessage = "The assistant took too long to respond. Please try again.";
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      friendlyMessage = "Chat service not found. The link may have changed.";
    } else if (error.message.includes('CORS')) {
      friendlyMessage = "Connection blocked (CORS issue). This usually needs to be fixed on the server side.";
    } else if (error.message.includes('500') || error.message.includes('Internal Server')) {
      friendlyMessage = "Something went wrong on the server. Please try again later.";
    }

    return friendlyMessage + "\n\nPlease try again in a moment or refresh the page.";
  }
}

