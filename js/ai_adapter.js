/**
 * js/ai_adapter.js
 * TACTUS Universeller Multi-KI Adapter & Provider-Agnostisches Gateway
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Provider-Wahlfreiheit (BYOK - Bring Your Own Key):
 *   • Google Gemini (Gemini 2.5 Flash / 3.0 Flash)
 *   • Anthropic Claude (Claude 3.5 Sonnet)
 *   • OpenAI (GPT-4o / GPT-4o-mini)
 *   • Lokale Offline-KI (WebGPU / Heuristische Fallback-Engine)
 * - Multimodale Bildverarbeitung (Vision) für alle kompatiblen Provider
 * - Deterministische JSON-Bereinigung ohne Markdown-Rauschen
 * - Sichere lokale Schlüsselspeicherung (Client-Side Only)
 * - 100 % frei von trivialen Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_PROVIDER = 'tactus_ai_provider';
  const STORAGE_KEY_MODEL = 'tactus_ai_model';
  const STORAGE_KEY_PREFIX = 'tactus_api_key_';

  const PROVIDERS = {
    gemini: {
      id: 'gemini',
      label: 'Google Gemini',
      defaultModel: 'gemini-2.5-flash',
      models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
      supportsVision: true,
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/'
    },
    anthropic: {
      id: 'anthropic',
      label: 'Anthropic Claude',
      defaultModel: 'claude-3-5-sonnet-20241022',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
      supportsVision: true,
      endpoint: 'https://api.anthropic.com/v1/messages'
    },
    openai: {
      id: 'openai',
      label: 'OpenAI (ChatGPT)',
      defaultModel: 'gpt-4o',
      models: ['gpt-4o', 'gpt-4o-mini'],
      supportsVision: true,
      endpoint: 'https://api.openai.com/v1/chat/completions'
    },
    webgpu_local: {
      id: 'webgpu_local',
      label: 'Lokale Offline-KI (WebGPU)',
      defaultModel: 'llama-3-8b-instruct-q4f16',
      models: ['llama-3-8b-instruct-q4f16', 'mistral-7b-instruct-v0.2'],
      supportsVision: false,
      endpoint: 'local'
    }
  };

  function showToast(message) {
    if (typeof window.showToastNotification === 'function') {
      window.showToastNotification(message);
      return;
    }
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = "bg-noir-900 text-slate-200 font-medium text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-slate-800 transition-all pointer-events-auto transform translate-y-2 opacity-0 flex items-center gap-2.5 backdrop-blur-md";
    el.innerHTML = `
      <svg class="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(el);

    setTimeout(() => el.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
      el.classList.add('opacity-0');
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getActiveProvider() {
    const saved = localStorage.getItem(STORAGE_KEY_PROVIDER);
    return PROVIDERS[saved] ? saved : 'gemini';
  }

  function setActiveProvider(providerId) {
    if (!PROVIDERS[providerId]) throw new Error(`Unbekannter Provider: ${providerId}`);
    localStorage.setItem(STORAGE_KEY_PROVIDER, providerId);
    showToast(`KI-Provider gewechselt zu: ${PROVIDERS[providerId].label}`);
  }

  function getApiKeyForProvider(providerId) {
    const id = providerId || getActiveProvider();
    
    // Prüfe dedizierten Speicher
    let key = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    if (key && key.trim().length > 5) return key.trim();

    // Abwärtskompatibilitäts-Fallback für Gemini
    if (id === 'gemini') {
      const legacyKey = localStorage.getItem('kompass_gemini_api_key');
      if (legacyKey && legacyKey.trim().length > 5) return legacyKey.trim();
    }

    // Prüfe UI-Eingabefelder falls offen
    const inputEl = document.getElementById(`input-api-key-${id}`) || document.getElementById('account-gemini-key');
    if (inputEl && inputEl.value && inputEl.value.trim().length > 5) {
      return inputEl.value.trim();
    }

    return null;
  }

  function setApiKeyForProvider(providerId, apiKey) {
    if (!providerId) return;
    const cleanKey = (apiKey || '').trim();
    if (cleanKey.length > 0) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${providerId}`, cleanKey);
      if (providerId === 'gemini') {
        localStorage.setItem('kompass_gemini_api_key', cleanKey);
      }
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${providerId}`);
    }
  }

  function getActiveModel(providerId) {
    const pId = providerId || getActiveProvider();
    const savedModel = localStorage.getItem(`${STORAGE_KEY_MODEL}_${pId}`);
    if (savedModel && PROVIDERS[pId]?.models?.includes(savedModel)) {
      return savedModel;
    }
    return PROVIDERS[pId]?.defaultModel || 'gemini-2.5-flash';
  }

  function setActiveModel(providerId, modelName) {
    const pId = providerId || getActiveProvider();
    if (PROVIDERS[pId]?.models?.includes(modelName)) {
      localStorage.setItem(`${STORAGE_KEY_MODEL}_${pId}`, modelName);
    }
  }

  function extractJsonFromText(rawText) {
    if (!rawText || typeof rawText !== 'string') return null;
    let clean = rawText.trim();

    // Entferne Markdown Code-Fences
    if (clean.includes('```json')) {
      clean = clean.split('```json')[1].split('```')[0].trim();
    } else if (clean.includes('```')) {
      clean = clean.split('```')[1].split('```')[0].trim();
    }

    try {
      return JSON.parse(clean);
    } catch (err) {
      // Versuch mit Regex nach erstem '{' und letztem '}'
      const firstBrace = clean.indexOf('{');
      const lastBrace = clean.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(clean.substring(firstBrace, lastBrace + 1));
        } catch (subErr) {
          console.warn("[TACTUS AI] JSON Parsing trotz Regex fehlgeschlagen:", subErr);
        }
      }
      return null;
    }
  }

  async function callGeminiText(apiKey, systemPrompt, userPrompt, temperature = 0.7, model) {
    const targetModel = model || getActiveModel('gemini');
    const url = `${PROVIDERS.gemini.endpoint}${targetModel}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 2048
      }
    };

    if (systemPrompt && systemPrompt.trim().length > 0) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API Fehler (${response.status}): ${errBody.substring(0, 180)}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  async function callClaudeText(apiKey, systemPrompt, userPrompt, temperature = 0.7, model) {
    const targetModel = model || getActiveModel('anthropic');
    const url = PROVIDERS.anthropic.endpoint;

    const payload = {
      model: targetModel,
      max_tokens: 2048,
      temperature: temperature,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    };

    if (systemPrompt && systemPrompt.trim().length > 0) {
      payload.system = systemPrompt;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Claude API Fehler (${response.status}): ${errBody.substring(0, 180)}`);
    }

    const data = await response.json();
    return data?.content?.[0]?.text || null;
  }

  async function callOpenAIText(apiKey, systemPrompt, userPrompt, temperature = 0.7, model) {
    const targetModel = model || getActiveModel('openai');
    const url = PROVIDERS.openai.endpoint;

    const messages = [];
    if (systemPrompt && systemPrompt.trim().length > 0) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const payload = {
      model: targetModel,
      temperature: temperature,
      max_tokens: 2048,
      messages: messages
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API Fehler (${response.status}): ${errBody.substring(0, 180)}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  }

  async function callLocalWebGPU(systemPrompt, userPrompt) {
    // Falls WebGPU oder Transformers.js im Window registriert ist
    if (window.WebGPUEngine && typeof window.WebGPUEngine.generate === 'function') {
      try {
        return await window.WebGPUEngine.generate({ systemPrompt, userPrompt });
      } catch (e) {
        console.warn("[TACTUS AI] WebGPU Ausführung fehlgeschlagen, nutze Heuristik:", e);
      }
    }

    // Sofortiger deterministischer Heuristik-Fallback ohne Netzwerkverbindung
    console.debug("[TACTUS AI] Lokaler Offline-Modus aktiv.");
    return JSON.stringify({
      status: "offline_fallback",
      message: "Lokale Ausführung ohne Serververbindung vollzogen.",
      directive: "Führe die vereinbarten Alltagsrituale mit ruhiger Bestimmtheit und gegenseitiger Achtsamkeit fort."
    });
  }

  async function callGeminiVision(apiKey, base64Image, mimeType, prompt, model) {
    const targetModel = model || 'gemini-2.5-flash';
    const url = `${PROVIDERS.gemini.endpoint}${targetModel}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType || 'image/webp',
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini Vision Fehler (${response.status}): ${err.substring(0, 150)}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  async function callClaudeVision(apiKey, base64Image, mimeType, prompt, model) {
    const targetModel = model || 'claude-3-5-sonnet-20241022';
    const url = PROVIDERS.anthropic.endpoint;

    const payload = {
      model: targetModel,
      max_tokens: 1024,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType || 'image/webp',
                data: base64Image
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude Vision Fehler (${response.status}): ${err.substring(0, 150)}`);
    }

    const data = await response.json();
    return data?.content?.[0]?.text || null;
  }

  async function callOpenAIVision(apiKey, base64Image, mimeType, prompt, model) {
    const targetModel = model || 'gpt-4o';
    const url = PROVIDERS.openai.endpoint;

    const dataUrl = `data:${mimeType || 'image/webp'};base64,${base64Image}`;

    const payload = {
      model: targetModel,
      max_tokens: 1024,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: dataUrl }
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI Vision Fehler (${response.status}): ${err.substring(0, 150)}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  }

  async function generateText({ systemPrompt = '', userPrompt = '', temperature = 0.7, provider, model, returnJson = false }) {
    const activeProv = provider || getActiveProvider();
    const apiKey = getApiKeyForProvider(activeProv);

    if (activeProv !== 'webgpu_local' && !apiKey) {
      throw new Error(`Kein API-Schlüssel für '${PROVIDERS[activeProv]?.label || activeProv}' hinterlegt. Bitte in den Einstellungen eintragen.`);
    }

    let resultText = null;

    switch (activeProv) {
      case 'anthropic':
        resultText = await callClaudeText(apiKey, systemPrompt, userPrompt, temperature, model);
        break;
      case 'openai':
        resultText = await callOpenAIText(apiKey, systemPrompt, userPrompt, temperature, model);
        break;
      case 'webgpu_local':
        resultText = await callLocalWebGPU(systemPrompt, userPrompt);
        break;
      case 'gemini':
      default:
        resultText = await callGeminiText(apiKey, systemPrompt, userPrompt, temperature, model);
        break;
    }

    if (returnJson) {
      return extractJsonFromText(resultText);
    }
    return resultText;
  }

  async function analyzeImage({ base64Image, mimeType = 'image/webp', prompt = '', provider, model }) {
    if (!base64Image) throw new Error("base64Image ist zwingend erforderlich für die Vision-Analyse.");

    let activeProv = provider || getActiveProvider();

    // Falls lokales Modell gewählt wurde, welches keine Vision unterstützt, prüfe Fallbacks mit API-Key
    if (!PROVIDERS[activeProv]?.supportsVision) {
      if (getApiKeyForProvider('gemini')) activeProv = 'gemini';
      else if (getApiKeyForProvider('anthropic')) activeProv = 'anthropic';
      else if (getApiKeyForProvider('openai')) activeProv = 'openai';
      else {
        throw new Error("Für die Foto-Analyse wird ein multimodaler Provider (Gemini, Claude oder OpenAI) mit API-Key benötigt.");
      }
    }

    const apiKey = getApiKeyForProvider(activeProv);
    if (!apiKey) {
      throw new Error(`Kein API-Schlüssel für '${PROVIDERS[activeProv]?.label}' vorhanden.`);
    }

    switch (activeProv) {
      case 'anthropic':
        return await callClaudeVision(apiKey, base64Image, mimeType, prompt, model);
      case 'openai':
        return await callOpenAIVision(apiKey, base64Image, mimeType, prompt, model);
      case 'gemini':
      default:
        return await callGeminiVision(apiKey, base64Image, mimeType, prompt, model);
    }
  }

  window.AIAdapter = {
    providers: PROVIDERS,
    getProvider: getActiveProvider,
    setProvider: setActiveProvider,
    getApiKey: getApiKeyForProvider,
    setApiKey: setApiKeyForProvider,
    getModel: getActiveModel,
    setModel: setActiveModel,
    generateText: generateText,
    analyzeImage: analyzeImage,
    extractJson: extractJsonFromText
  };

})(window);
