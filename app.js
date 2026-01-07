const HF_API_URL =
  "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

async function analyzeIncident() {
  const incident = document.getElementById("incident").value.trim();
  const logs = document.getElementById("logs").value.trim();
  const output = document.getElementById("output");

  if (!incident || !logs) {
    output.value = "Both Incident Summary and Raw Logs are required.";
    return;
  }

  // Count approximate number of raw logs (by line)
  const logCount = logs.split("\n").filter(l => l.trim() !== "").length;

  const prompt = `
You are acting as a Tier-1 SOC analyst assistant specializing in FortiSIEM (FSM).

Input Structure:
- A FortiSIEM Incident Summary (incident metadata, rule details, entities)
- A limited number of raw log events (between 1 and 10)

Your Responsibilities:
- Extract relevant fields from the incident summary (rule name, severity, user, host, timestamps)
- Interpret why the FortiSIEM rule triggered using the rule description
- Correlate incident metadata with the provided raw logs
- Identify patterns such as repeated failures, lockouts, or abnormal behavior
- Assess risk using ONLY the provided data
- Adjust confidence level based on the number of raw logs provided
- Provide Tier-1 friendly coaching and validation guidance

Strict Rules:
- Analyze ONLY the pasted content
- Do NOT assume missing data
- Do NOT hallucinate environment or organization context
- If information is missing or log volume is low, explicitly state limitations
- Treat "Resolution set by Machine Learning" as informational only
- Use FortiSIEM-relevant terminology
- Be concise, structured, and operational

MANDATORY OUTPUT FORMAT (do not change headings):

1. Incident Summary
2. Why This Alert Triggered
3. Key Indicators Observed
4. Raw Log Guidance
5. Validation Steps (Tier-1 Friendly)
6. Potential Cause
7. Threat Assessment
8. False Positive Check
9. Escalation Guidance

ADDITIONAL REQUIREMENTS:
- Explicitly state an overall analysis confidence: Low / Medium / High
- If fewer than 5 raw logs are provided, clearly mention reduced confidence
- Include practical Tier-1 coaching hints (what to double-check manually)

Incident Summary Provided:
${incident}

Raw Log Events Provided (${logCount} events):
${logs}
`;

  output.value = "Analyzing incident… please wait.";

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true }
      })
    });

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      output.value = data[0].generated_text;
    } else {
      output.value =
        "Unexpected response format received.\n\n" +
        JSON.stringify(data, null, 2);
    }
  } catch (error) {
    output.value =
      "Error contacting AI service. Please retry after some time.";
  }
}
