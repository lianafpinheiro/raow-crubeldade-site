import React, { useState } from 'react';

// ── PALETTE ───────────────────────────────────────────────────────────────────
const P = {
  bg:        '#0F0E0C',
  paper:     '#EDE8DF',
  carvoal:   '#111110',
  ossol:     '#E0D8C8',
  ouro:      '#9A7228',
  ouroV:     '#C4A253',
  ouroL:     '#D4B878',
  prata:     '#7A7A6A',
  ardosia:   '#2A2D30',
  azul:      '#0D1F3A',
  azulV:     '#162D54',
  mineral:   '#F0EDE6',
  border:    '#252318',
  borderL:   '#C8BEA4',
};

// ── CROWN — geometric origami crown (the core mark) ───────────────────────────
function CrownSVG({ color = P.ouroV, stroke = 1.8 }) {
  // viewBox 0 0 84 60
  return (
    <>
      {/* outer silhouette */}
      <path
        d="M6 56 L6 44 L18 24 L28 40 L42 6 L56 40 L66 24 L78 44 L78 56 Z"
        stroke={color} strokeWidth={stroke} strokeLinejoin="round" fill="none"
      />
      {/* origami facets — left spike */}
      <line x1="18" y1="24" x2="28" y2="52" stroke={color} strokeWidth={stroke * 0.6} opacity="0.7" />
      <line x1="6"  y1="44" x2="28" y2="52" stroke={color} strokeWidth={stroke * 0.5} opacity="0.45" />
      {/* center spike */}
      <line x1="42" y1="6"  x2="32" y2="52" stroke={color} strokeWidth={stroke * 0.55} opacity="0.62" />
      <line x1="42" y1="6"  x2="52" y2="52" stroke={color} strokeWidth={stroke * 0.55} opacity="0.62" />
      <line x1="28" y1="40" x2="42" y2="50" stroke={color} strokeWidth={stroke * 0.45} opacity="0.4" />
      <line x1="56" y1="40" x2="42" y2="50" stroke={color} strokeWidth={stroke * 0.45} opacity="0.4" />
      {/* right spike */}
      <line x1="66" y1="24" x2="56" y2="52" stroke={color} strokeWidth={stroke * 0.6} opacity="0.7" />
      <line x1="78" y1="44" x2="56" y2="52" stroke={color} strokeWidth={stroke * 0.5} opacity="0.45" />
      {/* base */}
      <line x1="6" y1="56" x2="78" y2="56" stroke={color} strokeWidth={stroke} />
      {/* bottom diamond ornament */}
      <path d="M38 60 L42 65 L46 60 L42 56 Z" fill={color} opacity="0.55" />
    </>
  );
}

// ── 01 PRIMARY MARK ───────────────────────────────────────────────────────────
function PrimaryMark({ size = 80, dark = false }) {
  const c = dark ? P.ouroV : P.ouro;
  const tc = dark ? P.carvoal : P.carvoal;
  const ratio = 160 / 120;
  return (
    <svg width={size} height={size * ratio} viewBox="0 0 120 160" fill="none">
      <g transform="translate(18, 4) scale(1)">
        <CrownSVG color={c} stroke={1.8} />
      </g>
      <text x="60" y="94" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" letterSpacing="5" fill={tc} opacity="0.55">THE</text>
      <text x="60" y="112" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" letterSpacing="7" fill={tc}>GODLESS</text>
      <text x="60" y="130" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" letterSpacing="7" fill={tc}>CROWN</text>
      <line x1="28" y1="139" x2="92" y2="139" stroke={c} strokeWidth="0.7" opacity="0.45" />
      <circle cx="60" cy="145" r="1.5" fill={c} opacity="0.45" />
    </svg>
  );
}

