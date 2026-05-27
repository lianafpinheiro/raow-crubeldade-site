import React, { useState } from 'react';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E8C96B';
const BG = '#0A0A0A';
const CARD_BG = '#111111';
const BORDER = '#2A2416';

const arcanos = [
  { num: 'I', name: 'O Mago', keywords: 'Vontade · Manifestação · Habilidade' },
  { num: 'II', name: 'A Sacerdotisa', keywords: 'Intuição · Mistério · Sabedoria' },
  { num: 'III', name: 'A Imperatriz', keywords: 'Abundância · Criação · Natureza' },
  { num: 'IV', name: 'O Imperador', keywords: 'Autoridade · Estrutura · Proteção' },
  { num: 'V', name: 'O Hierofante', keywords: 'Tradição · Espiritualidade · Guia' },
  { num: 'VI', name: 'Os Enamorados', keywords: 'União · Escolha · Alinhamento' },
  { num: 'VII', name: 'O Carro', keywords: 'Determinação · Controle · Vitória' },
  { num: 'VIII', name: 'A Força', keywords: 'Coragem · Autocontrole · Compaixão' },
  { num: 'IX', name: 'O Eremita', keywords: 'Introspecção · Solidão · Sabedoria' },
  { num: 'X', name: 'A Roda da Fortuna', keywords: 'Ciclos · Destino · Mudança' },
  { num: 'XI', name: 'A Justiça', keywords: 'Equilíbrio · Verdade · Responsabilidade' },
  { num: 'XII', name: 'O Enforcado', keywords: 'Pausa · Rendição · Nova Perspectiva' },
  { num: 'XIII', name: 'A Morte', keywords: 'Transformação · Fim · Renascimento' },
  { num: 'XIV', name: 'A Temperança', keywords: 'Equilíbrio · Paciência · Moderação' },
  { num: 'XV', name: 'O Diabo', keywords: 'Sombra · Apego · Liberação' },
  { num: 'XVI', name: 'A Torre', keywords: 'Ruptura · Libertação · Verdade' },
  { num: 'XVII', name: 'A Estrela', keywords: 'Esperança · Renovação · Fé' },
  { num: 'XVIII', name: 'A Lua', keywords: 'Ilusão · Inconsciente · Ciclos' },
  { num: 'XIX', name: 'O Sol', keywords: 'Alegria · Vitalidade · Clareza' },
  { num: 'XX', name: 'O Julgamento', keywords: 'Despertar · Chamado · Renascimento' },
  { num: 'XXI', name: 'O Mundo', keywords: 'Integração · Completude · Realização' },
  { num: 'XXII', name: 'O Louco', keywords: 'Início · Liberdade · Potencial' },
];

const cardMessages = {
  'A Força': {
    message: 'Sua força não é sobre dominar,\nmas sobre acolher.\nA verdadeira coragem é gentil.',
    questions: [
      'O que estou tentando controlar?',
      'Onde posso agir com mais confiança e suavidade?',
    ],
  },
  'A Justiça': {
    message: 'Cada escolha carrega um peso.\nA clareza vem quando você para de fugir\ne olha para o que realmente é.',
    questions: [
      'Que verdade preciso encarar hoje?',
      'Onde posso agir com mais equilíbrio?',
    ],
  },
  default: {
    message: 'Esta carta chama você para dentro.\nO que ela desperta em você\né exatamente o que precisa ser visto.',
    questions: [
      'O que esta energia reflete na minha vida agora?',
      'Que passo posso dar com mais consciência?',
    ],
  },
};

function getMsg(name) {
  return cardMessages[name] || cardMessages.default;
}

