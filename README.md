# AI SOC Incident Analyser (FortiSIEM)

A premium, AI-powered SOC tool designed for Tier-1 analysts to perform deep-dive investigations of FortiSIEM incidents. It uses Google's **Gemini 2.5 Flash-Lite** to correlate raw logs, identify root causes, and map activity to MITRE ATT&CK TTPs.

## ✨ Features
- **Modern UI**: Vibrant dark-themed interface with glassmorphism.
- **Deep Analysis**: TP/FP determination, Root Cause Analysis, and Remediation advice.
- **TTP Correlation**: Maps incident activity to MITRE ATT&CK techniques with high similarity.
- **Secure**: Your API Key is stored only in your local browser (`localStorage`).

## 🚀 How to Use

### 1. Setup Gemini API Key
- Visit **[Google AI Studio](https://aistudio.google.com/)**.
- Generate a free API Key.
- Open `index.html` in your browser.
- Paste the key in the top input field and click **"Save Key"**.

### 2. Perform an Analysis
1. **Incident Detail**: Copy and paste the FortiSIEM Incident Summary, including the Rule Description and Target Entities.
2. **Raw Logs**: Paste the last 1-10 raw log events related to the alert.
3. **Analyze**: Click **"Run AI Verification"**.
4. **Review**: The tool will generate a structured Markdown report with actionable insights.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), JavaScript (ES6+).
- **AI Engine**: Google Gemini 1.5/2.5 API.
- **Markdown Rendering**: [marked.js](https://github.com/markedjs/marked).

## ⚠️ Disclaimer
AI insights are advisory. SOC analysts must verify all findings and follow organizational SOPs before performing containment or remediation actions.