// ── 03 SEAL ───────────────────────────────────────────────────────────────────
function SealMark({ size = 80, dark = true }) {
  const c = dark ? P.ouroV : P.ouro;
  const bg = dark ? P.carvoal : 'none';
  const text = "THE GODLESS CROWN · I TAKE. I WANT. I KEEP. I BURN. · ";
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" fill="none">
      <defs>
        <path id="seal-ring" d="M55,55 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
      </defs>
      {bg !== 'none' && <circle cx="55" cy="55" r="52" fill={bg} />}
      <circle cx="55" cy="55" r="50" stroke={c} strokeWidth="1" />
      <circle cx="55" cy="55" r="44" stroke={c} strokeWidth="0.5" opacity="0.4" />
      <text fontSize="5.6" fill={c} letterSpacing="1.8" fontFamily="Georgia,serif">
        <textPath href="#seal-ring">{text}</textPath>
      </text>
      <g transform="translate(18,22) scale(0.68)">
        <CrownSVG color={c} stroke={2} />
      </g>
    </svg>
  );
}

// ── 10 ARCH BADGE ─────────────────────────────────────────────────────────────
function ArchBadgeMark({ size = 80, dark = true }) {
  const c = dark ? P.ouroV : P.ouro;
  const bg = dark ? '#080808' : 'none';
  return (
    <svg width={size} height={size * 1.22} viewBox="0 0 100 122" fill="none">
      {bg !== 'none' && <path d="M4 22 Q4 4 50 4 Q96 4 96 22 L96 80 Q96 114 50 118 Q4 114 4 80 Z" fill={bg} />}
      <path d="M4 22 Q4 4 50 4 Q96 4 96 22 L96 80 Q96 114 50 118 Q4 114 4 80 Z" stroke={c} strokeWidth="1.5" />
      <path d="M11 23 Q11 12 50 12 Q89 12 89 23 L89 79 Q89 106 50 110 Q11 106 11 79 Z" stroke={c} strokeWidth="0.5" opacity="0.35" />
      {/* star top */}
      <path d="M50 6 L51.5 10 L50 9 L48.5 10 Z" fill={c} opacity="0.75" />
      {/* crown */}
      <g transform="translate(16,28) scale(0.68)">
        <CrownSVG color={c} stroke={2.2} />
      </g>
      <text x="50" y="94"  textAnchor="middle" fontFamily="Georgia,serif" fontSize="7"   letterSpacing="3"   fill={c} opacity="0.5">THE</text>
      <text x="50" y="104" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9.5" letterSpacing="3.5" fill={c}>GODLESS</text>
      <text x="50" y="114" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9.5" letterSpacing="3.5" fill={c}>CROWN</text>
    </svg>
  );
}

// ── 14 MANTRA CIRCLE ──────────────────────────────────────────────────────────
function MantraCircleMark({ size = 80, dark = true }) {
  const c = dark ? P.ouroV : P.ouro;
  const text = "I TAKE. I WANT. I KEEP. I BURN. · ";
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" fill="none">
      <defs>
        <path id="mc-ring" d="M55,55 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
      </defs>
      <circle cx="55" cy="55" r="44" stroke={c} strokeWidth="0.7" opacity="0.3" />
      <circle cx="55" cy="55" r="34" stroke={c} strokeWidth="0.4" opacity="0.18" />
      <text fontSize="6.5" fill={c} letterSpacing="3.2" fontFamily="Georgia,serif">
        <textPath href="#mc-ring">{text}{text}</textPath>
      </text>
      <g transform="translate(20,24) scale(0.64)">
        <CrownSVG color={c} stroke={2} />
      </g>
    </svg>
  );
}

// ── 20 MINIMAL ICON ───────────────────────────────────────────────────────────
function MinimalIconMark({ size = 80, dark = false }) {
  const c = dark ? P.ouroV : P.ouro;
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 84 76" fill="none">
      <CrownSVG color={c} stroke={2} />
      {/* crescent moon below */}
      <path d="M36 67 Q42 62 48 67 Q42 74 36 67 Z" stroke={c} strokeWidth="1" fill="none" opacity="0.7" />
    </svg>
  );
}