function StarSymbol({ size = 24, color = GOLD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 9.5L21 8L15 13L18 20.5L12 16L6 20.5L9 13L3 8L10.5 9.5L12 2Z" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

function MoonSunSymbol({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="30" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="38" stroke={GOLD} strokeWidth="0.8" strokeDasharray="4 3" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const r = Math.PI * deg / 180;
        const x1 = 50 + 38 * Math.cos(r);
        const y1 = 50 + 38 * Math.sin(r);
        const x2 = 50 + 46 * Math.cos(r);
        const y2 = 50 + 46 * Math.sin(r);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth="1" />;
      })}
      <path d="M50 25 L53 44 L50 48 L47 44 Z" stroke={GOLD} strokeWidth="1" fill="none" />
      <path d="M50 75 L53 56 L50 52 L47 56 Z" stroke={GOLD} strokeWidth="1" fill="none" />
      <path d="M25 50 L44 47 L48 50 L44 53 Z" stroke={GOLD} strokeWidth="1" fill="none" />
      <path d="M75 50 L56 47 L52 50 L56 53 Z" stroke={GOLD} strokeWidth="1" fill="none" />
      <path d="M45 22 Q50 35 55 22" stroke={GOLD} strokeWidth="1" fill="none" />
      <circle cx="50" cy="50" r="6" stroke={GOLD} strokeWidth="1.5" fill="none" />
      <path d="M46 50 Q50 45 54 50" stroke={GOLD} strokeWidth="1.2" fill={GOLD} opacity="0.6" />
    </svg>
  );
}

function CardArt({ card, size = 'sm' }) {
  const w = size === 'sm' ? 56 : size === 'md' ? 80 : 160;
  const h = size === 'sm' ? 80 : size === 'md' ? 112 : 220;
  return (
    <div style={{
      width: w, height: h, background: '#0D0B07',
      border: `1px solid ${GOLD}44`, borderRadius: 6,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 4, border: `0.5px solid ${GOLD}33`, borderRadius: 4 }} />
      <div style={{ color: GOLD, fontSize: size === 'lg' ? 11 : 8, letterSpacing: 2, opacity: 0.6, marginBottom: 4 }}>{card.num}</div>
      <StarSymbol size={size === 'lg' ? 28 : 18} />
      <div style={{ color: GOLD, fontSize: size === 'lg' ? 9 : 7, marginTop: 6, textAlign: 'center', padding: '0 4px', lineHeight: 1.4, letterSpacing: 0.5 }}>{card.name.toUpperCase()}</div>
    </div>
  );
}

