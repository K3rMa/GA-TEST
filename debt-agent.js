// debt-agent.js
// Production webhook URL – make sure this matches your active n8n production webhook

const WEBHOOK_URL = 'https://n8ngc.codeblazar.org/webhook/cde1b808-6567-4916-9699-61475929083a';

export async function getAIResponse(userInput) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userInput.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    const data = await response.json();

    // Most common n8n AI Agent output keys
    let aiText = data.output || data.response || data.text || data.message || data.json?.output;

    if (!aiText || typeof aiText !== 'string') {
      throw new Error('Invalid or empty response from n8n');
    }

    // Add Singapore disclaimer (you can remove or customize)
    const disclaimer = "\n\n**Disclaimer:** This is general information only and not personalized financial advice. Consult a qualified professional or Credit Counselling Singapore (CCS) for advice tailored to your situation.";

    return aiText + disclaimer;

  } catch (error) {
    console.error('Debt & Credit Agent Error:', error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
}