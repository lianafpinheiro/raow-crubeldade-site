import React, { useState, useEffect } from 'react';

const SKSAM_CSS = `
  :root {
    --preto:    #0B0B0B;
    --carvao:   #141414;
    --grafite:  #1E1E1E;
    --onix:     #2A2A2A;
    --ouro:     #D4AF37;
    --ouro-dim: rgba(212,175,55,.55);
    --ouro-glow:rgba(212,175,55,.15);
    --osso:     #F2F0EB;
    --texto:    #C8C4BC;
    --branco:   #E8E4DC;
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--preto);
    color: var(--texto);
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--preto); }
  ::-webkit-scrollbar-thumb { background: var(--ouro-dim); }

  .cinzel { font-family: 'Cinzel', serif; }
  .gold   { color: var(--ouro); }
  .divider {
    width: 40px; height: 1px;
    background: var(--ouro-dim);
    display: block; margin: 0 auto;
  }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.4rem 3rem;
    transition: background .3s, backdrop-filter .3s;
  }
  nav.nav-scrolled {
    background: rgba(11,11,11,.92);
    backdrop-filter: blur(12px);
  }
  nav:not(.nav-scrolled) {
    background: linear-gradient(to bottom, rgba(11,11,11,.95) 0%, transparent 100%);
  }

  .nav-logo { display: flex; align-items: center; gap: .75rem; text-decoration: none; }
  .nav-badge { width: 36px; height: 36px; opacity: .85; }
  .nav-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .7rem; font-weight: 400;
    letter-spacing: .25em; text-transform: uppercase;
    color: var(--texto);
  }
  .nav-right { display: flex; align-items: center; gap: 2.5rem; }
  .nav-link {
    font-size: .65rem; letter-spacing: .25em; text-transform: uppercase;
    color: var(--texto); text-decoration: none; transition: color .25s;
  }
  .nav-link:hover { color: var(--ouro); }
  .nav-cta {
    font-size: .65rem; letter-spacing: .2em; text-transform: uppercase;
    color: var(--preto); background: var(--ouro);
    padding: .55rem 1.4rem; text-decoration: none;
    font-weight: 500; transition: background .25s;
  }
  .nav-cta:hover { background: #C9A227; }

  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center;
    position: relative; overflow: hidden; padding: 8rem 2rem 4rem;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,175,55,.04) 0%, transparent 70%),
      radial-gradient(ellipse 40% 80% at 20% 50%, rgba(30,30,30,.6) 0%, transparent 60%),
      radial-gradient(ellipse 40% 80% at 80% 50%, rgba(20,20,20,.6) 0%, transparent 60%);
    pointer-events: none;
  }

  .hero-presented {
    font-size: .65rem; letter-spacing: .4em; text-transform: uppercase;
    color: var(--ouro-dim); margin-bottom: 3rem;
  }

  .exhibit-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(4rem, 14vw, 11rem);
    font-weight: 700; line-height: 1; letter-spacing: .06em;
    color: var(--branco); margin-bottom: 2.5rem; position: relative;
  }
  .exhibit-title .letter { display: inline-block; }
  .exhibit-title .mirror { display: inline-block; transform: scaleX(-1); }

  .title-reflection {
    font-family: 'Cinzel', serif;
    font-size: clamp(4rem, 14vw, 11rem);
    font-weight: 700; line-height: 1; letter-spacing: .06em;
    color: transparent;
    background: linear-gradient(to bottom, rgba(212,175,55,.12) 0%, transparent 70%);
    -webkit-background-clip: text; background-clip: text;
    transform: scaleY(-1); filter: blur(2px);
    margin-top: -1rem; pointer-events: none; user-select: none;
  }

  .hero-rule {
    display: flex; align-items: center; gap: 1.5rem;
    margin: 2.5rem auto; max-width: 500px;
  }
  .hero-rule .line { flex: 1; height: 1px; background: var(--ouro-dim); }
  .hero-rule .diamond {
    width: 6px; height: 6px; background: var(--ouro);
    transform: rotate(45deg); flex-shrink: 0;
  }

  .hero-tagline {
    font-family: 'Cinzel', serif;
    font-size: clamp(.9rem, 2.5vw, 1.35rem);
    font-weight: 400; letter-spacing: .15em; text-transform: uppercase;
    color: var(--branco); line-height: 1.6; margin-bottom: 1rem;
  }
  .hero-sub {
    font-size: .75rem; letter-spacing: .3em; text-transform: uppercase;
    color: var(--texto); margin-bottom: 3.5rem;
  }
  .hero-meta {
    display: flex; flex-wrap: wrap; justify-content: center;
    gap: 0 2rem; font-size: .7rem; letter-spacing: .25em;
    text-transform: uppercase; color: var(--ouro);
  }
  .hero-meta span { position: relative; }
  .hero-meta span:not(:last-child)::after {
    content: '·'; position: absolute; right: -1.1rem; color: var(--ouro-dim);
  }
  .hero-cta-group {
    display: flex; gap: 1rem; margin-top: 3.5rem;
    flex-wrap: wrap; justify-content: center;
  }
  .btn-primary {
    font-size: .65rem; letter-spacing: .3em; text-transform: uppercase;
    color: var(--preto); background: var(--ouro); border: none;
    padding: .9rem 2.5rem; cursor: pointer; text-decoration: none;
    font-weight: 500; transition: background .25s, transform .15s; display: inline-block;
  }
  .btn-primary:hover { background: #C9A227; transform: translateY(-1px); }
  .btn-secondary {
    font-size: .65rem; letter-spacing: .3em; text-transform: uppercase;
    color: var(--ouro); background: transparent; border: 1px solid var(--ouro-dim);
    padding: .9rem 2.5rem; cursor: pointer; text-decoration: none;
    font-weight: 400; transition: border-color .25s, color .25s; display: inline-block;
  }
  .btn-secondary:hover { border-color: var(--ouro); color: var(--branco); }

  .scroll-cue {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: .5rem;
  }
  .scroll-cue span {
    font-size: .55rem; letter-spacing: .35em; text-transform: uppercase;
    color: var(--ouro-dim);
  }
  .scroll-cue-line {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, var(--ouro-dim), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse {
    0%,100% { opacity: .4; }
    50% { opacity: 1; }
  }

  .palette-strip { display: flex; height: 4px; }
  .palette-strip div { flex: 1; }

  .concept {
    padding: 8rem 2rem; max-width: 900px; margin: 0 auto; text-align: center;
  }
  .section-label {
    font-size: .6rem; letter-spacing: .45em; text-transform: uppercase;
    color: var(--ouro); margin-bottom: 2.5rem;
    display: flex; align-items: center; justify-content: center; gap: 1rem;
  }
  .section-label::before, .section-label::after {
    content: ''; display: block; width: 30px; height: 1px;
    background: var(--ouro-dim);
  }
  .concept-quote {
    font-family: 'Cinzel', serif;
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    font-weight: 400; line-height: 1.5; color: var(--branco);
    margin-bottom: 3rem; position: relative;
  }
  .concept-quote::before {
    content: '"'; position: absolute; top: -.5em; left: 50%;
    transform: translateX(-50%); font-size: 4em;
    color: var(--ouro-glow); font-family: 'Cinzel', serif; line-height: 1;
  }
  .concept-body { font-size: .9rem; line-height: 1.9; color: var(--texto); max-width: 640px; margin: 0 auto 3rem; }
  .concept-keywords {
    display: flex; flex-wrap: wrap; gap: .75rem;
    justify-content: center; margin-top: 2.5rem;
  }
  .keyword {
    font-size: .6rem; letter-spacing: .3em; text-transform: uppercase;
    color: var(--ouro-dim); border: 1px solid var(--onix); padding: .4rem 1rem;
  }

  .pillars { padding: 6rem 2rem; background: var(--carvao); }
  .pillars-inner { max-width: 1100px; margin: 0 auto; }
  .pillars-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px; margin-top: 4rem;
  }
  .pillar {
    background: var(--preto); padding: 3rem 2.5rem;
    position: relative; overflow: hidden; transition: background .3s;
  }
  .pillar:hover { background: var(--grafite); }
  .pillar::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 2px; height: 0; background: var(--ouro); transition: height .4s ease;
  }
  .pillar:hover::before { height: 100%; }
  .pillar-num { font-family: 'Cinzel', serif; font-size: .65rem; letter-spacing: .3em; color: var(--ouro-dim); margin-bottom: 1.5rem; }
  .pillar-title { font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 600; color: var(--branco); margin-bottom: 1rem; }
  .pillar-body { font-size: .82rem; line-height: 1.8; color: var(--texto); }

  .info-band {
    padding: 5rem 2rem; max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 3rem 2rem;
  }
  .info-label { font-size: .6rem; letter-spacing: .4em; text-transform: uppercase; color: var(--ouro-dim); margin-bottom: .75rem; }
  .info-value { font-family: 'Cinzel', serif; font-size: 1rem; color: var(--branco); line-height: 1.5; }
  .info-note { font-size: .75rem; color: var(--texto); margin-top: .4rem; }

  .ticket-section { background: var(--grafite); padding: 6rem 2rem; }
  .ticket-inner { max-width: 700px; margin: 0 auto; text-align: center; }
  .ticket-card {
    background: var(--carvao); border: 1px solid var(--onix);
    padding: 3.5rem; margin: 3rem 0; position: relative; overflow: hidden;
  }
  .ticket-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(to right, transparent, var(--ouro), transparent);
  }
  .ticket-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, var(--ouro-dim), transparent);
  }
  .ticket-type { font-size: .6rem; letter-spacing: .4em; text-transform: uppercase; color: var(--ouro); margin-bottom: 1rem; }
  .ticket-name { font-family: 'Cinzel', serif; font-size: 1.6rem; font-weight: 600; color: var(--branco); margin-bottom: .5rem; }
  .ticket-desc { font-size: .8rem; color: var(--texto); line-height: 1.7; margin-bottom: 2rem; }
  .ticket-details { display: flex; justify-content: center; gap: 3rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
  .ticket-detail { text-align: center; }
  .ticket-detail .label { font-size: .55rem; letter-spacing: .3em; text-transform: uppercase; color: var(--ouro-dim); display: block; margin-bottom: .3rem; }
  .ticket-detail .val { font-family: 'Cinzel', serif; font-size: .85rem; color: var(--branco); }
  .ticket-sep { width: 100%; border: none; border-top: 1px dashed var(--onix); margin: 2rem 0; }
  .ticket-barcode { display: flex; justify-content: center; gap: 2px; margin-top: 1.5rem; }
  .barcode-bar { background: var(--ouro-dim); height: 30px; }

  .brandmark { padding: 8rem 2rem; text-align: center; }
  .brandmark-inner { max-width: 700px; margin: 0 auto; }
  .large-mark { margin: 4rem auto; width: 160px; height: 160px; }
  .brand-statement {
    font-family: 'Cinzel', serif;
    font-size: clamp(1rem, 2.5vw, 1.4rem);
    font-weight: 400; line-height: 1.7; color: var(--branco); margin: 3rem 0 1.5rem;
  }
  .brand-manifesto { font-size: .82rem; line-height: 1.9; color: var(--texto); }

  .opening { background: var(--carvao); padding: 6rem 2rem; }
  .opening-inner { max-width: 600px; margin: 0 auto; text-align: center; }
  .opening-date {
    font-family: 'Cinzel', serif;
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 700; color: var(--ouro); letter-spacing: .05em;
    line-height: 1; margin: 2rem 0 .5rem;
  }
  .opening-time { font-size: .7rem; letter-spacing: .4em; text-transform: uppercase; color: var(--texto); margin-bottom: 2.5rem; }
  .opening-form { display: flex; gap: 0; max-width: 440px; margin: 2.5rem auto 0; }
  .opening-input {
    flex: 1; background: var(--preto); border: 1px solid var(--onix);
    border-right: none; color: var(--branco);
    padding: .9rem 1.2rem; font-family: 'Space Grotesk', sans-serif;
    font-size: .75rem; outline: none;
  }
  .opening-input::placeholder { color: var(--texto); opacity: .5; }
  .opening-input:focus { border-color: var(--ouro-dim); }
  .opening-submit {
    background: var(--ouro); border: none; color: var(--preto);
    padding: .9rem 1.5rem; font-family: 'Space Grotesk', sans-serif;
    font-size: .6rem; letter-spacing: .25em; text-transform: uppercase;
    font-weight: 500; cursor: pointer; transition: background .25s; white-space: nowrap;
  }
  .opening-submit:hover { background: #C9A227; }
  .opening-note { font-size: .65rem; color: var(--texto); opacity: .6; margin-top: 1rem; letter-spacing: .1em; }

  footer { border-top: 1px solid var(--onix); padding: 4rem 3rem 3rem; }
  .footer-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem; margin-bottom: 3rem;
  }
  .footer-col-title { font-size: .6rem; letter-spacing: .35em; text-transform: uppercase; color: var(--ouro-dim); margin-bottom: 1.2rem; }
  .footer-col p, .footer-col a {
    font-size: .78rem; color: var(--texto); line-height: 1.8;
    display: block; text-decoration: none; transition: color .2s;
  }
  .footer-col a:hover { color: var(--ouro); }
  .footer-bottom {
    max-width: 1100px; margin: 0 auto; padding-top: 2rem;
    border-top: 1px solid var(--onix);
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 1rem;
  }
  .footer-copy { font-size: .65rem; color: var(--texto); opacity: .5; letter-spacing: .1em; }
  .footer-tagline-small { font-size: .65rem; color: var(--ouro-dim); letter-spacing: .15em; font-style: italic; }

  .fade-up { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
  .fade-up.visible { opacity: 1; transform: none; }

  @media (max-width: 768px) {
    nav { padding: 1.2rem 1.5rem; }
    .nav-right { gap: 1.2rem; }
    .nav-link { display: none; }
    .info-band { grid-template-columns: 1fr 1fr; }
    .footer-inner { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; text-align: center; }
    .opening-form { flex-direction: column; }
    .opening-input { border-right: 1px solid var(--onix); border-bottom: none; }
    .pillar { padding: 2rem 1.5rem; }
    .ticket-card { padding: 2.5rem 1.5rem; }
  }
`;