// ── SCREEN 1: Splash ──────────────────────────────────────────────────────────
function SplashScreen({ onStart, onLogin }) {
  return (
    <div style={{ background: BG, minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `radial-gradient(ellipse at 50% 30%, #1A140633 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 0.08 }}>
        <div style={{ fontSize: 11, letterSpacing: 8, color: GOLD, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>LILLYTH FOR THE LIVED.</div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <MoonSunSymbol size={120} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontFamily: 'serif', fontSize: 40, letterSpacing: 8, color: GOLD, lineHeight: 1 }}>LILLYTH</div>
        <div style={{ fontSize: 12, letterSpacing: 6, color: `${GOLD}99`, marginTop: 6 }}>FOR THE LIVED.</div>
        <div style={{ width: 60, height: 0.5, background: GOLD, margin: '20px auto', opacity: 0.4 }} />
        <div style={{ fontSize: 11, letterSpacing: 3, color: `${GOLD}88`, marginBottom: 8 }}>JOURNALING SIMBÓLICO E IA INTUITIVA</div>
        <div style={{ fontSize: 13, color: `${GOLD}66`, lineHeight: 1.8, maxWidth: 220 }}>
          para navegar sua alma<br />e transformar sua história.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: i === 0 ? 20 : 6, height: 6, borderRadius: 3, background: i === 0 ? GOLD : `${GOLD}44` }} />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 280, marginTop: 24 }}>
        <button onClick={onStart} style={{
          width: '100%', padding: '16px', background: `linear-gradient(135deg, ${GOLD}, #A07830)`,
          border: 'none', borderRadius: 4, color: '#0A0A0A', fontSize: 13, fontWeight: 700,
          letterSpacing: 4, cursor: 'pointer', marginBottom: 16,
        }}>COMEÇAR</button>
        <button onClick={onLogin} style={{
          width: '100%', padding: '12px', background: 'transparent',
          border: 'none', color: `${GOLD}88`, fontSize: 12, letterSpacing: 3, cursor: 'pointer',
        }}>ENTRAR</button>
      </div>
    </div>
  );
}

// ── SCREEN 2: Home ────────────────────────────────────────────────────────────
function HomeScreen({ onCardDetail, onNewEntry }) {
  const activeCard = arcanos[10]; // A Justiça
  const actions = [
    { icon: '✦', label: 'ESCREVER', onClick: onNewEntry },
    { icon: '◈', label: 'TIRAGEM', onClick: () => onCardDetail(arcanos[Math.floor(Math.random() * arcanos.length)]) },
    { icon: '☽', label: 'REFLEXÃO', onClick: () => {} },
    { icon: '◎', label: 'RESPIRO', onClick: () => {} },
  ];
  const entries = [
    { icon: '✦', title: 'A Força que escolhi hoje', date: '18 de Mai · 08:42' },
    { icon: '◈', title: 'Sobre o ciclo que está terminando', date: '15 de Mai · 22:10' },
  ];

  return (
    <div style={{ background: BG, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StarSymbol size={22} />
        <div style={{ fontFamily: 'serif', fontSize: 16, letterSpacing: 5, color: GOLD }}>LILLYTH</div>
        <div style={{ color: `${GOLD}66`, fontSize: 18 }}>🔔</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 300, color: GOLD, letterSpacing: 1, marginBottom: 4 }}>BOM DIA, ALMA.</div>
          <div style={{ fontSize: 12, color: `${GOLD}66`, letterSpacing: 0.5 }}>Como você deseja se conectar hoje?</div>
        </div>

        {/* Action grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
          {actions.map(a => (
            <button key={a.label} onClick={a.onClick} style={{
              background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8,
              padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              cursor: 'pointer',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${GOLD}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, fontSize: 14 }}>{a.icon}</div>
              <div style={{ fontSize: 8, letterSpacing: 1.5, color: `${GOLD}88` }}>{a.label}</div>
            </button>
          ))}
        </div>

        {/* Active journey */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: `${GOLD}66`, marginBottom: 12 }}>JORNADA ATIVA</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <CardArt card={activeCard} size="md" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: `${GOLD}88`, letterSpacing: 1, marginBottom: 2 }}>{activeCard.num}</div>
              <div style={{ fontSize: 18, fontFamily: 'serif', color: GOLD, marginBottom: 4 }}>{activeCard.name.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: `${GOLD}77`, lineHeight: 1.6, marginBottom: 12 }}>Equilíbrio, verdade, responsabilidade.</div>
              <div style={{ fontSize: 11, color: `${GOLD}99`, fontStyle: 'italic', lineHeight: 1.5 }}>Qual escolha pede coragem e clareza hoje?</div>
            </div>
            <button onClick={() => onCardDetail(activeCard)} style={{ background: 'none', border: `1px solid ${GOLD}44`, borderRadius: '50%', width: 28, height: 28, color: GOLD, cursor: 'pointer', fontSize: 14 }}>→</button>
          </div>
        </div>

        {/* AI insight */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${GOLD}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <StarSymbol size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: `${GOLD}66`, marginBottom: 4 }}>INSIGHTS DA IA</div>
            <div style={{ fontSize: 11, color: `${GOLD}88`, lineHeight: 1.6, fontStyle: 'italic' }}>Percebo um padrão de autocrítica em seus registros. Que tal explorar mais gentileza como prática diária?</div>
          </div>
          <div style={{ color: `${GOLD}55`, fontSize: 16 }}>›</div>
        </div>

        {/* Recent entries */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: `${GOLD}66` }}>REGISTROS RECENTES</div>
          <div style={{ fontSize: 9, letterSpacing: 1, color: `${GOLD}44`, cursor: 'pointer' }}>VER TODOS</div>
        </div>
        {entries.map((e, i) => (
          <div key={i} onClick={onNewEntry} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${GOLD}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, fontSize: 13 }}>{e.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: `${GOLD}CC`, marginBottom: 2 }}>{e.title}</div>
              <div style={{ fontSize: 10, color: `${GOLD}55` }}>{e.date}</div>
            </div>
            <div style={{ color: `${GOLD}44`, fontSize: 14 }}>🔖</div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <BottomNav active="home" />
    </div>
  );
}

