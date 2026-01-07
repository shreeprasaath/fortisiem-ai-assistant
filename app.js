// Load API key from local storage on startup
document.addEventListener("DOMContentLoaded", () => {
  const savedKey = localStorage.getItem("GEMINI_API_KEY");
  if (savedKey) {
    document.getElementById("apiKey").value = savedKey;
  }
});

function saveApiKey() {
  const key = document.getElementById("apiKey").value.trim();
  if (key) {
    localStorage.setItem("GEMINI_API_KEY", key);
    alert("API Key saved locally.");
  } else {
    alert("Please enter a valid API key.");
  }
}

async function analyzeIncident() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const incident = document.getElementById("incident").value.trim();
  const logs = document.getElementById("logs").value.trim();
  const output = document.getElementById("output");

  if (!apiKey) {
    output.value = "Error: Gemini API Key is missing. Please enter it above.";
    return;
  }

  if (!incident || !logs) {
    output.value = "Error: Both Incident Detail and Raw Logs are required.";
    return;
  }

  const logCount = logs.split("\n").filter(l => l.trim() !== "").length;

  const systemPrompt = `You are an expert SOC Analyst and Cyber Security Threat Hunter specializing in FortiSIEM.
Your goal is to analyze FortiSIEM incidents and provide a detailed, accurate assessment.

INPUT DATA:
- FortiSIEM Incident Detail (Rule, Target, Description)
- Last 10 Raw Logs related to the incident

OUTPUT REQUIREMENTS:
1. **True Positive / False Positive Determination**: Clearly state if this is a TP or FP and quantify your confidence (0-100%).
2. **Root Cause Analysis**: Explain EXACTLY what happened based on the logs.
3. **MITRE ATT&CK TTPs**: Identify probable attack TTPs (at least 90% similarity/relevance). Include IDs (e.g., T1078).
4. **Next Steps & Advice**: Precise actions for containment and remediation.
5. **Similar Attack Patterns**: Briefly describe a historical or known attack pattern this resembles.

STRICT RULES:
- Be concise but technically deep.
- Use markdown formatting for readability.
- If the logs are insufficient, explain what is missing.
- Do NOT hallucinate data not present in the inputs.`;

  const userPrompt = `
FORTISIEM INCIDENT DETAIL:
${incident}

RECENT LOG EVENTS (${logCount} events):
${logs}
`;

  output.innerHTML = '<p style="color: var(--accent-primary); animation: pulse 2s infinite;">Initializing AI analysis engine... correlation in progress...</p>';

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const markdown = data.candidates[0].content.parts[0].text;
      output.innerHTML = marked.parse(markdown);
    } else if (data.error) {
      output.innerHTML = `<div style="color: var(--danger); padding: 20px;">
        <h3>API Error</h3>
        <p>${data.error.message}</p>
        <p>Check if your API key is valid and has Gemini API access enabled.</p>
      </div>`;
    } else {
      output.innerHTML = '<p style="color: var(--danger);">Unexpected response from Gemini API. Please check console for details.</p>';
      console.error(data);
    }
  } catch (error) {
    output.innerHTML = `<div style="color: var(--danger); padding: 20px;">
      <h3>Connection Error</h3>
      <p>${error.message}</p>
      <p>Please check your internet connection or API status.</p>
    </div>`;
    console.error(error);
  }
}
