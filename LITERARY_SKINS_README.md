# Literary Skins - One Slide Pitch (Enhanced)

> **7,900% ROI • 108k Lives • 3 Week Payback**

A cyberpunk-noir interactive pitch deck with AI-powered Q&A interface.

## 🎯 What's New in This Version

### ✅ Security Fixes
- ✨ **API key protected**: Moved to backend (no client-side exposure)
- 🛡️ **Input sanitization**: XSS prevention with HTML escaping
- 🔒 **Rate limiting**: 2-second cooldown between messages
- ✂️ **Input validation**: Max 500 characters, stripped of dangerous chars

### ✅ Accessibility Improvements
- ♿ **ARIA labels**: Full screen reader support
- ⌨️ **Keyboard navigation**: Tab, Enter, ESC shortcuts
- 🎯 **Focus management**: Proper focus trap in terminal
- 🔲 **Semantic HTML**: Proper roles and landmarks
- 👁️ **Better contrast**: WCAG AA compliant colors

### ✅ Mobile Optimization
- 📱 **Responsive layout**: Stacks vertically on mobile
- 👆 **Touch-friendly**: Larger tap targets
- 📏 **Text scaling**: Prevents overflow on small screens
- 🔄 **Terminal UX**: 85vh max height on mobile (doesn't cover entire screen)

### ✅ UX/UI Enhancements
- ⚡ **Better markdown**: Bold, italic, code blocks, links, line breaks
- ⏳ **Loading states**: Shimmer animation while AI responds
- 💬 **Smart cursor**: Typing cursor only on latest message
- 🎨 **Improved animations**: Smoother transitions
- 📜 **Auto-scroll**: Chat scrolls to bottom automatically

### ✅ SEO & Performance
- 🔍 **Meta tags**: Open Graph, Twitter Cards
- 🚀 **Font preconnect**: Faster Google Fonts loading
- 🧹 **Clean code**: Removed unused CSS (.v-line)
- 📊 **Better structure**: Organized JavaScript with comments

### ✅ Code Quality
- 📝 **Organized**: Configuration object, utility functions
- 🧪 **Testable**: Separated concerns (sanitize, validate, render)
- 💬 **Comments**: Clear documentation throughout
- 🎭 **Demo mode**: Works without backend (simulated responses)

---

## 🚀 Quick Start

### Option 1: Demo Mode (No Backend Required)

```bash
# Just open the HTML file in a browser
open literary-skins-pitch.html
```

The page includes simulated AI responses - perfect for pitching in person!

### Option 2: Live Mode with AI (Backend Required)

#### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Set up environment variable**
   ```bash
   vercel env add GEMINI_API_KEY
   # Paste your Gemini API key when prompted
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Update the HTML**
   - Open `literary-skins-pitch.html`
   - Find line ~220: `API_ENDPOINT: '/api/chat'`
   - Change to: `API_ENDPOINT: 'https://your-project.vercel.app/api/chat'`

5. **Test it**
   - Visit your deployed URL
   - Click "NEURO-LINK: STANDBY"
   - Ask: "Explain the 7,900% ROI"

#### Alternative: Netlify Functions

```bash
# Move api/ folder to netlify/functions/
mkdir -p netlify/functions
mv api/chat.js netlify/functions/

# Deploy
netlify deploy --prod
```

---

## 🎨 Customization

### Change Colors

```css
/* In <style> section */
.neon-cyan {
    color: #22d3ee; /* Change this */
}
```

### Modify AI Personality

```javascript
// In api/chat.js, line ~30
const SYSTEM_INSTRUCTION = `
  Your custom prompt here...
`;
```

### Add More Quick Questions

```html
<!-- In the HTML, around line ~340 -->
<button onclick="quickAsk('Your question here')">
    Your Label
</button>
```

### Adjust Data Points

```html
<!-- Update the numbers in the main content section -->
<div class="text-9xl font-bold neon-gold">7,900%</div>
<div class="text-3xl font-bold text-white">$69,000</div>
```

---

## 📊 Data Points Reference

| Metric | Value | Source |
|--------|-------|--------|
| **ROI (Year 1)** | 7,900% | Strategic Plan V2.0 |
| **Initial Ask** | $69,000 | Funding Requirements |
| **Projected Revenue (Y1)** | $5.45M | Financial Model |
| **Payback Period** | 3 Weeks | Cash Flow Analysis |
| **Social Impact** | 108,000 children | Reach Projections |
| **Scientific Citations** | 1,411+ | Meta-Analysis |
| **Core Studies** | Preminger 2012, Chabin 2022 | Neuroscience |

---

## 🔧 Technical Stack

- **Frontend**: Vanilla HTML/CSS/JS + Tailwind CSS
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI**: Google Gemini 2.0 Flash
- **Fonts**: Google Fonts (Playfair Display, JetBrains Mono)
- **Hosting**: Vercel / Netlify / Any static host

---

## 🐛 Troubleshooting

### AI not responding
1. Check if `GEMINI_API_KEY` is set in your environment
2. Open browser console (F12) for errors
3. Verify the `API_ENDPOINT` URL is correct
4. Check if backend is deployed and accessible

### Chat input not working
- Ensure JavaScript is enabled
- Try refreshing the page
- Check for browser console errors

### Mobile layout broken
- Clear browser cache
- Test on multiple devices/browsers
- Verify viewport meta tag is present

### Fonts not loading
- Check internet connection
- Verify Google Fonts CDN is accessible
- Consider self-hosting fonts (download from Google Fonts)

---

## 📈 Analytics (Optional)

Add tracking to measure engagement:

```html
<!-- Add to <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');

  // Track AI questions
  function sendMessage() {
    // ... existing code ...
    gtag('event', 'ai_question', {
      'event_category': 'engagement',
      'event_label': text
    });
  }
</script>
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google AI API key |
| `ALLOWED_ORIGINS` | No | Comma-separated list of allowed domains |
| `MAX_MESSAGES_PER_MINUTE` | No | Rate limit (default: 10) |

---

## 📝 Files Overview

```
literary-skins-pitch/
├── literary-skins-pitch.html  # Main pitch page (frontend)
├── api/
│   └── chat.js                # Backend API handler
├── LITERARY_SKINS_README.md   # This file
└── vercel.json                # (Optional) Vercel config
```

---

## 🎯 Future Enhancements

- [ ] Add PDF export functionality
- [ ] Email-to-investor feature
- [ ] Analytics dashboard
- [ ] A/B testing different metrics
- [ ] Multilingual support (Chinese version)
- [ ] Investor deck download
- [ ] Integration with CRM (HubSpot, Salesforce)
- [ ] Video background option
- [ ] Voice input for questions

---

## 📄 License

Confidential - Literary Skins Corp © 2025

---

## 🙋 Support

For questions or issues:
- **Email**: contact@literaryskins.com
- **GitHub**: Create an issue in this repo
- **Documentation**: See `/docs` folder

---

**诊断不是宿命** • *Diagnosis is not destiny*

Built with 🧠 by the Literary Skins team.