// ── SCREEN 3: Card Detail ─────────────────────────────────────────────────────
function CardDetailScreen({ card, onBack, onWrite }) {
  const msg = getMsg(card.name);
  return (
    <div style={{ background: BG, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 20 }}>←</button>
        <div />
        <div style={{ color: `${GOLD}55`, fontSize: 18 }}>🔖</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: `${GOLD}66`, marginBottom: 4 }}>{card.num}</div>
        <div style={{ fontFamily: 'serif', fontSize: 26, letterSpacing: 4, color: GOLD, marginBottom: 4 }}>{card.name.toUpperCase()}</div>

        {/* Large card art */}
        <div style={{ margin: '24px 0', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', background: `radial-gradient(circle, ${GOLD}0D 0%, transparent 70%)` }} />
          <CardArt card={card} size="lg" />
        </div>

        <div style={{ fontSize: 10, letterSpacing: 3, color: `${GOLD}88`, marginBottom: 24 }}>{card.keywords}</div>

        <div style={{ width: '100%', borderTop: `0.5px solid ${GOLD}22`, paddingTop: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: `${GOLD}55`, marginBottom: 12 }}>MENSAGEM</div>
          <div style={{ fontSize: 13, color: `${GOLD}BB`, lineHeight: 1.9, fontStyle: 'italic', whiteSpace: 'pre-line' }}>{msg.message}</div>
        </div>

        <div style={{ width: '100%', borderTop: `0.5px solid ${GOLD}22`, paddingTop: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: `${GOLD}55`, marginBottom: 12 }}>PERGUNTAS PARA REFLEXÃO</div>
          {msg.questions.map((q, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{ color: GOLD, fontSize: 10, marginTop: 3 }}>✦</span>
              <div style={{ fontSize: 12, color: `${GOLD}99`, lineHeight: 1.7 }}>{q}</div>
            </div>
          ))}
        </div>

        <button onClick={onWrite} style={{
          width: '100%', padding: '16px', background: `linear-gradient(135deg, ${GOLD}, #A07830)`,
          border: 'none', borderRadius: 4, color: '#0A0A0A', fontSize: 12, fontWeight: 700,
          letterSpacing: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          ESCREVER SOBRE <span style={{ fontSize: 16 }}>✏</span>
        </button>
      </div>
    </div>
  );
}

// ── SCREEN 4: New Entry ───────────────────────────────────────────────────────
function NewEntryScreen({ card, onBack }) {
  const [text, setText] = useState('');
  const [tag, setTag] = useState('EMOÇÃO');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const tags = ['EMOÇÃO', 'SITUAÇÃO', 'ESCOLHA', 'SONHO'];
  const selectedCard = card || arcanos[15]; // A Torre default

  const fakeInsights = [
    'Você carrega uma história que ainda não terminou de contar. Esta carta convida você a olhar para o que está pronto para ser liberado.',
    'Percebo uma tensão entre o que você sabe e o que ainda resiste em aceitar. Qual parte de você pede mais gentileza hoje?',
    'Esta energia pede presença, não perfeição. O que aconteceria se você simplesmente permitisse sentir sem resolver?',
  ];

  const handleInsight = () => {
    setLoading(true);
    setTimeout(() => {
      setInsight(fakeInsights[Math.floor(Math.random() * fakeInsights.length)]);
      setLoading(false);
    }, 1400);
  };

  return (
    <div style={{ background: BG, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 20 }}>←</button>
        <div style={{ fontSize: 11, letterSpacing: 4, color: GOLD }}>NOVO REGISTRO</div>
        <button style={{ background: 'none', border: `1px solid ${GOLD}44`, borderRadius: '50%', width: 28, height: 28, color: GOLD, cursor: 'pointer', fontSize: 14 }}>✓</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        {/* Card selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: `${GOLD}66`, marginBottom: 10 }}>ESCOLHA UMA CARTA OU TEMA</div>
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <CardArt card={selectedCard} size="sm" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: `${GOLD}66`, marginBottom: 2 }}>{selectedCard.num}</div>
              <div style={{ fontSize: 14, fontFamily: 'serif', color: GOLD }}>{selectedCard.name.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: `${GOLD}66`, marginTop: 2 }}>{selectedCard.keywords}</div>
            </div>
            <div style={{ color: `${GOLD}55`, fontSize: 16 }}>∨</div>
          </div>
        </div>

        {/* Tag selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: `${GOLD}66`, marginBottom: 10 }}>SOBRE O QUE DESEJA ESCREVER?</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <button key={t} onClick={() => setTag(t)} style={{
                padding: '6px 14px', borderRadius: 20, border: `1px solid ${tag === t ? GOLD : `${GOLD}33`}`,
                background: tag === t ? `${GOLD}22` : 'transparent',
                color: tag === t ? GOLD : `${GOLD}66`, fontSize: 10, letterSpacing: 1.5, cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Text area */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: `${GOLD}66`, marginBottom: 10 }}>ESCREVA LIVREMENTE</div>
          <div style={{ position: 'relative' }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="O que está vivo em você hoje?"
              style={{
                width: '100%', minHeight: 160, background: CARD_BG, border: `1px solid ${BORDER}`,
                borderRadius: 8, padding: 14, color: `${GOLD}CC`, fontSize: 13, lineHeight: 1.8,
                resize: 'none', outline: 'none', fontFamily: 'inherit',
                caretColor: GOLD,
              }}
            />
            <div style={{ position: 'absolute', bottom: 12, right: 12, opacity: 0.08 }}>
              <StarSymbol size={40} />
            </div>
          </div>
        </div>

        {/* Insight result */}
        {insight && (
          <div style={{ background: '#120F07', border: `1px solid ${GOLD}44`, borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: `${GOLD}66`, marginBottom: 8 }}>INSIGHT DA IA</div>
            <div style={{ fontSize: 12, color: `${GOLD}BB`, lineHeight: 1.8, fontStyle: 'italic' }}>{insight}</div>
          </div>
        )}

        {/* Toolbar */}
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 8px', marginBottom: 12, display: 'flex', justifyContent: 'space-around' }}>
          {[{ icon: '📎', label: 'ANEXAR' }, { icon: '◈', label: 'TIRAGEM' }, { icon: '🎙', label: 'VOZ' }, { icon: '✦', label: 'IA INTUITIVA' }].map(item => (
            <button key={item.label} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 7, letterSpacing: 1.5, color: `${GOLD}66` }}>{item.label}</span>
            </button>
          ))}
        </div>

        <button onClick={handleInsight} disabled={loading} style={{
          width: '100%', padding: '16px', background: loading ? `${GOLD}33` : `linear-gradient(135deg, ${GOLD}, #A07830)`,
          border: 'none', borderRadius: 4, color: loading ? GOLD : '#0A0A0A', fontSize: 12, fontWeight: 700,
          letterSpacing: 3, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.3s',
        }}>
          <StarSymbol size={16} color={loading ? GOLD : '#0A0A0A'} />
          {loading ? 'CONECTANDO...' : 'RECEBER INSIGHT DA IA'}
        </button>
      </div>
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ active }) {
  const items = [
    { id: 'home', icon: '✦', label: 'INÍCIO' },
    { id: 'jornal', icon: '📖', label: 'JORNAL' },
    { id: 'oraculo', icon: '◈', label: 'ORÁCULO' },
    { id: 'perfil', icon: '👤', label: 'PERFIL' },
  ];
  return (
    <div style={{ borderTop: `1px solid ${BORDER}`, background: BG, display: 'flex', padding: '10px 0 16px' }}>
      {items.map(item => (
        <div key={item.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <span style={{ fontSize: 18, opacity: active === item.id ? 1 : 0.35 }}>{item.icon}</span>
          <span style={{ fontSize: 8, letterSpacing: 1.5, color: active === item.id ? GOLD : `${GOLD}44` }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LillythApp() {
  const [screen, setScreen] = useState('splash');
  const [selectedCard, setSelectedCard] = useState(null);

  const goCard = (card) => { setSelectedCard(card); setScreen('card'); };
  const goEntry = () => setScreen('entry');

  return (
    <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      {/* Phone frame */}
      <div style={{
        width: 390, minHeight: 780, maxHeight: '90vh',
        background: BG, borderRadius: 40,
        border: `2px solid ${GOLD}33`,
        boxShadow: `0 0 60px ${GOLD}15, 0 0 120px #00000088`,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Status bar */}
        <div style={{ background: BG, padding: '14px 24px 0', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: `${GOLD}55` }}>9:41</span>
          <span style={{ fontSize: 11, color: `${GOLD}55` }}>◉◉◉</span>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {screen === 'splash' && <SplashScreen onStart={() => setScreen('home')} onLogin={() => setScreen('home')} />}
          {screen === 'home' && <HomeScreen onCardDetail={goCard} onNewEntry={goEntry} />}
          {screen === 'card' && <CardDetailScreen card={selectedCard} onBack={() => setScreen('home')} onWrite={goEntry} />}
          {screen === 'entry' && <NewEntryScreen card={selectedCard} onBack={() => setScreen(selectedCard ? 'card' : 'home')} />}
        </div>
      </div>
    </div>
  );
}