// ── 16 NIGHT SEAL ─────────────────────────────────────────────────────────────
function NightSealMark({ size = 80, dark = true }) {
  const c = dark ? P.ouroV : P.ouro;
  const bg = dark ? '#08080A' : 'none';
  return (
    <svg width={size} height={size * 0.76} viewBox="0 0 110 84" fill="none">
      {bg !== 'none' && <ellipse cx="55" cy="42" rx="52" ry="38" fill={bg} />}
      <ellipse cx="55" cy="42" rx="52" ry="38" stroke={c} strokeWidth="1.2" />
      <ellipse cx="55" cy="42" rx="46" ry="32" stroke={c} strokeWidth="0.5" opacity="0.35" />
      {/* moon top-left */}
      <path d="M22 22 Q30 17 27 26 Q19 25 22 22 Z" fill={c} opacity="0.6" />
      <circle cx="88" cy="18" r="1.1" fill={c} opacity="0.45" />
      {/* crown */}
      <g transform="translate(20,10) scale(0.64)">
        <CrownSVG color={c} stroke={2} />
      </g>
      <text x="55" y="68" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="4" fill={c}>GODLESS CROWN</text>
    </svg>
  );
}

// ── 17 TYPO LOCKUP ────────────────────────────────────────────────────────────
function TypoLockupMark({ size = 120, dark = true }) {
  const tc = dark ? P.ossol : P.carvoal;
  const ac = dark ? P.ouroV : P.ouro;
  return (
    <svg width={size} height={size * 0.68} viewBox="0 0 200 136" fill="none">
      <line x1="18" y1="16" x2="88" y2="16" stroke={ac} strokeWidth="0.7" opacity="0.45" />
      <line x1="112" y1="16" x2="182" y2="16" stroke={ac} strokeWidth="0.7" opacity="0.45" />
      <text x="100" y="13" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill={ac} opacity="0.55">THE</text>
      <text x="100" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="33" letterSpacing="5" fill={tc}>GODLESS</text>
      <text x="100" y="88" textAnchor="middle" fontFamily="Georgia,serif" fontSize="33" letterSpacing="5" fill={tc}>CROWN</text>
      <line x1="18" y1="100" x2="182" y2="100" stroke={ac} strokeWidth="0.7" opacity="0.45" />
      <text x="100" y="114" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="4" fill={ac} opacity="0.65">I TAKE. I WANT. I KEEP. I BURN.</text>
      <circle cx="100" cy="124" r="1.5" fill={ac} opacity="0.35" />
    </svg>
  );
}

// ── 06 BADGE ─────────────────────────────────────────────────────────────────
function BadgeMark({ size = 80, dark = true }) {
  const c = dark ? P.ouroV : P.ouro;
  const bg = dark ? P.carvoal : 'none';
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" fill="none">
      {bg !== 'none' && <circle cx="55" cy="55" r="52" fill={bg} />}
      <circle cx="55" cy="55" r="52" stroke={c} strokeWidth="1.5" />
      <circle cx="55" cy="55" r="46" stroke={c} strokeWidth="0.5" opacity="0.35" />
      <g transform="translate(18,14) scale(0.7)">
        <CrownSVG color={c} stroke={2} />
      </g>
      <text x="55" y="82" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2.5" fill={c}>THE GODLESS</text>
      <text x="55" y="93" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2.5" fill={c}>CROWN</text>
    </svg>
  );
}

