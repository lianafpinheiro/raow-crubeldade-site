/**
 * Literary Skins - AI Chat Backend
 * Vercel Serverless Function
 *
 * SETUP:
 * 1. Deploy to Vercel: `vercel`
 * 2. Add environment variable: GEMINI_API_KEY
 * 3. Update frontend API_ENDPOINT to match your domain
 *
 * SECURITY:
 * - API key stored in environment variables (never exposed to client)
 * - Rate limiting via Vercel edge config (optional)
 * - Input validation and sanitization
 * - CORS configured for your domain only
 */

// Configuration
const CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_MESSAGES_PER_MINUTE: 10,
  ALLOWED_ORIGINS: [
    'https://literaryskins.com',
    'https://www.literaryskins.com',
    'http://localhost:3000', // For local development
  ],
  GEMINI_MODEL: 'gemini-2.0-flash-exp',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',
};

// System instruction for the AI
const SYSTEM_INSTRUCTION = `
You are the sophisticated, high-tech AI interface for "Literary Skins".
You are pitching to top-tier investors.
Tone: Cyberpunk, Noir, Professional, Confident, slightly poetic.
Do NOT sound like a generic assistant. You are a partner.

KEY DATA POINTS TO USE:
- **ROI:** 7,900% projected in Year 1.
- **Initial Investment Ask:** $69,000 USD (Low barrier, high asymmetry).
- **Projected Revenue Year 1:** $5.45 Million USD.
- **Payback Period:** 3 Weeks.
- **Social Impact:** 108,000 children transformed in 24 months.
- **Core Philosophy:** "Diagnosis is not destiny." "Affect is the tool."
- **Science:**
  1. Neuroplasticity (Preminger 2012): Art induces long-term brain change.
  2. Brain-to-Brain Sync (Chabin 2022): Shared narrative couples brains.
  3. Cortisol Reduction through narrative engagement.
- **Product:** "ManusFix" platform + Physical tactile books.

BEHAVIOR:
- Keep answers concise (under 100 words unless asked for detail).
- Use markdown for emphasis: **bold** for key stats, *italic* for poetic elements.
- If asked about investment simulations, use the 7,900% (79x) multiplier.
- Emphasize both financial returns AND social impact.
- Never break character or mention you're an AI assistant.
- Be confident but not arrogant. Data-driven but human.
`;

/**
 * Main handler function
 */
export default async function handler(req, res) {
  // CORS headers
  const origin = req.headers.origin;
  if (CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Sanitize and validate input
    const sanitizedMessage = message.trim().substring(0, CONFIG.MAX_MESSAGE_LENGTH);

    if (!sanitizedMessage) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({
        error: 'Service configuration error',
        reply: '⚠️ Neural link temporarily offline. Please contact support.'
      });
    }

    // Call Gemini API
    const response = await fetch(
      `${CONFIG.GEMINI_API_URL}${CONFIG.GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: sanitizedMessage }]
          }],
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);

      return res.status(500).json({
        error: 'AI service error',
        reply: '⚠️ Neural processing overload. Please try again.'
      });
    }

    const data = await response.json();

    // Extract AI response
    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      console.error('Invalid Gemini response structure:', data);
      return res.status(500).json({
        error: 'Invalid AI response',
        reply: '⚠️ Neural interface unstable. Please rephrase your question.'
      });
    }

    // Return successful response
    return res.status(200).json({
      reply: aiReply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      reply: '⚠️ Connection severed. Please check network and try again.'
    });
  }
}

/**
 * Rate limiting helper (optional - requires Vercel KV or similar)
 *
 * Example with Vercel KV:
 *
 * import { kv } from '@vercel/kv';
 *
 * async function checkRateLimit(ip) {
 *   const key = `ratelimit:${ip}`;
 *   const count = await kv.incr(key);
 *
 *   if (count === 1) {
 *     await kv.expire(key, 60); // 60 seconds
 *   }
 *
 *   return count <= CONFIG.MAX_MESSAGES_PER_MINUTE;
 * }
 */
