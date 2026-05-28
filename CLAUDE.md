# CLAUDE.md - AI Assistant Guidelines

## Project Overview

This repository hosts **KALLYNI: A Canção do Céu Azul** - a dual-purpose project containing:
1. **Musical Composition Project**: Static HTML pages with orchestral music presentation and MIDI files
2. **React Birthday Invitation App**: Interactive animated video invitation for a quinceañera (15th birthday)

The project name "raow-crubeldade-site" appears to be a placeholder/codename, with the actual content focused on the KALLYNI theme.

## Repository Structure

```
raow-crubeldade-site/
├── .github/workflows/          # CI/CD configurations
├── src/                        # React application source
│   ├── components/            # React components
│   │   └── KallyniVideoConvite.jsx  # Main animated invitation
│   ├── App.jsx                # Root component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles with Tailwind
├── INDEX.HTML                 # Musical project landing page
├── KALLYNI-Suite-Completa.html  # Complete orchestral suite
├── index.html                 # React app HTML entry
├── package.json               # Node.js dependencies
├── vite.config.js             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── create_midi_simple.py      # MIDI generation script (Python)
├── parse_musicxml_measure.py  # MusicXML parser (Python)
├── test_kallyni_parser.py     # Python tests
├── KALLYNI-O_Ceu_Azul.mid     # MIDI audio file
├── KALLYNI-O_Ceu_Azul.musicxml  # Digital sheet music
└── KALLYNI-Infografico.md     # Infographic documentation
```

## Tech Stack

### React Application
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.9
- **Styling**: Tailwind CSS 3.4.14
- **Language**: JavaScript/JSX (ES6+)
- **Module System**: ES Modules (`"type": "module"`)

### Python Scripts
- **Version**: Python 3.10+ (configured in CI)
- **Purpose**: MIDI file generation and MusicXML parsing
- **Testing**: pytest
- **Linting**: flake8

### Static Pages
- **Technology**: HTML5, CSS3
- **Features**: Responsive design, gradients, HTML5 audio player

## Development Commands

### React Application
```bash
# Install dependencies
npm install

# Start development server (port 3000, auto-opens browser)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Python Scripts
```bash
# Generate MIDI file
python create_midi_simple.py

# Parse MusicXML
python parse_musicxml_measure.py

# Run tests
pytest test_kallyni_parser.py
```

## Code Conventions

### React/JavaScript
- **File Extensions**: `.jsx` for React components
- **Component Structure**: Functional components with hooks
- **State Management**: React hooks (`useState`, `useEffect`)
- **Styling**: Tailwind CSS utility classes with inline styles for complex animations
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Explicit React import (`import React from 'react'`)
- **Export Style**: Default exports for components

### Component Patterns
```jsx
// Standard component structure
import React, { useState, useEffect } from 'react';

const ComponentName = () => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### CSS/Styling
- **Approach**: Tailwind CSS utilities + custom CSS-in-JS for animations
- **Colors**: Custom color scheme with hex values (e.g., `#0B5B5E`, `#FFD700`)
- **Animations**: CSS keyframes defined in `<style>` tags within JSX
- **Responsive**: Mobile-first design (Stories format for invitation)

### Python
- **Style**: PEP 8 compliant (flake8 max line length: 127)
- **Documentation**: Docstrings with clear descriptions
- **Type Hints**: Not enforced but encouraged
- **Max Complexity**: 10 (flake8 configuration)

## Key Files to Understand

### `src/components/KallyniVideoConvite.jsx`
The main React component (~920 lines) implementing:
- 7 animated scenes with timed transitions
- Complex CSS keyframe animations (particles, explosions, floating effects)
- Interactive controls (play/pause, progress bar)
- WhatsApp integration for RSVP
- Event details hardcoded in Portuguese

### `create_midi_simple.py`
Custom MIDI file generator without external libraries:
- Writes raw MIDI binary format
- Implements variable-length encoding
- Orchestrates 6 tracks (Flauta, Oboé, Violino, Viola, Coro, Harpa)