// ── MARKS REGISTRY ────────────────────────────────────────────────────────────
const marks = [
  {
    id: 'primary', code: '01', name: 'PRIMARY MARK', sub: 'Símbolo Soberano Oficial',
    Mark: PrimaryMark, bg: P.paper, dark: false,
    uses: ['Capa do baralho', 'Capa do livro (Book of the Godless Crown)', 'Poster editorial A2/A3', 'Assinatura institucional', 'Certificado de autenticidade'],
    rules: ['Nunca distorcer proporções', 'Espaço de respiro = 1× o próprio símbolo em todos os lados', 'Não combinar com outros marks no mesmo plano visual', 'Versão escura (ouro em carvão) e clara (ouro queimado em osso) aprovadas'],
    never: ['avatar', 'favicon', 'elemento decorativo repetido', 'junto ao SEAL no mesmo layout'],
  },
  {
    id: 'seal', code: '03', name: 'SEAL', sub: 'Certificação Ritual & Editorial',
    Mark: SealMark, bg: P.carvoal, dark: true,
    uses: ['Verso das cartas de tarot', 'Selo de autenticidade impresso', 'Canto de vídeo / opening animation', 'Watermark editorial em PDFs', 'Moeda ou medalhão comemorativo'],
    rules: ['Sempre circular — nunca clipado ou em oval', 'Texto do mantra completo e na ordem correta', 'Mínimo 32px digital / 12mm impresso', 'Versão dourada em fundo escuro; prata oxidada em fundo claro'],
    never: ['logotipo principal', 'capa sem o PRIMARY MARK', 'distorcido em formato oval ou quadrado'],
  },
  {
    id: 'arch', code: '10', name: 'ARCH BADGE', sub: 'Protocolo de Interface & Ordem Ritual',
    Mark: ArchBadgeMark, bg: P.ardosia, dark: true,
    uses: ['App icon (iOS/Android)', 'TikTok avatar', 'Favicon 32–64px', 'Pin físico / enamel pin', 'Elemento de interface: header, loading screen'],
    rules: ['Único mark aprovado para uso como ícone de app', 'Fundo padrão: carvão ou ardósia', 'Versão monocromática para bordado e gravação', 'Nunca usar sem o arco completo'],
    never: ['impresso > A5', 'sobreposto ao PRIMARY MARK', 'sem fundo — sempre com shape próprio'],
  },
  {
    id: 'mantra', code: '14', name: 'MANTRA CIRCLE', sub: 'Encantamento · Protocolo Verbal · Sigilo',
    Mark: MantraCircleMark, bg: P.bg, dark: true,
    uses: ['Verso das cartas de tarot (versão circular)', 'Ritual de abertura / fechamento de sessão', 'Intro/outro de vídeo', 'Página interna do livro', 'Arte de tatuagem'],
    rules: ['Mantra fixo e inviolável: I TAKE · I WANT · I KEEP · I BURN', 'Nunca alterar ordem ou palavras', 'Sempre em formato circular — nunca em linha reta', 'Mínimo 60px / 20mm'],
    never: ['como logotipo principal', 'sem o texto completo', 'com mantra diferente ou traduzido'],
  },
  {
    id: 'badge', code: '06', name: 'BADGE', sub: 'Lacre · Bordado · Merch',
    Mark: BadgeMark, bg: P.carvoal, dark: true,
    uses: ['Lacre de embalagem do baralho', 'Bordado em vestuário/merch', 'Certificado impresso circular', 'Coaster / porta-copo', 'QR code frame circular'],
    rules: ['Sempre circular perfeito', 'Texto em duas linhas: THE GODLESS / CROWN', 'Versão bordado: apenas contornos, sem preenchimento'],
    never: ['como avatar de app (usar ARCH BADGE)', 'clipado ou cortado', 'fundo colorido fora da paleta'],
  },
  {
    id: 'night', code: '16', name: 'NIGHT SEAL', sub: 'Protocolo Noturno · Edições Especiais',
    Mark: NightSealMark, bg: P.carvoal, dark: true,
    uses: ['Edição especial do baralho (versão lua)', 'Capa de booklet interno', 'Sticker premium', 'Canto de stories / reels'],
    rules: ['Exclusivo para aplicações premium e edições limitadas', 'Formato oval — nunca circular nem retangular', 'Lua sempre no canto superior esquerdo'],
    never: ['uso cotidiano de redes sociais', 'substituto do SEAL canônico', 'redimensionado fora do formato oval'],
  },
  {
    id: 'typo', code: '17', name: 'TYPO LOCKUP', sub: 'Capa · Livro · Poster Editorial',
    Mark: TypoLockupMark, bg: P.bg, dark: true,
    uses: ['Capa do livro "Book of the Godless Crown"', 'Espinha de livro', 'Poster editorial A3/A2', 'Slide de apresentação', 'Manchete de site'],
    rules: ['Sempre serifa — Georgia ou Cormorant Garamond', 'Tracking mínimo 5px entre letras em "GODLESS CROWN"', '"I TAKE. I WANT. I KEEP. I BURN." sempre presente abaixo', 'Nunca Bold — peso Regular/Light com tracking extremo'],
    never: ['fonte sans-serif', 'sem tracking', 'sem o mantra abaixo', 'com texto adicional no mesmo bloco'],
  },
  {
    id: 'minimal', code: '20', name: 'MINIMAL ICON', sub: 'Favicon · Notificação · Símbolo Mínimo',
    Mark: MinimalIconMark, bg: P.paper, dark: false,
    uses: ['Favicon 16–32px', 'Ícone de notificação push', 'Shortcut / atalho de app', 'Embossed em capa de caderno'],
    rules: ['Usar apenas quando o ARCH BADGE é grande demais para o contexto', 'Proporção coroa/lua deve ser mantida', 'Nunca colorir a lua de dourado — sempre tom neutro ou prata'],
    never: ['impresso grande', 'capa', 'poster', 'avatar de rede social'],
  },
];

