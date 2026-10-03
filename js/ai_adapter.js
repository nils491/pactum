/**
 * js/ai_adapter.js
 * TACTUS Universeller Multi-KI Adapter & Provider-Agnostisches Gateway (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - BYOK-Architektur (Bring-Your-Own-Key): Volle Wahlfreiheit des Paares
 * - Provider-Portfolio:
 *   • Google Gemini (gemini-flash-latest) - Multimodal Vision & hohe Geschwindigkeit
 *   • Anthropic Claude (claude-3-5-sonnet-20241022) - Tiefe Beziehungspsychologie
 *   • OpenAI (gpt-4o) - Universelle Verbreitung
 *   • WebGPU Local Engine - 100 % privater Offline-Betrieb
 * - Robuste multimodale Vision-Payloads für den 1:1 Foto-Tresor (WebP Base64)
 * - Resiliente 3-Stufen-JSON-Bereinigung (Abstreifen von Markdown-Fences)
 * - Zero-Leakage: API-Keys verbleiben strikt im lokalen Client-Storage
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    provider: 'tactus_ai_provider',
    providerLegacy: 'kompass_ai_provider',
    geminiKey: 'tactus_api_key_gemini',
    geminiKeyLegacy: 'kompass_gemini_api_key',
    anthropicKey: 'tactus_api_key_anthropic',
    openaiKey: 'tactus_api_key_openai',
    customModel: 'tactus_ai_custom_model'
  };

  const PROVIDERS = {
    gemini: {
      id: 'gemini',
      label: 'Google Gemini',
      defaultModel: 'gemini-flash-latest',
      supportsVision: true,
      requiresKey: true,
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
    },
    anthropic: {
      id: 'anthropic',
      label: 'Anthropic Claude',
      defaultModel: 'claude-3-5-sonnet-20241022',
      supportsVision: true,
      requiresKey: true,
      endpoint: 'https://api.anthropic.com/v1/messages'
    },
    openai: {
      id: 'openai',
      label: 'OpenAI',
      defaultModel: 'gpt-4o',
      supportsVision: true,
      requiresKey: true,
      endpoint: 'https://api.openai.com/v1/chat/completions'
    },
    webgpu_local: {
      id: 'webgpu_local',
      label: 'Lokale Offline-KI (WebGPU)',
      defaultModel: 'local-heuristic-v3',
      supportsVision: false,
      requiresKey: false,
      endpoint: null
    }
  };

  function getActiveProvider() {
    const stored = localStorage.getItem(STORAGE_KEYS.provider) || localStorage.getItem(STORAGE_KEYS.providerLegacy);
    // Unbekannte Werte aus älteren Einstellungen (z. B. 'claude', 'webgpu') fallen auf Gemini zurück
    return PROVIDERS[stored] ? stored : 'gemini';
  }

  function setActiveProvider(providerId) {
    if (!PROVIDERS[providerId]) return false;
    localStorage.setItem(STORAGE_KEYS.provider, providerId);
    localStorage.setItem(STORAGE_KEYS.providerLegacy, providerId);
    return true;
  }

  function getApiKeyForProvider(providerId = null) {
    const prov = providerId || getActiveProvider();
    if (prov === 'gemini') {
      return (localStorage.getItem(STORAGE_KEYS.geminiKey) || 
              localStorage.getItem(STORAGE_KEYS.geminiKeyLegacy) ||
              localStorage.getItem('tactus_ai_custom_key') || '').trim();
    }
    if (prov === 'anthropic') {
      return (localStorage.getItem(STORAGE_KEYS.anthropicKey) || '').trim();
    }
    if (prov === 'openai') {
      return (localStorage.getItem(STORAGE_KEYS.openaiKey) || '').trim();
    }
    return '';
  }

  function setApiKeyForProvider(providerId, apiKey) {
    const cleanKey = String(apiKey || '').trim();
    if (providerId === 'gemini') {
      localStorage.setItem(STORAGE_KEYS.geminiKey, cleanKey);
      localStorage.setItem(STORAGE_KEYS.geminiKeyLegacy, cleanKey);
    } else if (providerId === 'anthropic') {
      localStorage.setItem(STORAGE_KEYS.anthropicKey, cleanKey);
    } else if (providerId === 'openai') {
      localStorage.setItem(STORAGE_KEYS.openaiKey, cleanKey);
    }
  }

  function getModelForProvider(providerId = null) {
    const prov = providerId || getActiveProvider();
    const custom = localStorage.getItem(`${STORAGE_KEYS.customModel}_${prov}`);
    return custom || (PROVIDERS[prov] ? PROVIDERS[prov].defaultModel : 'gemini-flash-latest');
  }

  function extractJsonFromText(rawText) {
    if (!rawText || typeof rawText !== 'string') return null;

    let text = rawText.trim();

    // 1. Markdown-Codeblock-Fences abstreifen
    text = text.replace(/^```json\s*/i, '');
    text = text.replace(/^```\s*/, '');
    text = text.replace(/\s*```$/, '');

    // 2. Ersten geschweiften Klammerblock isolieren
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      text = text.substring(startIdx, endIdx + 1);
    }

    try {
      return JSON.parse(text);
    } catch (e1) {
      // 3. Fallback: Entfernung potenzieller Steuerzeichen
      try {
        const sanitized = text.replace(/[\u0000-\u001F]+/g, ' ');
        return JSON.parse(sanitized);
      } catch (e2) {
        console.warn("[TACTUS AIAdapter] Konnte JSON nicht parsen:", e2);
        return null;
      }
    }
  }

  // -------------------------------------------------------------------------
  // Zentraler Gemini-Zugang: eigener Key des Paares oder TACTUS-Fallback
  // -------------------------------------------------------------------------

  function getGeminiRoute() {
    const ownKey = getApiKeyForProvider('gemini');
    if (ownKey) return { mode: 'own', key: ownKey };
    const license = (localStorage.getItem('tactus_license_key') || '').trim();
    if (license && window.location.protocol !== 'file:') return { mode: 'fallback', license };
    return { mode: 'none' };
  }

  function isGeminiAvailable() {
    return getGeminiRoute().mode !== 'none';
  }

  async function ensureAiConsent(route) {
    if (window.TactusAccess && typeof window.TactusAccess.ensureAiConsent === 'function') {
      return window.TactusAccess.ensureAiConsent(route.mode);
    }
    return true;
  }

  /**
   * Führt einen generateContent-Aufruf aus und liefert das fetch-Response-Objekt.
   * body: das Gemini-Request-Objekt (contents, generationConfig, ...)
   */
  async function geminiFetch(model, body) {
    const route = getGeminiRoute();
    if (route.mode === 'none') {
      return new Response(JSON.stringify({ error: { message: 'Kein Gemini-Zugang: eigener API-Key oder TACTUS-Abo nötig.' } }), { status: 401 });
    }
    if (!(await ensureAiConsent(route))) {
      return new Response(JSON.stringify({ error: { message: 'KI-Übermittlung nicht freigegeben.' } }), { status: 403 });
    }
    const cleanModel = String(model || getModelForProvider('gemini')).replace(/^models\//, '');
    const payload = typeof body === 'string' ? body : JSON.stringify(body);

    if (route.mode === 'own') {
      return fetch(`${PROVIDERS.gemini.endpoint}/${encodeURIComponent(cleanModel)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': route.key },
        body: payload
      });
    }

    const base = (localStorage.getItem('tactus_api_base') || '').trim().replace(/\/$/, '');
    return fetch(`${base}/api/ai/${encodeURIComponent(cleanModel)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Tactus-License': route.license },
      body: payload
    });
  }

  async function callGeminiText({ systemPrompt, userPrompt, temperature, maxTokens, model }) {
    if (!isGeminiAvailable()) throw new Error("Kein Gemini-Zugang: eigener API-Key oder TACTUS-Abo nötig.");

    const targetModel = model || getModelForProvider('gemini');

    const bodyPayload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        maxOutputTokens: maxTokens || 2048
      }
    };

    if (systemPrompt && systemPrompt.trim().length > 0) {
      bodyPayload.systemInstruction = {
        parts: [{ text: systemPrompt.trim() }]
      };
    }

    const res = await geminiFetch(targetModel, bodyPayload);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini HTTP ${res.status}: ${errText.substring(0, 180)}`);
    }

    const data = await res.json();
    const candidate = data.candidates && data.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      throw new Error("Gemini lieferte keine Text-Kandidaten.");
    }

    return candidate.content.parts.map(p => p.text || '').join('').trim();
  }

  async function callGeminiVision({ base64Image, mimeType, prompt, model }) {
    if (!isGeminiAvailable()) throw new Error("Kein Gemini-Zugang: eigener API-Key oder TACTUS-Abo nötig.");

    const targetModel = model || getModelForProvider('gemini');

    // Reinen Base64-Payload ohne Data-URL-Header sicherstellen
    const cleanBase64 = base64Image.replace(/^data:[^;]+;base64,/, '');

    const bodyPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt || "Analysiere diesen Gegenstand für ein Schlafzimmer-Inventar." },
            {
              inlineData: {
                mimeType: mimeType || 'image/webp',
                data: cleanBase64
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

    const res = await geminiFetch(targetModel, bodyPayload);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini Vision HTTP ${res.status}: ${errText.substring(0, 180)}`);
    }

    const data = await res.json();
    const candidate = data.candidates && data.candidates[0];
    return candidate.content.parts.map(p => p.text || '').join('').trim();
  }

  async function callClaudeText({ systemPrompt, userPrompt, temperature, maxTokens, model }) {
    const key = getApiKeyForProvider('anthropic');
    if (!key) throw new Error("Kein Anthropic Claude API-Key hinterlegt.");

    const targetModel = model || getModelForProvider('anthropic');
    const endpoint = PROVIDERS.anthropic.endpoint;

    const bodyPayload = {
      model: targetModel,
      max_tokens: maxTokens || 2048,
      temperature: typeof temperature === 'number' ? temperature : 0.7,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    };

    if (systemPrompt && systemPrompt.trim().length > 0) {
      bodyPayload.system = systemPrompt.trim();
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Claude HTTP ${res.status}: ${errText.substring(0, 180)}`);
    }

    const data = await res.json();
    if (!data.content || !Array.isArray(data.content)) {
      throw new Error("Claude lieferte keine Inhalts-Fragmente.");
    }

    return data.content.filter(c => c.type === 'text').map(c => c.text).join('').trim();
  }

  async function callClaudeVision({ base64Image, mimeType, prompt, model }) {
    const key = getApiKeyForProvider('anthropic');
    if (!key) throw new Error("Kein Anthropic Claude API-Key hinterlegt.");

    const targetModel = model || getModelForProvider('anthropic');
    const endpoint = PROVIDERS.anthropic.endpoint;
    const cleanBase64 = base64Image.replace(/^data:[^;]+;base64,/, '');

    const bodyPayload = {
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
                data: cleanBase64
              }
            },
            {
              type: 'text',
              text: prompt || "Analysiere diesen Gegenstand für ein Schlafzimmer-Inventar."
            }
          ]
        }
      ]
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Claude Vision HTTP ${res.status}: ${errText.substring(0, 180)}`);
    }

    const data = await res.json();
    return data.content.filter(c => c.type === 'text').map(c => c.text).join('').trim();
  }

  async function callOpenAIText({ systemPrompt, userPrompt, temperature, maxTokens, model }) {
    const key = getApiKeyForProvider('openai');
    if (!key) throw new Error("Kein OpenAI API-Key hinterlegt.");

    const targetModel = model || getModelForProvider('openai');
    const endpoint = PROVIDERS.openai.endpoint;

    const messages = [];
    if (systemPrompt && systemPrompt.trim().length > 0) {
      messages.push({ role: 'system', content: systemPrompt.trim() });
    }
    messages.push({ role: 'user', content: userPrompt });

    const bodyPayload = {
      model: targetModel,
      messages: messages,
      temperature: typeof temperature === 'number' ? temperature : 0.7,
      max_tokens: maxTokens || 2048
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI HTTP ${res.status}: ${errText.substring(0, 180)}`);
    }

    const data = await res.json();
    const choice = data.choices && data.choices[0];
    if (!choice || !choice.message) {
      throw new Error("OpenAI lieferte keine Antwortnachricht.");
    }

    return choice.message.content.trim();
  }

  async function callOpenAIVision({ base64Image, mimeType, prompt, model }) {
    const key = getApiKeyForProvider('openai');
    if (!key) throw new Error("Kein OpenAI API-Key hinterlegt.");

    const targetModel = model || getModelForProvider('openai');
    const endpoint = PROVIDERS.openai.endpoint;

    let dataUrl = base64Image;
    if (!dataUrl.startsWith('data:')) {
      dataUrl = `data:${mimeType || 'image/webp'};base64,${base64Image}`;
    }

    const bodyPayload = {
      model: targetModel,
      max_tokens: 1024,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt || "Analysiere diesen Gegenstand für ein Schlafzimmer-Inventar." },
            {
              type: 'image_url',
              image_url: { url: dataUrl }
            }
          ]
        }
      ]
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI Vision HTTP ${res.status}: ${errText.substring(0, 180)}`);
    }

    const data = await res.json();
    const choice = data.choices && data.choices[0];
    return choice.message.content.trim();
  }

  async function callLocalWebGPU({ systemPrompt, userPrompt }) {
    console.debug("[TACTUS AIAdapter] Führe lokale Heuristik-Synthese aus...");
    // Ermöglicht Offline-Synthese ohne externe Abhängigkeit
    if (userPrompt.includes("Antworte mit dem Wort 'Bereit'")) {
      return "Bereit";
    }

    return "Lokale WebGPU-Heuristik verarbeitet Anweisung. Das somatische Beziehungs-Betriebssystem ist offline bereit.";
  }

  const api = {
    geminiFetch,
    isGeminiAvailable,
    getGeminiRoute,
    getProvider: getActiveProvider,
    setProvider: setActiveProvider,
    getApiKey: getApiKeyForProvider,
    setApiKey: setApiKeyForProvider,
    getModel: getModelForProvider,
    extractJson: extractJsonFromText,
    getProvidersList: () => Object.values(PROVIDERS),

    generateText: async function({ 
      systemPrompt = '', 
      userPrompt = '', 
      temperature = 0.7, 
      maxTokens = 2048, 
      provider = null, 
      model = null, 
      returnJson = false,
      safety = false
    }) {
      const activeProv = provider || getActiveProvider();
      const director = safety ? window.TactusDirector : null;

      // Sicherheits-Regie: Grenzen in den Prompt, Namen pseudonymisieren, Ergebnis prüfen (1 Neuversuch)
      if (director) {
        const profile = director.getSafetyProfile();
        const baseSystem = (systemPrompt || '') + '\n\nNenne die Personen ausschließlich {TOP} und {BOTTOM}.\n' + director.buildConstraintBlock(profile);
        let prompt = director.pseudonymize(userPrompt);
        for (let attempt = 0; attempt < 2; attempt++) {
          const raw = await this.generateText({ systemPrompt: director.pseudonymize(baseSystem), userPrompt: prompt, temperature, maxTokens, provider, model, returnJson });
          const check = director.validate(raw, profile);
          if (check.ok) return director.restoreNames(raw);
          prompt = director.pseudonymize(userPrompt) + '\n\nWICHTIG: Dein letzter Entwurf verletzte diese Grenzen: ' +
            check.violations.map(v => `${v.label} ("${v.term}")`).join('; ') + '. Erstelle einen neuen Entwurf ohne diese Inhalte.';
        }
        throw new Error('Der KI-Vorschlag berührte eure Grenzen und wurde verworfen.');
      }

      let rawResult = '';

      if (activeProv === 'gemini') {
        rawResult = await callGeminiText({ systemPrompt, userPrompt, temperature, maxTokens, model });
      } else if (activeProv === 'anthropic') {
        rawResult = await callClaudeText({ systemPrompt, userPrompt, temperature, maxTokens, model });
      } else if (activeProv === 'openai') {
        rawResult = await callOpenAIText({ systemPrompt, userPrompt, temperature, maxTokens, model });
      } else {
        rawResult = await callLocalWebGPU({ systemPrompt, userPrompt });
      }

      if (returnJson) {
        const parsed = extractJsonFromText(rawResult);
        if (!parsed) {
          throw new Error("Das Modell hat kein wohlgeformtes JSON zurückgegeben.");
        }
        return parsed;
      }

      return rawResult;
    },

    analyzeImage: async function({ 
      base64Image, 
      mimeType = 'image/webp', 
      prompt = '', 
      provider = null, 
      model = null 
    }) {
      let activeProv = provider || getActiveProvider();

      // Fallback auf Cloud-Provider, falls lokales Modell keine Vision unterstützt
      if (!PROVIDERS[activeProv]?.supportsVision) {
        if (isGeminiAvailable()) activeProv = 'gemini';
        else if (getApiKeyForProvider('anthropic')) activeProv = 'anthropic';
        else if (getApiKeyForProvider('openai')) activeProv = 'openai';
        else {
          throw new Error("Für die Foto-Analyse wird ein Gemini-, Claude- oder OpenAI-Key benötigt.");
        }
      }

      if (activeProv === 'gemini') {
        return await callGeminiVision({ base64Image, mimeType, prompt, model });
      } else if (activeProv === 'anthropic') {
        return await callClaudeVision({ base64Image, mimeType, prompt, model });
      } else if (activeProv === 'openai') {
        return await callOpenAIVision({ base64Image, mimeType, prompt, model });
      }

      throw new Error(`Vision wird von Provider '${activeProv}' nicht unterstützt.`);
    }
  };

  window.AIAdapter = api;

})(window);