const BARCODE_BARS = [
  [2,1],[1,.4],[3,1],[1,.4],[2,1],[2,.4],[1,1],[3,.4],[2,1],[1,.4],
  [2,1],[2,.4],[1,1],[3,.4],[2,1],[1,.4],[2,1],[2,.4],[3,1],[1,.4],[2,1],
];

const KEYWORDS = ['Litúrgico','Preciso','Sombrio','Luxuoso','Eterno','Ruptura','Transcendência','Silêncio'];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpEmail, setRsvpEmail] = useState('');

  useEffect(() => {
    const pc1 = document.createElement('link');
    pc1.rel = 'preconnect';
    pc1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc1);

    const pc2 = document.createElement('link');
    pc2.rel = 'preconnect';
    pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    document.head.appendChild(pc2);

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Space+Grotesk:wght@300;400;500;600&display=swap';
    document.head.appendChild(fontLink);

    const styleEl = document.createElement('style');
    styleEl.textContent = SKSAM_CSS;
    document.head.appendChild(styleEl);

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.head.removeChild(pc1);
      document.head.removeChild(pc2);
      document.head.removeChild(fontLink);
      document.head.removeChild(styleEl);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function handleRsvp(e) {
    e.preventDefault();
    setRsvpSubmitted(true);
  }

  return (
    <>
      <nav className={scrolled ? 'nav-scrolled' : ''}>
        <a href="#" className="nav-logo" aria-label="Literary Skins">
          <svg className="nav-badge" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="30" cy="30" r="28" stroke="#D4AF37" strokeWidth="1.2" opacity=".7"/>
            <circle cx="30" cy="30" r="20" stroke="#D4AF37" strokeWidth=".8" opacity=".5"/>
            <circle cx="30" cy="30" r="12" stroke="#D4AF37" strokeWidth=".8" opacity=".4"/>
            <circle cx="30" cy="30" r="5"  stroke="#D4AF37" strokeWidth="1.2" opacity=".8"/>
            <line x1="30" y1="2"  x2="30" y2="18" stroke="#D4AF37" strokeWidth=".8" opacity=".5"/>
            <line x1="30" y1="42" x2="30" y2="58" stroke="#D4AF37" strokeWidth=".8" opacity=".5"/>
            <line x1="2"  y1="30" x2="18" y2="30" stroke="#D4AF37" strokeWidth=".8" opacity=".5"/>
            <line x1="42" y1="30" x2="58" y2="30" stroke="#D4AF37" strokeWidth=".8" opacity=".5"/>
            <path d="M30 10 L32 18 L30 25 L28 18 Z" fill="#D4AF37" opacity=".6"/>
          </svg>
          <span className="nav-name">Literary Skins</span>
        </a>
        <div className="nav-right">
          <a href="#conceito"   className="nav-link">Conceito</a>
          <a href="#exposicao"  className="nav-link">Exposição</a>
          <a href="#vernissage" className="nav-link">Vernissage</a>
          <a href="#vernissage" className="nav-cta">RSVP</a>
        </div>
      </nav>

      <section className="hero" id="topo">
        <p className="hero-presented">Literary Skins presents</p>
        <h1 className="exhibit-title" aria-label="SKSAM">
          <span className="mirror">S</span>
          <span className="letter">K</span>
          <span className="mirror">S</span>
          <span className="mirror">&#x0222;</span>
          <span className="letter">M</span>
        </h1>
        <div className="title-reflection" aria-hidden="true">SKSAM</div>
        <div className="hero-rule" aria-hidden="true">
          <span className="line"></span>
          <span className="diamond"></span>
          <span className="line"></span>
        </div>
        <p className="hero-tagline">
          Every Skin Remembers<br />The Face It Replaced
        </p>
        <p className="hero-sub">An Exhibition on Identity, Surface and Disappearance</p>
        <div className="hero-meta">
          <span>05.06 — 28.06.2025</span>
          <span>Galeria Origin</span>
          <span>São Paulo · SP</span>
        </div>
        <div className="hero-cta-group">
          <a href="#vernissage" className="btn-primary">Reservar Ingresso</a>
          <a href="#conceito"   className="btn-secondary">Sobre a Exposição</a>
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <div className="scroll-cue-line"></div>
        </div>
      </section>

      <div className="palette-strip" aria-hidden="true">
        <div style={{background:'#0B0B0B'}}></div>
        <div style={{background:'#141414'}}></div>
        <div style={{background:'#1E1E1E'}}></div>
        <div style={{background:'#2A2A2A'}}></div>
        <div style={{background:'#D4AF37'}}></div>
      </div>

      <section className="concept" id="conceito">
        <div className="section-label">Conceito</div>
        <blockquote className="concept-quote fade-up">
          Toda pele lembra o rosto que substituiu.
        </blockquote>
        <p className="concept-body fade-up">
          SKSAM é uma investigação sobre o que permanece quando a superfície cede. Sobre as identidades que usamos para sobreviver — e as que destruímos ao fazê-lo. Sobre a memória impressa na matéria, a fratura como forma de revelação, e o que existe no espaço entre quem fomos e quem nos tornamos.
        </p>
        <p className="concept-body fade-up" style={{marginTop:'-1rem'}}>
          Reunindo obras em pintura, escultura, instalação e performance, esta exposição confronta o espectador com a natureza instável da identidade: sempre em processo, nunca completa, eternamente marcada pelas superfícies que habitou.
        </p>
        <span className="divider fade-up"></span>
        <div className="concept-keywords fade-up">
          {KEYWORDS.map(k => <span key={k} className="keyword">{k}</span>)}
        </div>
      </section>

      <section className="pillars" id="exposicao">
        <div className="pillars-inner">
          <div className="section-label">Eixos Temáticos</div>
          <div className="pillars-grid">
            <div className="pillar fade-up">
              <div className="pillar-num">01 ·</div>
              <div className="pillar-title">Identidade</div>
              <p className="pillar-body">
                Quem somos quando ninguém nos observa — e quem nos tornamos sob o peso do olhar alheio. A identidade como performance involuntária, construída camada a camada até tornar-se indistinguível da pele.
              </p>
            </div>
            <div className="pillar fade-up" style={{transitionDelay:'.1s'}}>
              <div className="pillar-num">02 ·</div>
              <div className="pillar-title">Superfície</div>
              <p className="pillar-body">
                A superfície não é o oposto da profundidade — é o lugar onde a profundidade se manifesta. Cada cicatriz, cada marca, cada textura carrega a memória de uma pressão. A matéria como arquivo do vivido.
              </p>
            </div>
            <div className="pillar fade-up" style={{transitionDelay:'.2s'}}>
              <div className="pillar-num">03 ·</div>
              <div className="pillar-title">Desaparecimento</div>
              <p className="pillar-body">
                O que resta quando alguém desaparece? Não o corpo — a impressão. O negativo no espaço. A exposição investiga o desaparecimento não como ausência, mas como forma de permanência invertida.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="info-band">
        <div className="info-block fade-up">
          <div className="info-label">Período</div>
          <div className="info-value">05 Junho — 28 Junho 2025</div>
          <div className="info-note">Terça a domingo · 11h–20h</div>
        </div>
        <div className="info-block fade-up" style={{transitionDelay:'.1s'}}>
          <div className="info-label">Local</div>
          <div className="info-value">Galeria Origin</div>
          <div className="info-note">São Paulo · SP · Brasil</div>
        </div>
        <div className="info-block fade-up" style={{transitionDelay:'.2s'}}>
          <div className="info-label">Entrada</div>
          <div className="info-value">Gratuita</div>
          <div className="info-note">Reserva recomendada para o vernissage</div>
        </div>
        <div className="info-block fade-up" style={{transitionDelay:'.3s'}}>
          <div className="info-label">Vernissage</div>
          <div className="info-value">05 Junho · 19h</div>
          <div className="info-note">Convite necessário — vagas limitadas</div>
        </div>
      </div>

      <section className="ticket-section">
        <div className="ticket-inner">
          <div className="section-label">Credencial</div>
          <h2 className="cinzel fade-up" style={{fontSize:'1.8rem',color:'var(--branco)',fontWeight:600,marginTop:'.5rem'}}>
            Exhibition Ticket
          </h2>
          <p className="fade-up" style={{fontSize:'.8rem',color:'var(--texto)',marginTop:'.75rem',lineHeight:1.7}}>
            Emita seu ingresso antecipado. Acesso livre durante todo o período da exposição, com prioridade de entrada no vernissage para portadores de convite.
          </p>

          <div className="ticket-card fade-up">
            <div className="ticket-type">Admit One · Exposição SKSAM</div>
            <div className="ticket-name">Š · KSAM</div>
            <p className="ticket-desc">
              Every Skin Remembers The Face It Replaced<br />
              An Exhibition on Identity, Surface and Disappearance
            </p>
            <div className="ticket-details">
              <div className="ticket-detail"><span className="label">Data</span><span className="val">05.06–28.06</span></div>
              <div className="ticket-detail"><span className="label">Local</span><span className="val">Galeria Origin</span></div>
              <div className="ticket-detail"><span className="label">Cidade</span><span className="val">São Paulo · SP</span></div>
              <div className="ticket-detail"><span className="label">Entrada</span><span className="val">Gratuita</span></div>
            </div>
            <hr className="ticket-sep" />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
              <div style={{textAlign:'left'}}>
                <div style={{fontSize:'.55rem',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--ouro-dim)',marginBottom:'.3rem'}}>Presented by</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:'.85rem',color:'var(--branco)'}}>Literary Skins</div>
              </div>
              <div className="ticket-barcode" aria-hidden="true">
                {BARCODE_BARS.map(([w, o], i) => (
                  <div key={i} className="barcode-bar" style={{width:`${w}px`,opacity:o}}></div>
                ))}
                <div style={{marginLeft:'4px',fontSize:'.5rem',color:'var(--ouro-dim)',alignSelf:'flex-end',letterSpacing:'.05em'}}>LS2506-EXH-01</div>
              </div>
            </div>
          </div>

          <a href="#vernissage" className="btn-primary" style={{marginTop:'1rem'}}>Reservar Ingresso</a>
        </div>
      </section>

      <section className="brandmark">
        <div className="brandmark-inner">
          <div className="section-label">Literary Skins</div>
          <svg className="large-mark" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Literary Skins badge">
            <circle cx="80" cy="80" r="76" stroke="#D4AF37" strokeWidth="1" opacity=".6"/>
            <circle cx="80" cy="80" r="60" stroke="#D4AF37" strokeWidth=".7" opacity=".4"/>
            <circle cx="80" cy="80" r="44" stroke="#D4AF37" strokeWidth=".7" opacity=".35"/>
            <circle cx="80" cy="80" r="28" stroke="#D4AF37" strokeWidth=".7" opacity=".3"/>
            <circle cx="80" cy="80" r="12" stroke="#D4AF37" strokeWidth="1" opacity=".7"/>
            <circle cx="80" cy="80" r="4"  fill="#D4AF37" opacity=".8"/>
            <line x1="80" y1="4"   x2="80" y2="52"  stroke="#D4AF37" strokeWidth=".7" opacity=".4"/>
            <line x1="80" y1="108" x2="80" y2="156" stroke="#D4AF37" strokeWidth=".7" opacity=".4"/>
            <line x1="4"  y1="80"  x2="52" y2="80"  stroke="#D4AF37" strokeWidth=".7" opacity=".4"/>
            <line x1="108" y1="80" x2="156" y2="80" stroke="#D4AF37" strokeWidth=".7" opacity=".4"/>
            <line x1="26"  y1="26"  x2="58"  y2="58"  stroke="#D4AF37" strokeWidth=".5" opacity=".25"/>
            <line x1="102" y1="102" x2="134" y2="134" stroke="#D4AF37" strokeWidth=".5" opacity=".25"/>
            <line x1="134" y1="26"  x2="102" y2="58"  stroke="#D4AF37" strokeWidth=".5" opacity=".25"/>
            <line x1="26"  y1="134" x2="58"  y2="102" stroke="#D4AF37" strokeWidth=".5" opacity=".25"/>
            <path id="circle-text-path" d="M 80,80 m -68,0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0" fill="none"/>
            <text fontFamily="'Space Grotesk',sans-serif" fontSize="8" fill="#D4AF37" opacity=".5" letterSpacing="5">
              <textPath href="#circle-text-path">VISÃO COMO FRATURA · MATÉRIA COMO MEMÓRIA · </textPath>
            </text>
          </svg>
          <p className="brand-statement fade-up">
            Matéria e símbolo.<br />
            A pressão que forma. A ruptura que revela.<br />
            Visão como fratura. Ouro como cicatriz.
          </p>
          <p className="brand-manifesto fade-up" style={{marginTop:'2rem'}}>
            Não é sobre luxo.<br />É sobre permanência.<br />É sobre o que resta quando tudo cede.
          </p>
        </div>
      </section>

      <section className="opening" id="vernissage">
        <div className="opening-inner">
          <div className="section-label">Vernissage</div>
          <div className="opening-date fade-up">05.06</div>
          <div className="opening-time fade-up">Quinta-feira · 19h · Galeria Origin · São Paulo SP</div>
          <p className="fade-up" style={{fontSize:'.85rem',lineHeight:1.8,color:'var(--texto)',maxWidth:'440px',margin:'0 auto 2rem'}}>
            Uma noite de abertura restrita. Obras, artistas e convidados — o primeiro encontro com SKSAM antes de abrir ao público.
          </p>
          <span className="divider fade-up"></span>
          {!rsvpSubmitted ? (
            <>
              <form className="opening-form fade-up" onSubmit={handleRsvp}>
                <input
                  className="opening-input"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  aria-label="E-mail para RSVP"
                  value={rsvpEmail}
                  onChange={e => setRsvpEmail(e.target.value)}
                />
                <button type="submit" className="opening-submit">RSVP</button>
              </form>
              <p className="opening-note fade-up">Vagas limitadas · Confirmação por e-mail</p>
            </>
          ) : (
            <div style={{marginTop:'1.5rem',fontSize:'.8rem',color:'var(--ouro)',letterSpacing:'.15em'}}>
              Reserva recebida. Até quinta-feira.
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-col">
            <div className="footer-col-title">Exposição</div>
            <p>SKSAM</p>
            <p>05.06 – 28.06.2025</p>
            <p>Terça a domingo · 11h–20h</p>
            <p style={{marginTop:'.5rem'}}>Galeria Origin</p>
            <p>São Paulo · SP</p>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Literary Skins</div>
            <a href="#">Sobre</a>
            <a href="#">Projetos</a>
            <a href="#">Imprensa</a>
            <a href="#">Contato</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Contato</div>
            <a href="#">press@literaryskins.com</a>
            <a href="#">curadoria@literaryskins.com</a>
            <p style={{marginTop:'1rem',fontSize:'.7rem',opacity:.5}}>
              © {new Date().getFullYear()} Literary Skins Corp.<br />Todos os direitos reservados.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">Literary Skins · SKSAM Exhibition · São Paulo 2025</span>
          <span className="footer-tagline-small">"Consciência crítica não é negativismo. É liberdade."</span>
        </div>
      </footer>
    </>
  );
}