// ── PALETTE ───────────────────────────────────────────────────────────────────
const palette = [
  { name: 'Preto Carvão',     hex: '#111110', role: 'Fundo soberano. Nunca substituir por preto puro.' },
  { name: 'Osso',             hex: '#E0D8C8', role: 'Texto em fundo escuro. Mais quente que branco.' },
  { name: 'Dourado Queimado', hex: '#9A7228', role: 'Estrutura, linhas, ornamento base.' },
  { name: 'Dourado Vivo',     hex: '#C4A253', role: 'Destaque, hover, momento de luz.' },
  { name: 'Dourado Claro',    hex: '#D4B878', role: 'Gradiente de hover. Nunca cor principal.' },
  { name: 'Ardósia',          hex: '#2A2D30', role: 'Fundo do ARCH BADGE. Alternativa ao carvão.' },
  { name: 'Azul Cirúrgico',   hex: '#0D1F3A', role: 'Ruptura da expectativa. Usar com contenção.' },
  { name: 'Branco Mineral',   hex: '#F0EDE6', role: 'Fundo impresso. Nunca branco puro #FFF.' },
];

// ── HIERARCHY ─────────────────────────────────────────────────────────────────
const hierarchy = [
  { mark: '01 PRIMARY MARK',   context: 'Apresentação institucional soberana', scale: 'Grande',  freq: 'Raro · máximo impacto' },
  { mark: '03 SEAL',           context: 'Autenticação editorial e ritual',      scale: 'Médio',  freq: 'Moderado' },
  { mark: '06 BADGE',          context: 'Lacre, merch, bordado',                scale: 'Médio',  freq: 'Contextual' },
  { mark: '10 ARCH BADGE',     context: 'Interface digital, app, protocolo',    scale: 'Pequeno',freq: 'Frequente · digital' },
  { mark: '14 MANTRA CIRCLE',  context: 'Cartas, rito, encantamento verbal',    scale: 'Médio',  freq: 'Contextual ritual' },
  { mark: '16 NIGHT SEAL',     context: 'Edições limitadas e especiais',        scale: 'Médio',  freq: 'Raro · premium' },
  { mark: '17 TYPO LOCKUP',    context: 'Capa, livro, manchete',                scale: 'Grande', freq: 'Editorial' },
  { mark: '20 MINIMAL ICON',   context: 'Favicon, notificação, mínimo',         scale: 'Mínimo', freq: 'Funcional' },
];

