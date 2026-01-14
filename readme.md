# Chatbot Test Folder

Files:
- index.html     → open this in browser
- debt-agent.js  → contains the fetch call to n8n

How to test:
1. Save both files in the same folder
2. Double-click index.html (or open with browser)
3. Type a question → press Send or Enter

Troubleshooting:
• Open DevTools (F12) → Console tab → look for errors
• Check Network tab → see if POST request to n8n appears
• Make sure the workflow is ACTIVE in n8n
• Confirm you're using the production URL (no /webhook-test/)