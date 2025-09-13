const OpenAI = require("openai");

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function nlToRules(nlText) {
  if (!openai) throw new Error("OPENAI_API_KEY not set");

  const prompt = `
You are an assistant that converts a user natural language description into a JSON rule tree.
Return ONLY JSON. Example output:
{ "operator": "AND", "conditions": [ { "field": "totalSpend", "op": ">", "value": 5000 }, { "field": "lastOrderDate", "op": "<=", "value": "2024-01-01" } ] }

User: "${nlText}"
Return suitable fields: totalSpend (number), visits (number), lastOrderDate (ISO date), email (string) and ops >, <, >=, <=, ==, !=, contains, in
`;

  const resp = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  const txt = resp.choices[0].message.content.trim();

  try {
    return JSON.parse(txt);
  } catch (err) {
    const first = txt.indexOf("{");
    const last = txt.lastIndexOf("}");
    const sub = txt.substring(first, last + 1);
    return JSON.parse(sub);
  }
}

async function suggestMessages(objective, audienceSummary = "") {
  if (!openai) throw new Error("OPENAI_API_KEY not set");

  const prompt = `
You are a marketing assistant. Suggest 3 short personalized message templates for objective: "${objective}".
Return as a JSON array of strings only.
Audience summary: "${audienceSummary}"
`;

  const r = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  const txt = r.choices[0].message.content.trim();

  try {
    return JSON.parse(txt);
  } catch (e) {
    return txt.split(/\n+/).filter(Boolean);
  }
}

module.exports = { nlToRules, suggestMessages };
