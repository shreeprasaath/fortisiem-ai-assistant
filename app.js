const HF_API_URL =
  "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

async function analyzeIncident() {
  const incident = document.getElementById("incident").value.trim();
  const logs = document.getElementById("logs").value.trim();
  const output = document.getElementById("output");

  if (!incident || !logs) {
    output.value = "Both Incident Details and Raw Logs are required.";
    return;
  }

  const prompt = `
You are acting as a Tier-1 SOC analyst assistant specializing in FortiSIEM (FSM).

Scope:
- Incident understanding
- Raw log interpretation
- Cause analysis
- Threat assessment
- False positive identification
- Escalation guidance

You MUST handle:
- Field extraction from logs
- Pattern detection
- Rule interpretation based on incident context
- Risk reasoning using only provided data
- SOC-level analytical judgment

Strict Rules:
- Analyze ONLY the pasted content
- Do NOT assume missing data
- Do NOT hallucinate external context
- Explicitly state if information is insufficient
- Use FortiSIEM-relevant terminology
- Assume Tier-1 analyst audience
- Be concise, structured, and operational

Mandatory Output Format:
1. Incident Summary
2. Why This Alert Triggered
3. Key Indicators Observed
4. Raw Log Guidance
5. Validation Steps (Tier-1 Friendly)
6. Potential Cause
7. Threat Assessment
8. False Positive Check
9. Escalation Guidance

Incident Details:
${incident}

Last 10 Raw Events:
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
      output.value = "Unexpected response format.\n\n" +
        JSON.stringify(data, null, 2);
    }
  } catch (error) {
    output.value = "Unable to contact AI service. Try again later.";
  }
}