### `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    open: true
  }
});
```

## Important Notes for AI Assistants

### Language
- **Primary Language**: Portuguese (Brazilian)
- All user-facing content (invitation text, musical themes) is in Portuguese
- Code comments and technical documentation are in English/Portuguese mix

### Event Details (Hardcoded in Invitation)
- **Event**: Kallyni's 15th Birthday (Quinceañera)
- **Date**: December 20, 2025
- **Time**: 7:30 PM (19h30)
- **Location**: Cantina Nostra, Rua 10 de Novembro
- **Contact**: +55 54 99638-1003

### Design System
- **Primary Color**: Teal/Cyan (#0B5B5E, #06373A, #1A7A7F)
- **Accent Color**: Gold (#FFD700, #D4AF37, #FFF8DC)
- **Typography**:
  - Decorative: "Brush Script MT" (cursive)
  - Formal: Georgia (serif)
  - System fonts for body text

### Animation Patterns
The project uses extensive CSS animations:
- `fadeIn`, `fadeInUp`, `fadeInSlow`
- `float`, `floatUpDown`, `fall`
- `pulse`, `finalPulse`
- `orbit`, `scaleRotate`
- `twinkle`, `shimmer`
- `explode`, `rayPulse`, `expandFade`

### No Build Artifacts
- `node_modules/` and `dist/` are gitignored
- Dependencies must be installed before development
- No lock file committed (`package-lock.json` is gitignored)

## CI/CD Pipeline

### Python Package Workflow (`.github/workflows/python-package-conda.yml`)
- **Trigger**: On every push
- **Environment**: Ubuntu, Python 3.10, Conda
- **Steps**: Install dependencies, lint with flake8, test with pytest
- **Note**: Requires `environment.yml` file (not currently in repo)

### SLSA Provenance (`.github/workflows/generator-generic-ossf-slsa3-publish.yml`)
- **Trigger**: On workflow dispatch or release creation
- **Purpose**: Generate SLSA Level 3 provenance for releases
- **Status**: Template configuration, needs customization for actual artifacts

## Common Tasks

### Adding New Animations
1. Define keyframes in the `<style>` tag within the component
2. Apply using Tailwind's `animate-` utilities or inline `style={{ animation: '...' }}`
3. Use custom CSS variables for dynamic values (`--angle`, `--distance`)

### Modifying Event Details
- Update hardcoded values in `src/components/KallyniVideoConvite.jsx`
- WhatsApp link in `handleWhatsAppRSVP()` function
- Date/time/location in Scene 5 (currentScene === 4)

### Adding New Scenes
1. Add duration to `sceneDurations` array
2. Add conditional render block (`currentScene === n`)
3. Include poetic text and animations matching the theme
4. Update scene counter display

### Python Script Modifications
- Follow existing patterns in `create_midi_simple.py`
- Use docstrings for documentation
- Run flake8 before committing
- Add tests in `test_kallyni_parser.py`

## Testing

### React Application
- No automated testing framework configured
- Manual testing via `npm run dev`
- Test on mobile viewports (Stories format: 375×812px)

### Python
```bash
# Run pytest
pytest test_kallyni_parser.py

# Run flake8 linting
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
```

## Security Considerations

- WhatsApp phone number exposed in source code
- No environment variables or secrets management
- Static site with no backend
- No user input validation needed (read-only UI)

## Deployment

Currently not configured for automatic deployment. Options:
- **Static HTML**: Serve directly from file system
- **React App**: Build with `npm run build`, deploy `dist/` folder
- **GitHub Pages**: Could be configured for static hosting

## Git Conventions

- Main branch for stable releases
- Feature branches for development
- Commit messages in English preferred
- No specific commit message format enforced

## Known Issues/TODOs

1. Python CI requires `environment.yml` file (not present)
2. No automated testing for React components
3. Lock file (`package-lock.json`) not committed
4. SLSA workflow uses placeholder artifacts
5. Some files have duplicate naming patterns (INDEX.HTML vs index.html)
