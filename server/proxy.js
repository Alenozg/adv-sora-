require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/gemini-models', async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.json({ error: 'No GEMINI_API_KEY' });
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await r.json();
    const names = (data.models || []).map(m => m.name);
    res.json({ models: names });
  } catch(e) { res.json({ error: e.message }); }
});

async function callGemini(system, messages, maxTokens) {
  const key = process.env.GEMINI_API_KEY;
  
  const attempts = [
    { model: 'gemini-3-flash-preview', ver: 'v1beta' },
    { model: 'gemini-2.5-flash',       ver: 'v1beta' },
    { model: 'gemini-2.0-flash',       ver: 'v1beta' },
    { model: 'gemini-2.0-flash-lite',  ver: 'v1beta' },
  ];

  const errors = [];

  for (const { model, ver } of attempts) {
    const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${key}`;
    
    const lastMsg = messages[messages.length - 1];
    let parts;
    if (Array.isArray(lastMsg.content)) {
      parts = lastMsg.content.map(p => {
        if (p.type === 'text') return { text: p.text };
        if (p.type === 'image') return { inlineData: { mimeType: p.source.media_type, data: p.source.data } };
        return null;
      }).filter(Boolean);
    } else {
      const prompt = messages.map(m => {
        const c = typeof m.content === 'string' ? m.content : (m.content[0]?.text || '');
        return (m.role === 'user' ? 'User' : 'Assistant') + ': ' + c;
      }).join('\n');
      parts = [{ text: prompt }];
    }

    const body = {
      contents: [{ role: 'user', parts }],
      generationConfig: { maxOutputTokens: Math.max(maxTokens || 2000, 8000), temperature: 0.7 },
    };
    if (system) body.systemInstruction = { parts: [{ text: system }] };

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await resp.json();

      if (data.error) {
        const msg = `${model}(${ver}): ${data.error.message || JSON.stringify(data.error)}`;
        console.log(`[Gemini] ❌ ${msg}`);
        errors.push(msg);
        continue;
      }

      const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
      const inT  = data.usageMetadata?.promptTokenCount     || 0;
      const outT = data.usageMetadata?.candidatesTokenCount || 0;
      const tl   = ((inT / 1e6) * 0.075 + (outT / 1e6) * 0.30) * 35;
      console.log(`[Gemini] ✅ ${model}(${ver}) in:${inT} out:${outT} ₺${tl.toFixed(5)}`);

      return { content: [{ type: 'text', text }], usage: { input_tokens: inT, output_tokens: outT } };
    } catch (e) {
      const msg = `${model}(${ver}): ${e.message}`;
      console.log(`[Gemini] ❌ ${msg}`);
      errors.push(msg);
    }
  }

  throw new Error('Gemini çalışmıyor:\n' + errors.slice(0,3).join('\n'));
}

app.post('/api/claude', async (req, res) => {
  try {
    const { model = 'claude', claudeModel, messages, system, max_tokens = 4096 } = req.body;
    const CLAUDE_MODEL = claudeModel || 'claude-sonnet-4-20250514';

    if (model === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: { message: '❌ GEMINI_API_KEY eksik.' } });
      }
      const data = await callGemini(system, messages, max_tokens);
      return res.json(data);
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: { message: '❌ ANTHROPIC_API_KEY eksik.' } });
    }
    console.log('🧠 Claude API...');
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens,
      system,
      messages,
    });
    if (response.usage) {
      const tl = ((response.usage.input_tokens / 1e6) * 3 + (response.usage.output_tokens / 1e6) * 15) * 35;
      console.log(`[Claude] in:${response.usage.input_tokens} out:${response.usage.output_tokens} ₺${tl.toFixed(4)}`);
    }
    return res.json({
      content: [{ type: 'text', text: response.content[0].text }],
      usage: response.usage,
    });

  } catch (error) {
    console.error('Hata:', error.message);
    res.status(500).json({ error: { message: error.message } });
  }
});

// Serve built React app
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`\n🚀 AdVisorAI — http://localhost:${port}`);
  console.log(`   Claude: ${process.env.ANTHROPIC_API_KEY ? '✅' : '❌ eksik'}`);
  console.log(`   Gemini: ${process.env.GEMINI_API_KEY    ? '✅' : '❌ eksik'}`);
  console.log(`   PORT: ${port}\n`);
});