// ── SWATCH ────────────────────────────────────────────────────────────────────
function Swatch({ color }) {
  const [hover, setHover] = useState(false);
  const isLight = ['#E0D8C8','#D4B878','#F0EDE6'].includes(color.hex);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: color.hex, borderRadius: 3, padding: '13px 11px',
      border: `1px solid ${hover ? P.ouroV : (isLight ? P.borderL : P.border)}`,
      minHeight: 82, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      cursor: 'default', transition: 'border-color 0.2s',
    }}>
      <div style={{ fontSize: 8.5, color: isLight ? '#1A1812' : `${P.ossol}77`, fontFamily: 'monospace', letterSpacing: 1 }}>{color.hex.toUpperCase()}</div>
      <div>
        <div style={{ fontSize: 9.5, color: isLight ? P.ouro : P.ouroV, fontWeight: 600, letterSpacing: 0.8, marginBottom: 2 }}>{color.name.toUpperCase()}</div>
        <div style={{ fontSize: 8, color: isLight ? '#3A3220' : `${P.ossol}66`, lineHeight: 1.5 }}>{color.role}</div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function SistemaHeraldico() {
  const [active, setActive] = useState('primary');
  const sel = marks.find(m => m.id === active);

  return (
    <div style={{ background: P.bg, minHeight: '100vh', color: P.ossol, fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${P.border}`, padding: '26px 40px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 7.5, letterSpacing: 5, color: P.prata, marginBottom: 8 }}>THE GODLESS CROWN · POEMS OF A BLASPHEMOUS RITE · BY LILLY TH</div>
          <div style={{ fontSize: 22, letterSpacing: 6, color: P.ouroV, marginBottom: 4 }}>SISTEMA HERÁLDICO</div>
          <div style={{ fontSize: 9.5, letterSpacing: 3, color: P.prata }}>OPERACIONAL · v1.0 · CONGELADO</div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div style={{ fontSize: 7.5, color: '#4CAF50', letterSpacing: 2, border: '1px solid #4CAF5044', padding: '4px 10px', borderRadius: 2 }}>● CANONIZADO</div>
          <div style={{ fontSize: 7.5, color: `${P.prata}88`, letterSpacing: 1 }}>NENHUM MARK NOVO A PARTIR DESTE PONTO</div>
        </div>
      </div>

      <div style={{ padding: '34px 40px', maxWidth: 1280, margin: '0 auto' }}>

        {/* Doctrine */}
        <div style={{ background: '#0D0B07', border: `1px solid ${P.ouro}44`, borderLeft: `3px solid ${P.ouro}`, borderRadius: 3, padding: '13px 18px', marginBottom: 38 }}>
          <div style={{ fontSize: 7.5, letterSpacing: 3, color: P.ouro, marginBottom: 7 }}>DOUTRINA DE USO</div>
          <div style={{ fontSize: 11, color: `${P.ossol}99`, lineHeight: 2 }}>
            Se tudo usa tudo o tempo inteiro, vira Etsy dark.<br />
            Se cada símbolo tem hierarquia ritual, vira universo autoral sério.<br />
            <span style={{ color: P.ouroV }}>Este documento é lei. A disciplina visual é o rito.</span>
          </div>
        </div>

        {/* Mark explorer */}
        <div style={{ display: 'grid', gridTemplateColumns: '252px 1fr', gap: 26, marginBottom: 54 }}>
          {/* Sidebar */}
          <div>
            <div style={{ fontSize: 7.5, letterSpacing: 3, color: P.prata, marginBottom: 13 }}>MARKS CANONIZADOS</div>
            {marks.map(m => (
              <button key={m.id} onClick={() => setActive(m.id)} style={{
                width: '100%', background: active === m.id ? '#1A1810' : 'transparent',
                border: `1px solid ${active === m.id ? P.ouro : P.border}`,
                borderRadius: 3, padding: '10px 13px', marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.18s',
              }}>
                <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <m.Mark size={30} dark={active === m.id} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 7, letterSpacing: 2, color: active === m.id ? P.ouroV : P.prata }}>{m.code}</div>
                  <div style={{ fontSize: 9.5, letterSpacing: 1.5, color: active === m.id ? P.ossol : `${P.ossol}55` }}>{m.name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {sel && (
            <div style={{ background: '#0D0C0A', border: `1px solid ${P.border}`, borderRadius: 5, padding: 26 }}>
              {/* Preview */}
              <div style={{
                background: sel.bg, borderRadius: 4, padding: '32px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 22, minHeight: 180,
              }}>
                <sel.Mark size={sel.id === 'typo' ? 240 : 140} dark={sel.dark} />
              </div>

              <div style={{ fontSize: 7, letterSpacing: 3, color: P.prata, marginBottom: 3 }}>{sel.code}</div>
              <div style={{ fontSize: 19, letterSpacing: 4, color: P.ouroV, marginBottom: 3 }}>{sel.name}</div>
              <div style={{ fontSize: 9.5, letterSpacing: 2, color: P.prata, marginBottom: 22 }}>{sel.sub}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 7, letterSpacing: 3, color: P.ouro, marginBottom: 9 }}>USOS APROVADOS</div>
                  {sel.uses.map((u, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5 }}>
                      <span style={{ color: P.ouroV, fontSize: 8, flexShrink: 0, marginTop: 2 }}>✦</span>
                      <span style={{ fontSize: 10, color: `${P.ossol}CC`, lineHeight: 1.65 }}>{u}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 7, letterSpacing: 3, color: P.ouro, marginBottom: 9 }}>REGRAS INVIOLÁVEIS</div>
                  {sel.rules.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5 }}>
                      <span style={{ color: P.prata, fontSize: 8, flexShrink: 0, marginTop: 2 }}>—</span>
                      <span style={{ fontSize: 10, color: `${P.ossol}99`, lineHeight: 1.65 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#150909', border: '1px solid #3A1515', borderRadius: 3, padding: '9px 13px' }}>
                <div style={{ fontSize: 7, letterSpacing: 3, color: '#AA2A2A', marginBottom: 7 }}>NUNCA</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {sel.never.map((n, i) => (
                    <span key={i} style={{ fontSize: 8, color: '#AA2A2A99', border: '1px solid #3A1515', padding: '3px 7px', borderRadius: 2, letterSpacing: 0.5 }}>{n}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hierarchy table */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 7.5, letterSpacing: 4, color: P.prata, marginBottom: 16 }}>TABELA DE HIERARQUIA RITUAL</div>
          <div style={{ border: `1px solid ${P.border}`, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 110px 200px', padding: '9px 20px', background: '#181610', borderBottom: `1px solid ${P.border}` }}>
              {['MARK','CONTEXTO CANÔNICO','ESCALA','FREQUÊNCIA'].map(h => (
                <div key={h} style={{ fontSize: 7, letterSpacing: 3, color: P.prata }}>{h}</div>
              ))}
            </div>
            {hierarchy.map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '200px 1fr 110px 200px',
                padding: '12px 20px', borderBottom: i < hierarchy.length - 1 ? `1px solid ${P.border}` : 'none',
                background: i % 2 === 0 ? '#0D0C0A' : 'transparent', alignItems: 'center',
              }}>
                <div style={{ fontSize: 9, letterSpacing: 1, color: P.ouroV }}>{row.mark}</div>
                <div style={{ fontSize: 10, color: `${P.ossol}77` }}>{row.context}</div>
                <div style={{ fontSize: 8.5, color: P.prata }}>{row.scale}</div>
                <div style={{ fontSize: 8.5, color: P.prata }}>{row.freq}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Palette */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 7.5, letterSpacing: 4, color: P.prata, marginBottom: 7 }}>PALETA OFICIAL</div>
          <div style={{ fontSize: 10, color: `${P.ossol}44`, marginBottom: 16 }}>Carvão · Osso · Dourado queimado · Prata oxidada · Ardósia · Azul cirúrgico · Branco mineral</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 9, marginBottom: 12 }}>
            {palette.map((c, i) => <Swatch key={i} color={c} />)}
          </div>
          <div style={{ padding: '11px 15px', background: '#070C16', border: `1px solid ${P.azulV}33`, borderRadius: 3 }}>
            <div style={{ fontSize: 7.5, letterSpacing: 3, color: P.azulV, marginBottom: 5 }}>NOTA — AZUL CIRÚRGICO #0D1F3A</div>
            <div style={{ fontSize: 10, color: `${P.ossol}55`, lineHeight: 1.8 }}>
              Rompe a expectativa gótica óbvia. Parece arquivo operacional, interface militar, cartografia cognitiva.
              Diferencia este universo do "dark feminine motivational content" que infesta a internet.
              Usar com contenção máxima: fundo exclusivo do ARCH BADGE e referências ao "LIVED." no lockup.
            </div>
          </div>
        </div>

        {/* Typography */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 7.5, letterSpacing: 4, color: P.prata, marginBottom: 16 }}>TIPOGRAFIA</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {[
              { role: 'Institucional · Titulação', font: 'Georgia / Cormorant Garamond', sample: 'THE GODLESS CROWN', sampleFs: 19, tracking: 'Extremo — mín. 6px', weight: 'Regular. Nunca Bold.' },
              { role: 'Corpo · Mensagem de carta', font: 'Georgia / Garamond', sample: 'Não escrevo para consolar.', sampleFs: 14, tracking: 'Natural — 0.5px', weight: 'Itálico para mensagens rituais.' },
              { role: 'Mantra · Protocolo verbal', font: 'Monospace / Courier', sample: 'I TAKE. I WANT. I KEEP. I BURN.', sampleFs: 10.5, tracking: '3–4px', weight: 'Regular. Nunca itálico.' },
              { role: 'UI · Labels de interface', font: 'System-ui / Inter', sample: 'JORNADA ATIVA', sampleFs: 12, tracking: 'Máximo — 5–7px', weight: 'Semibold. Caixa alta sempre.' },
            ].map((t, i) => (
              <div key={i} style={{ background: '#0D0C0A', border: `1px solid ${P.border}`, borderRadius: 3, padding: 16 }}>
                <div style={{ fontSize: 7, letterSpacing: 3, color: P.prata, marginBottom: 9 }}>{t.role.toUpperCase()}</div>
                <div style={{ fontFamily: t.font, fontSize: t.sampleFs, color: P.ouroV, marginBottom: 13, lineHeight: 1.5 }}>{t.sample}</div>
                <div style={{ fontSize: 8.5, color: `${P.ossol}44`, lineHeight: 1.9 }}>
                  <span style={{ color: `${P.ossol}2A` }}>FONTE: </span>{t.font}<br />
                  <span style={{ color: `${P.ossol}2A` }}>TRACKING: </span>{t.tracking}<br />
                  <span style={{ color: `${P.ossol}2A` }}>PESO: </span>{t.weight}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 7.5, color: `${P.prata}88`, letterSpacing: 1.5 }}>THE GODLESS CROWN · SISTEMA HERÁLDICO OPERACIONAL · v1.0 · BY LILLY TH</div>
          <div style={{ fontSize: 8.5, color: P.ouro, letterSpacing: 2 }}>I TAKE · I WANT · I KEEP · I BURN</div>
        </div>
      </div>
    </div>
  );
}
