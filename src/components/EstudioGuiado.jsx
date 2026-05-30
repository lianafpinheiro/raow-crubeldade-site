import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   ESTÚDIO GUIADO — FLUXO LINEAR DE 6 PASSOS
   1. Carregar música  →  2. Gerar frase  →  3. Gravar voz
   4. Distribuir voz  →  5. Correção mínima  →  6. WAV final
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── PALETA ÚNICA, ESCOLHIDA PARA NÃO CANSAR ───────────────────────────── */
/* Tons quentes, dignos, com cor sem agressão visual.                       */
const P = {
  bg: "#1a0a1f",
  bgLight: "#241430",
  bgCard: "#2a1838",
  fg: "#fff4d6",
  fgDim: "#a695b5",
  fgFade: "#6b5570",
  line: "rgba(255,184,0,0.20)",
  lineStrong: "rgba(255,184,0,0.40)",
  accent: "#ffb800",
  accentDeep: "#cc8800",
  pop: "#c026d3",
  pop2: "#ff5577",
  ok: "#84cc16",
  rec: "#ff3366",
};

/* ─── PASSOS DO FLUXO ───────────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Sua música" },
  { n: 2, label: "Sua frase" },
  { n: 3, label: "Sua voz" },
  { n: 4, label: "Distribuição" },
  { n: 5, label: "Correção" },
  { n: 6, label: "Resultado" },
];

/* ─── ESTILOS DE DISTRIBUIÇÃO ───────────────────────────────────────────── */
const DISTRIBUTIONS = [
  {
    id: "rhythmic",
    title: "Aparições rítmicas",
    desc: "Sua voz aparece 4 vezes ao longo da música, em pontos espaçados, como acentos.",
  },
  {
    id: "choir",
    title: "Coro de você mesma",
    desc: "Três versões da sua voz se sobrepõem em camadas com tratamentos diferentes, formando um coro de você.",
  },
  {
    id: "echo",
    title: "Eco progressivo",
    desc: "Sua voz se repete 5 vezes, cada uma com mais espaço e profundidade que a anterior.",
  },
  {
    id: "whisper",
    title: "Sussurro contínuo",
    desc: "Sua voz como camada baixa que atravessa toda a música, textura constante de fundo.",
  },
  {
    id: "single",
    title: "Único impacto",
    desc: "Sua voz aparece uma única vez, exatamente no centro da música, sem repetição.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITÁRIOS GERAIS
   ═══════════════════════════════════════════════════════════════════════════ */

const fmtTime = (s) => {
  if (!s || isNaN(s)) return "—:—";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
};

const fmtTimeMs = (s) => {
  if (!s || isNaN(s)) return "00:00.0";
  const m = Math.floor(s / 60);
  const r = (s % 60).toFixed(1);
  return `${m.toString().padStart(2, "0")}:${r.padStart(4, "0")}`;
};

/* Converte um AudioBuffer renderizado em arquivo WAV PCM 16-bit estéreo. */
const audioBufferToWav = (buffer) => {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2 + 44;
  const ab = new ArrayBuffer(length);
  const view = new DataView(ab);
  const writeStr = (off, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, length - 8, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, length - 44, true);
  let off = 44;
  const chans = [];
  for (let i = 0; i < numChannels; i++) chans.push(buffer.getChannelData(i));
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, chans[ch][i]));
      view.setInt16(off, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      off += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
};

/* Gera uma resposta de impulso sintética para o reverb — ruído com decaimento. */
const createImpulseResponse = (ctx, duration, decay) => {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
};

/* ═══════════════════════════════════════════════════════════════════════════
   ANÁLISE DE ÁUDIO
   Extrai características objetivas da música para alimentar a IA da frase.
   ═══════════════════════════════════════════════════════════════════════════ */

const analyzeAudio = async (file) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));

  const channel = audioBuffer.getChannelData(0);
  const duration = audioBuffer.duration;
  const sampleRate = audioBuffer.sampleRate;

  // RMS (intensidade média) e pico
  let sumSq = 0;
  let peak = 0;
  for (let i = 0; i < channel.length; i++) {
    sumSq += channel[i] * channel[i];
    if (Math.abs(channel[i]) > peak) peak = Math.abs(channel[i]);
  }
  const rms = Math.sqrt(sumSq / channel.length);

  // Detecção de onset (acentos rítmicos) por janelas de energia
  const windowSize = Math.floor(sampleRate * 0.05); // 50ms
  const energyWindows = [];
  for (let i = 0; i + windowSize < channel.length; i += windowSize) {
    let e = 0;
    for (let j = 0; j < windowSize; j++) {
      e += channel[i + j] * channel[i + j];
    }
    energyWindows.push(e / windowSize);
  }

  const ma = 10;
  let onsets = 0;
  for (let i = ma; i < energyWindows.length - ma; i++) {
    let avg = 0;
    for (let j = i - ma; j < i; j++) avg += energyWindows[j];
    avg /= ma;
    if (energyWindows[i] > avg * 1.6 && energyWindows[i] > energyWindows[i - 1]) {
      onsets++;
    }
  }
  const onsetsPerMin = (onsets / duration) * 60;

  await ctx.close();

  return {
    duration,
    sampleRate,
    rms,
    peak,
    onsetsPerMin,
    dynamicRange: peak / (rms || 0.001),
  };
};

/* ═══════════════════════════════════════════════════════════════════════════
   GERAÇÃO DA FRASE — chamada à API do Claude
   ═══════════════════════════════════════════════════════════════════════════ */

const generatePhrase = async (analysis, intent) => {
  const systemPrompt = `Você é uma assistente criativa para Liana Frapin (Lilly TH), artista transmídia brasileira do universo Literary Skins / GUTTER-LUX. Sua tarefa é gerar UMA única frase poética em português brasileiro, para ela ler em voz alta sobre uma música.

REGRAS DA FRASE:
- Entre 6 e 14 palavras.
- Em português brasileiro.
- Lírica, encarnada, sensorial — não abstrata-fria nem clichê-romântica.
- Estética da artista: vulnerabilidade como arquitetura; sem narrativas de redenção; impasse consciente; beleza áspera; transmuta dor sem higienizar.
- Evite palavras desgastadas (alma, coração, eternidade, voar livre, sonhar, brilhar).
- Use linguagem precisa, imagens corpóreas, paradoxos sutis.
- Pode ser declaração, pergunta, fragmento, comando.

Responda APENAS com a frase. Sem aspas, sem preâmbulo, sem explicação, sem traduções, sem alternativas.`;

  const character =
    analysis.onsetsPerMin > 180
      ? "música muito rítmica e acentuada"
      : analysis.onsetsPerMin > 100
      ? "música com pulso médio"
      : "música lenta, pouco rítmica";

  const intensity =
    analysis.rms > 0.15
      ? "intensidade alta e cheia"
      : analysis.rms > 0.07
      ? "intensidade média"
      : "intensidade baixa e contida";

  const dynamics =
    analysis.dynamicRange > 6
      ? "muito dinâmica, com picos e quedas"
      : analysis.dynamicRange > 3
      ? "dinamicamente variada"
      : "dinamicamente plana";

  const userPrompt = `Características desta música específica:
- Duração: ${analysis.duration.toFixed(1)} segundos
- Caráter rítmico: ${character} (${analysis.onsetsPerMin.toFixed(0)} acentos por minuto)
- Intensidade sonora: ${intensity}
- Dinâmica: ${dynamics}

Intenção da artista para esta peça: ${
    intent && intent.trim()
      ? `"${intent.trim()}"`
      : "(não especificada — interprete a partir do caráter da música)"
  }

Gere a frase agora.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) throw new Error("Falha na geração da frase.");
  const data = await response.json();
  const text = data.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join(" ")
    .trim();

  // Limpa possíveis aspas e prefixos defensivos
  return text.replace(/^["'""]/, "").replace(/["'""]$/, "").trim();
};

/* ═══════════════════════════════════════════════════════════════════════════
   POSICIONAMENTOS DA VOZ NA MÚSICA
   ═══════════════════════════════════════════════════════════════════════════ */

const computePlacements = (style, totalDuration, voiceDuration) => {
  switch (style) {
    case "rhythmic": {
      const placements = [];
      const startPct = 0.15;
      const endPct = 0.82;
      for (let i = 0; i < 4; i++) {
        const pct = startPct + (i / 3) * (endPct - startPct);
        placements.push({ time: pct * totalDuration, gain: 1.0, reverbMult: 1.0 });
      }
      return placements;
    }
    case "choir": {
      const center = totalDuration * 0.4;
      return [
        { time: center, gain: 1.0, reverbMult: 0.6 },
        { time: center + 0.3, gain: 0.75, reverbMult: 2.0 },
        { time: center + 0.7, gain: 0.6, reverbMult: 3.0 },
      ];
    }
    case "echo": {
      const placements = [];
      const start = totalDuration * 0.2;
      const spacing = Math.max(voiceDuration + 1, totalDuration * 0.12);
      for (let i = 0; i < 5; i++) {
        const time = start + i * spacing;
        if (time + voiceDuration < totalDuration) {
          placements.push({
            time,
            gain: 1.0 - i * 0.15,
            reverbMult: 1.0 + i * 0.7,
          });
        }
      }
      return placements;
    }
    case "whisper": {
      const placements = [];
      const interval = voiceDuration + 1;
      let t = 0;
      while (t < totalDuration - voiceDuration) {
        placements.push({ time: t, gain: 0.35, reverbMult: 2.0 });
        t += interval;
      }
      return placements;
    }
    case "single": {
      return [
        {
          time: Math.max(0, (totalDuration - voiceDuration) * 0.5),
          gain: 1.0,
          reverbMult: 1.5,
        },
      ];
    }
    default:
      return [];
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   RENDER FINAL — monta toda a peça em um WAV
   ═══════════════════════════════════════════════════════════════════════════ */

const renderFinal = async (musicFile, voiceBlob, distribution, treatment, baseGain = 0.7) => {
  // Decodifica ambos no mesmo contexto
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const musicArrayBuf = await musicFile.arrayBuffer();
  const musicBuffer = await ctx.decodeAudioData(musicArrayBuf.slice(0));
  const voiceArrayBuf = await voiceBlob.arrayBuffer();
  const voiceBuffer = await ctx.decodeAudioData(voiceArrayBuf.slice(0));
  await ctx.close();

  const sampleRate = 44100;
  const duration = musicBuffer.duration;
  const offline = new OfflineAudioContext(
    2,
    Math.ceil(duration * sampleRate),
    sampleRate
  );

  // Base musical
  const baseSrc = offline.createBufferSource();
  baseSrc.buffer = musicBuffer;
  const baseGainNode = offline.createGain();
  baseGainNode.gain.value = baseGain;
  baseSrc.connect(baseGainNode).connect(offline.destination);
  baseSrc.start(0);

  // Posicionamentos da voz
  const placements = computePlacements(distribution, duration, voiceBuffer.duration);

  for (const placement of placements) {
    const voiceSrc = offline.createBufferSource();
    voiceSrc.buffer = voiceBuffer;

    let lastNode = voiceSrc;

    // Limpeza — passa-alta para remover graves indesejados
    if (treatment.limpeza > 0) {
      const hpf = offline.createBiquadFilter();
      hpf.type = "highpass";
      hpf.frequency.value = 60 + (treatment.limpeza / 100) * 140;
      lastNode.connect(hpf);
      lastNode = hpf;
    }

    // Corpo — peaking EQ em frequências graves-médias
    if (treatment.corpo > 0) {
      const corpoEq = offline.createBiquadFilter();
      corpoEq.type = "peaking";
      corpoEq.frequency.value = 250;
      corpoEq.Q.value = 0.8;
      corpoEq.gain.value = (treatment.corpo / 100) * 6;
      lastNode.connect(corpoEq);
      lastNode = corpoEq;
    }

    // Brilho — peaking EQ em frequências altas
    if (treatment.brilho > 0) {
      const brilhoEq = offline.createBiquadFilter();
      brilhoEq.type = "peaking";
      brilhoEq.frequency.value = 7000;
      brilhoEq.Q.value = 0.7;
      brilhoEq.gain.value = (treatment.brilho / 100) * 10;
      lastNode.connect(brilhoEq);
      lastNode = brilhoEq;
    }

    // Estabilidade — compressor (controla dinâmica para soar mais consistente)
    if (treatment.estabilidade > 0) {
      const comp = offline.createDynamicsCompressor();
      const amt = treatment.estabilidade / 100;
      comp.threshold.value = -18 - amt * 16;
      comp.knee.value = 30;
      comp.ratio.value = 2 + amt * 6;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      lastNode.connect(comp);
      lastNode = comp;
    }

    // Espaço — reverb com mistura wet/dry
    const reverbAmount = (treatment.espaco / 100) * placement.reverbMult;
    if (reverbAmount > 0.05) {
      const dry = offline.createGain();
      const wet = offline.createGain();
      const wetLevel = Math.min(0.6, reverbAmount * 0.4);
      dry.gain.value = 1 - wetLevel;
      wet.gain.value = wetLevel;

      const convolver = offline.createConvolver();
      convolver.buffer = createImpulseResponse(
        offline,
        1.5 + placement.reverbMult,
        2.5
      );

      lastNode.connect(dry);
      lastNode.connect(convolver);
      convolver.connect(wet);

      const mixGain = offline.createGain();
      dry.connect(mixGain);
      wet.connect(mixGain);
      lastNode = mixGain;
    }

    // Ganho final do posicionamento
    const placementGain = offline.createGain();
    placementGain.gain.value = placement.gain;
    lastNode.connect(placementGain);
    placementGain.connect(offline.destination);

    voiceSrc.start(placement.time);
  }

  const rendered = await offline.startRendering();
  return audioBufferToWav(rendered);
};

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════════════════════════════ */

export default function EstudioGuiado() {
  /* ── Estado geral ── */
  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState(null);

  /* ── PASSO 1: música ── */
  const [musicFile, setMusicFile] = useState(null);
  const [musicUrl, setMusicUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /* ── PASSO 2: frase ── */
  const [intent, setIntent] = useState("");
  const [phrase, setPhrase] = useState("");
  const [generating, setGenerating] = useState(false);
  const [phraseManual, setPhraseManual] = useState(false);

  /* ── PASSO 3: gravação ── */
  const [recState, setRecState] = useState("idle"); // idle | countdown | recording | preview
  const [recCountdown, setRecCountdown] = useState(0);
  const [recTime, setRecTime] = useState(0);
  const [recLevel, setRecLevel] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [micError, setMicError] = useState(null);

  /* ── PASSO 4: distribuição ── */
  const [distribution, setDistribution] = useState("rhythmic");

  /* ── PASSO 5: tratamento ── */
  const [treatment, setTreatment] = useState({
    brilho: 35,
    corpo: 30,
    espaco: 25,
    estabilidade: 20,
    limpeza: 45,
  });

  /* ── PASSO 6: resultado ── */
  const [finalBlob, setFinalBlob] = useState(null);
  const [finalUrl, setFinalUrl] = useState(null);
  const [rendering, setRendering] = useState(false);

  /* ── Refs ── */
  const fileInputRef = useRef(null);
  const baseAudioRef = useRef(null);
  const previewAudioRef = useRef(null);
  const recCanvasRef = useRef(null);
  const recStreamRef = useRef(null);
  const recAudioCtxRef = useRef(null);
  const recAnalyserRef = useRef(null);
  const recAnimRef = useRef(null);
  const recTimerRef = useRef(null);
  const recStartRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const flash = (type, msg) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 5000);
  };

  /* ─── PASSO 1: upload + análise ───────────────────────────────────────── */
  const handleMusicFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
      flash("error", "Por favor, envie um arquivo de áudio ou vídeo.");
      return;
    }
    setAnalyzing(true);
    try {
      const url = URL.createObjectURL(file);
      setMusicFile(file);
      setMusicUrl(url);
      // Para vídeos, extrair só o áudio é mais complexo; o decodeAudioData
      // funciona com vídeos que têm trilha de áudio em codecs suportados.
      const result = await analyzeAudio(file);
      setAnalysis(result);
      setAnalyzing(false);
    } catch (e) {
      setAnalyzing(false);
      flash("error", "Não consegui analisar o arquivo. Tente outro formato (MP3, WAV, M4A).");
      console.error(e);
    }
  };

  /* ─── PASSO 2: geração da frase ──────────────────────────────────────── */
  const requestPhrase = async () => {
    if (!analysis) return;
    setGenerating(true);
    try {
      const result = await generatePhrase(analysis, intent);
      setPhrase(result);
      setGenerating(false);
    } catch (e) {
      setGenerating(false);
      flash(
        "error",
        "Não consegui gerar a frase agora. Você pode escrever a sua aqui embaixo."
      );
      setPhraseManual(true);
      console.error(e);
    }
  };

  /* ─── PASSO 3: gravação ──────────────────────────────────────────────── */
  const cleanupMic = () => {
    if (recStreamRef.current) {
      recStreamRef.current.getTracks().forEach((t) => t.stop());
      recStreamRef.current = null;
    }
    if (recAudioCtxRef.current && recAudioCtxRef.current.state !== "closed") {
      recAudioCtxRef.current.close().catch(() => {});
      recAudioCtxRef.current = null;
    }
    if (recAnimRef.current) {
      cancelAnimationFrame(recAnimRef.current);
      recAnimRef.current = null;
    }
    if (recTimerRef.current) {
      clearInterval(recTimerRef.current);
      recTimerRef.current = null;
    }
  };

  const initMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });
      recStreamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      recAudioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      recAnalyserRef.current = analyser;
      drawWaveform();
      return stream;
    } catch (e) {
      setMicError(
        e.name === "NotAllowedError"
          ? "Acesso ao microfone negado. Verifique as permissões do navegador."
          : e.message || "Não consegui acessar o microfone."
      );
      return null;
    }
  };

  const drawWaveform = () => {
    const analyser = recAnalyserRef.current;
    const canvas = recCanvasRef.current;
    if (!analyser || !canvas) {
      recAnimRef.current = requestAnimationFrame(drawWaveform);
      return;
    }
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);

    let peak = 0;
    for (let i = 0; i < data.length; i++) {
      const v = Math.abs(data[i] - 128) / 128;
      if (v > peak) peak = v;
    }
    setRecLevel(peak);

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 2;
    ctx.strokeStyle = P.rec;
    ctx.beginPath();
    const sliceWidth = w / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * h) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
    recAnimRef.current = requestAnimationFrame(drawWaveform);
  };

  const startCountdown = async () => {
    setMicError(null);
    const stream = await initMic();
    if (!stream) return;

    if (baseAudioRef.current && musicUrl) {
      baseAudioRef.current.src = musicUrl;
      baseAudioRef.current.currentTime = 0;
      baseAudioRef.current.volume = 0.85;
    }

    setRecState("countdown");
    setRecCountdown(3);
    let n = 3;
    const tick = setInterval(() => {
      n -= 1;
      setRecCountdown(n);
      if (n === 0) {
        clearInterval(tick);
        actuallyStartRecording();
      }
    }, 1000);
  };

  const actuallyStartRecording = () => {
    if (!recStreamRef.current) return;
    recordedChunksRef.current = [];
    try {
      const mr = new MediaRecorder(recStreamRef.current, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        setVoiceBlob(blob);
        const url = URL.createObjectURL(blob);
        setVoiceUrl(url);
        // Descobrir duração real
        const probe = new Audio(url);
        probe.addEventListener("loadedmetadata", () => {
          setVoiceDuration(isFinite(probe.duration) ? probe.duration : recTime);
        });
        setRecState("preview");
        if (baseAudioRef.current) baseAudioRef.current.pause();
      };
      mediaRecorderRef.current = mr;
      mr.start(100);
      recStartRef.current = Date.now();
      recTimerRef.current = setInterval(() => {
        setRecTime((Date.now() - recStartRef.current) / 1000);
      }, 100);
      setRecState("recording");
      if (baseAudioRef.current?.src) {
        baseAudioRef.current.play().catch(() => {});
      }
    } catch (e) {
      setMicError("Falha ao iniciar a gravação: " + e.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (recTimerRef.current) {
      clearInterval(recTimerRef.current);
      recTimerRef.current = null;
    }
  };

  const redoRecording = () => {
    if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    setVoiceBlob(null);
    setVoiceUrl(null);
    setVoiceDuration(0);
    setRecTime(0);
    setRecState("idle");
  };

  useEffect(() => {
    return () => {
      cleanupMic();
      if (voiceUrl) URL.revokeObjectURL(voiceUrl);
      if (musicUrl) URL.revokeObjectURL(musicUrl);
      if (finalUrl) URL.revokeObjectURL(finalUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── PASSO 6: render final ──────────────────────────────────────────── */
  const renderResult = async () => {
    if (!musicFile || !voiceBlob) return;
    setRendering(true);
    try {
      const wavBlob = await renderFinal(musicFile, voiceBlob, distribution, treatment);
      const url = URL.createObjectURL(wavBlob);
      if (finalUrl) URL.revokeObjectURL(finalUrl);
      setFinalBlob(wavBlob);
      setFinalUrl(url);
      setRendering(false);
      setStep(6);
    } catch (e) {
      setRendering(false);
      flash("error", "Renderização falhou: " + (e.message || "erro desconhecido"));
      console.error(e);
    }
  };

  const downloadFinal = () => {
    if (!finalUrl) return;
    const a = document.createElement("a");
    a.href = finalUrl;
    const baseName = musicFile?.name?.replace(/\.[^.]+$/, "") || "minha-musica";
    a.download = `${baseName} · com voz · ${Date.now()}.wav`;
    a.click();
  };

  const restart = () => {
    if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    if (musicUrl) URL.revokeObjectURL(musicUrl);
    if (finalUrl) URL.revokeObjectURL(finalUrl);
    setMusicFile(null);
    setMusicUrl(null);
    setAnalysis(null);
    setIntent("");
    setPhrase("");
    setPhraseManual(false);
    setVoiceBlob(null);
    setVoiceUrl(null);
    setVoiceDuration(0);
    setRecTime(0);
    setRecState("idle");
    setDistribution("rhythmic");
    setFinalBlob(null);
    setFinalUrl(null);
    setStep(1);
  };

  /* ─── Navegação entre passos ──────────────────────────────────────────── */
  const canAdvance = () => {
    if (step === 1) return !!analysis && !analyzing;
    if (step === 2) return phrase.trim().length > 0;
    if (step === 3) return !!voiceBlob && recState === "preview";
    if (step === 4) return true;
    if (step === 5) return true;
    return false;
  };

  const goNext = () => {
    if (step === 5) {
      renderResult();
    } else if (canAdvance() && step < 6) {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  /* ─── JSX ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,300..800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${P.accent}; color: ${P.bg}; }

        body, .app {
          background: ${P.bg};
          color: ${P.fg};
          font-family: 'Fraunces', Georgia, serif;
          min-height: 100vh;
          font-feature-settings: "ss01";
        }

        .noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 100;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9, 0 0 0 0 0.9, 0 0 0 0 0.85, 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.4; mix-blend-mode: screen;
        }

        .serif { font-family: 'Instrument Serif', serif; font-style: italic; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        .container {
          max-width: 760px;
          margin: 0 auto;
          padding: 32px 22px 60px;
        }

        /* ── HEADER ── */
        .header {
          text-align: center;
          margin-bottom: 36px;
          padding-bottom: 24px;
          border-bottom: 1px solid ${P.line};
        }
        .header h1 {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1;
          color: ${P.fg};
        }
        .header h1 em {
          color: ${P.accent};
        }
        .header .sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.25em;
          text-transform: uppercase; color: ${P.fgDim};
          margin-top: 14px;
        }

        /* ── PROGRESS BAR ── */
        .progress {
          display: flex;
          gap: 8px;
          margin-bottom: 40px;
          padding: 0 8px;
        }
        .progress-step {
          flex: 1;
          height: 3px;
          background: ${P.line};
          position: relative;
          transition: background 0.3s;
        }
        .progress-step.done { background: ${P.accent}; }
        .progress-step.active { background: ${P.accent}; box-shadow: 0 0 12px ${P.accent}; }
        .progress-labels {
          display: flex;
          gap: 8px;
          margin-bottom: 40px;
          padding: 0 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${P.fgFade};
        }
        .progress-label {
          flex: 1;
          text-align: center;
          transition: color 0.3s;
        }
        .progress-label.active { color: ${P.accent}; }
        .progress-label.done { color: ${P.fgDim}; }

        /* ── STEP CONTAINER ── */
        .step {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .step-header {
          margin-bottom: 22px;
        }
        .step-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: ${P.accent};
          margin-bottom: 8px;
        }
        .step-title {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 18px;
        }
        .step-instruction {
          font-size: 1.05rem;
          line-height: 1.6;
          color: ${P.fg};
          opacity: 0.92;
          margin-bottom: 26px;
        }
        .step-instruction strong { color: ${P.accent}; font-weight: 500; }

        /* ── DROP ZONE (PASSO 1) ── */
        .drop {
          border: 1.5px dashed ${P.lineStrong};
          padding: 50px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: ${P.bgCard};
        }
        .drop:hover, .drop.over {
          border-color: ${P.accent};
          background: ${P.bgLight};
        }
        .drop-icon {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 3rem; color: ${P.accent};
          margin-bottom: 16px; line-height: 1;
        }
        .drop-text {
          font-size: 1.1rem;
          margin-bottom: 6px;
        }
        .drop-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.15em;
          color: ${P.fgDim}; text-transform: uppercase;
        }

        .music-loaded {
          padding: 18px 20px;
          background: ${P.bgCard};
          border: 1px solid ${P.line};
          border-left: 3px solid ${P.accent};
          display: flex; gap: 16px; align-items: center;
        }
        .music-loaded .icon { color: ${P.accent}; font-size: 1.8rem; }
        .music-loaded .info { flex: 1; min-width: 0; }
        .music-loaded .name {
          font-size: 1rem; margin-bottom: 4px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .music-loaded .meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: ${P.fgDim};
        }
        .music-loaded button {
          background: none; border: 1px solid ${P.line};
          color: ${P.fgDim}; padding: 8px 14px; cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
        }
        .music-loaded button:hover { color: ${P.accent}; border-color: ${P.accent}; }

        .analyzing {
          padding: 22px;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem; letter-spacing: 0.15em;
          color: ${P.fgDim};
          background: ${P.bgCard};
          border: 1px solid ${P.line};
          margin-top: 14px;
        }
        .analyzing::before {
          content: '◐';
          display: inline-block;
          margin-right: 10px;
          animation: spin 1.2s linear infinite;
          color: ${P.accent};
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .analysis-result {
          padding: 18px;
          background: ${P.bgCard};
          border-left: 3px solid ${P.ok};
          margin-top: 16px;
        }
        .analysis-result .label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: ${P.ok};
          margin-bottom: 8px;
        }
        .analysis-result .body { font-size: 0.95rem; line-height: 1.5; }
        .analysis-result .body strong { color: ${P.accent}; }

        /* ── PASSO 2 ── */
        .intent-field { margin-bottom: 24px; }
        .intent-field label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: ${P.fgDim};
          margin-bottom: 10px;
        }
        .intent-field input {
          width: 100%;
          background: ${P.bgCard};
          border: 1px solid ${P.line};
          color: ${P.fg};
          padding: 14px 16px;
          font-family: 'Fraunces', serif;
          font-size: 1rem;
        }
        .intent-field input:focus {
          outline: none; border-color: ${P.accent};
        }
        .intent-field .hint {
          font-size: 0.85rem;
          color: ${P.fgDim};
          margin-top: 6px;
          font-style: italic;
        }

        .phrase-box {
          padding: 36px 28px;
          background: ${P.bgCard};
          border: 1px solid ${P.lineStrong};
          margin: 22px 0;
          text-align: center;
          position: relative;
          min-height: 140px;
          display: flex; align-items: center; justify-content: center;
        }
        .phrase-text {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(1.4rem, 3.5vw, 2.1rem);
          line-height: 1.3;
          color: ${P.accent};
          letter-spacing: -0.005em;
        }
        .phrase-generating {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.2em;
          color: ${P.fgDim}; text-transform: uppercase;
        }
        .phrase-generating::before {
          content: '◐';
          display: inline-block;
          margin-right: 10px;
          animation: spin 1.2s linear infinite;
          color: ${P.accent};
        }

        .phrase-actions {
          display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
          margin-top: 18px;
        }

        .manual-phrase {
          margin-top: 22px;
          padding-top: 22px;
          border-top: 1px solid ${P.line};
        }
        .manual-phrase textarea {
          width: 100%;
          background: ${P.bgCard};
          border: 1px solid ${P.line};
          color: ${P.fg};
          padding: 14px 16px;
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 1.1rem;
          resize: vertical;
          min-height: 70px;
        }
        .manual-phrase textarea:focus {
          outline: none; border-color: ${P.accent};
        }

        /* ── PASSO 3: gravação ── */
        .phrase-display {
          padding: 28px;
          background: ${P.bgCard};
          border: 1px solid ${P.lineStrong};
          margin-bottom: 26px;
          text-align: center;
        }
        .phrase-display .label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: ${P.fgDim};
          margin-bottom: 14px;
        }
        .phrase-display .text {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          line-height: 1.35;
          color: ${P.accent};
        }

        .rec-warning {
          padding: 16px 18px;
          background: rgba(255,184,0,0.08);
          border-left: 3px solid ${P.accent};
          margin-bottom: 22px;
          font-size: 0.92rem; line-height: 1.55;
        }
        .rec-warning strong { color: ${P.accent}; font-weight: 500; }

        .rec-canvas-wrap {
          background: ${P.bgCard};
          border: 1px solid ${P.line};
          padding: 12px;
          margin-bottom: 18px;
          position: relative;
        }
        .rec-canvas { width: 100%; height: 130px; display: block; }
        .rec-timer {
          position: absolute; top: 18px; right: 20px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500; font-size: 1rem;
          color: ${P.rec}; letter-spacing: 0.1em;
        }
        .rec-timer.live::before {
          content: '●'; margin-right: 8px;
          animation: blink 1.4s infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .rec-countdown {
          padding: 60px 20px;
          text-align: center;
          background: ${P.bgCard};
          border: 1px solid ${P.lineStrong};
          margin-bottom: 22px;
        }
        .rec-countdown-num {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(6rem, 18vw, 10rem);
          color: ${P.rec};
          line-height: 1;
        }
        .rec-countdown-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem; letter-spacing: 0.2em;
          color: ${P.fgDim}; text-transform: uppercase;
          margin-top: 8px;
        }

        .rec-preview {
          padding: 22px;
          background: ${P.bgCard};
          border: 1px solid ${P.lineStrong};
          border-top-color: ${P.ok};
          border-top-width: 3px;
          margin-bottom: 22px;
        }
        .rec-preview-info {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: ${P.ok};
          margin-bottom: 14px;
        }
        .rec-preview audio { width: 100%; }

        .mic-error {
          padding: 16px;
          background: rgba(255,51,102,0.1);
          border: 1px solid ${P.rec};
          color: ${P.rec};
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          margin-bottom: 18px;
        }

        /* ── PASSO 4: distribuição ── */
        .dist-options {
          display: flex; flex-direction: column; gap: 12px;
        }
        .dist-option {
          padding: 18px 20px;
          background: ${P.bgCard};
          border: 1.5px solid ${P.line};
          cursor: pointer;
          transition: all 0.2s;
        }
        .dist-option:hover { border-color: ${P.lineStrong}; }
        .dist-option.selected {
          border-color: ${P.accent};
          background: ${P.bgLight};
        }
        .dist-option-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 6px;
        }
        .dist-radio {
          width: 18px; height: 18px;
          border: 1.5px solid ${P.fgDim};
          border-radius: 50%;
          position: relative;
          flex: 0 0 auto;
        }
        .dist-option.selected .dist-radio {
          border-color: ${P.accent};
        }
        .dist-option.selected .dist-radio::after {
          content: '';
          position: absolute; inset: 3px;
          background: ${P.accent};
          border-radius: 50%;
        }
        .dist-option-title {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 1.15rem;
          color: ${P.fg};
        }
        .dist-option.selected .dist-option-title { color: ${P.accent}; }
        .dist-option-desc {
          font-size: 0.92rem;
          line-height: 1.5;
          color: ${P.fgDim};
          padding-left: 30px;
        }

        /* ── PASSO 5: tratamento ── */
        .treat-slider {
          margin-bottom: 22px;
        }
        .treat-slider-head {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 10px;
        }
        .treat-slider-name {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 1.15rem;
          color: ${P.fg};
        }
        .treat-slider-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: ${P.accent};
          letter-spacing: 0.1em;
        }
        .treat-slider-desc {
          font-size: 0.82rem;
          color: ${P.fgDim};
          line-height: 1.4;
          margin-top: 4px;
        }
        .treat-slider input[type=range] {
          width: 100%;
          appearance: none; -webkit-appearance: none;
          background: ${P.line};
          height: 3px;
          cursor: pointer;
        }
        .treat-slider input[type=range]::-webkit-slider-thumb {
          appearance: none; -webkit-appearance: none;
          width: 18px; height: 18px;
          background: ${P.accent};
          border-radius: 50%; cursor: pointer;
        }
        .treat-slider input[type=range]::-moz-range-thumb {
          width: 18px; height: 18px;
          background: ${P.accent};
          border-radius: 50%; cursor: pointer; border: none;
        }

        /* ── PASSO 6: resultado ── */
        .result-box {
          padding: 36px 28px;
          background: ${P.bgCard};
          border: 1px solid ${P.lineStrong};
          border-top: 3px solid ${P.ok};
          margin-bottom: 24px;
          text-align: center;
        }
        .result-icon {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 3.5rem;
          color: ${P.ok};
          line-height: 1;
          margin-bottom: 10px;
        }
        .result-title {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 1.8rem;
          margin-bottom: 18px;
        }
        .result-audio audio {
          width: 100%; margin-bottom: 20px;
        }
        .result-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: ${P.fgDim};
          margin-top: 14px;
        }

        .rendering-overlay {
          padding: 50px 20px;
          text-align: center;
          background: ${P.bgCard};
          border: 1px solid ${P.lineStrong};
          margin-bottom: 22px;
        }
        .rendering-icon {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 3rem;
          color: ${P.accent};
          animation: spin 2s linear infinite;
          display: inline-block;
        }
        .rendering-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          color: ${P.fgDim};
          text-transform: uppercase;
          margin-top: 18px;
        }
        .rendering-text-detail {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 1rem;
          color: ${P.fg};
          margin-top: 14px;
        }

        /* ── BOTÕES ── */
        .btn {
          padding: 14px 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          cursor: pointer;
          border: 1.5px solid;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-primary {
          background: ${P.accent};
          color: ${P.bg};
          border-color: ${P.accent};
        }
        .btn-primary:hover:not(:disabled) {
          background: ${P.accentDeep};
          border-color: ${P.accentDeep};
        }
        .btn-primary:disabled {
          opacity: 0.4; cursor: not-allowed;
        }
        .btn-secondary {
          background: none;
          color: ${P.fg};
          border-color: ${P.fg};
        }
        .btn-secondary:hover {
          background: ${P.fg};
          color: ${P.bg};
        }
        .btn-ghost {
          background: none;
          color: ${P.fgDim};
          border-color: ${P.line};
        }
        .btn-ghost:hover {
          color: ${P.accent};
          border-color: ${P.accent};
        }
        .btn-rec {
          background: ${P.rec};
          color: ${P.bg};
          border-color: ${P.rec};
        }
        .btn-rec:hover { opacity: 0.85; }
        .btn-rec .dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: ${P.bg};
          animation: blink 1.4s infinite;
        }

        /* ── NAVEGAÇÃO INFERIOR ── */
        .nav {
          display: flex; gap: 12px; justify-content: space-between;
          margin-top: 36px; padding-top: 26px;
          border-top: 1px solid ${P.line};
        }

        .notice {
          padding: 12px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          margin-bottom: 18px;
          border-left: 3px solid;
        }
        .notice.info { color: ${P.accent}; border-color: ${P.accent}; background: rgba(255,184,0,0.05); }
        .notice.error { color: ${P.rec}; border-color: ${P.rec}; background: rgba(255,51,102,0.06); }

        audio:not(.visible-audio) { display: none; }

        @media (max-width: 600px) {
          .container { padding: 22px 14px 50px; }
          .nav { flex-direction: column-reverse; }
          .nav .btn { width: 100%; }
          .progress-labels { font-size: 0.52rem; gap: 4px; }
          .progress { gap: 4px; }
        }
      `}</style>

      <div className="noise" />

      <div className="app">
        <div className="container">
          {/* HEADER */}
          <div className="header">
            <h1>
              estúdio <em>guiado</em>
            </h1>
            <div className="sub">sua voz · sua música · seis passos</div>
          </div>

          {/* PROGRESS BAR */}
          <div className="progress">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className={`progress-step ${
                  s.n === step ? "active" : s.n < step ? "done" : ""
                }`}
              />
            ))}
          </div>
          <div className="progress-labels">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className={`progress-label ${
                  s.n === step ? "active" : s.n < step ? "done" : ""
                }`}
              >
                {s.n}. {s.label}
              </div>
            ))}
          </div>

          {notice && <div className={`notice ${notice.type}`}>{notice.msg}</div>}

          {/* ═══════════════════════════════════════════════════════════════
              PASSO 1 — CARREGAR MÚSICA
              ═══════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="step">
              <div className="step-header">
                <div className="step-number">Passo 1 de 6</div>
                <h2 className="step-title">Carregue sua música</h2>
                <p className="step-instruction">
                  Comece pelo arquivo da música que você quer que receba sua voz.
                  Pode ser um arquivo de <strong>áudio</strong> (MP3, WAV, M4A)
                  ou um <strong>vídeo</strong> com som. Arraste para a área
                  abaixo, ou clique para escolher do seu dispositivo.
                </p>
              </div>

              {!musicFile ? (
                <div
                  className={`drop ${dragOver ? "over" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files?.[0])
                      handleMusicFile(e.dataTransfer.files[0]);
                  }}
                >
                  <div className="drop-icon">∽</div>
                  <div className="drop-text">
                    {dragOver
                      ? "Solte aqui"
                      : "Arraste o arquivo ou clique para escolher"}
                  </div>
                  <div className="drop-sub">áudio · vídeo</div>
                </div>
              ) : (
                <div className="music-loaded">
                  <div className="icon">♪</div>
                  <div className="info">
                    <div className="name">{musicFile.name}</div>
                    <div className="meta">
                      {analysis
                        ? `${fmtTime(analysis.duration)} · pronto`
                        : analyzing
                        ? "analisando…"
                        : "—"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (musicUrl) URL.revokeObjectURL(musicUrl);
                      setMusicFile(null);
                      setMusicUrl(null);
                      setAnalysis(null);
                    }}
                  >
                    trocar
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*"
                hidden
                onChange={(e) => {
                  if (e.target.files?.[0]) handleMusicFile(e.target.files[0]);
                  e.target.value = "";
                }}
              />

              {analyzing && (
                <div className="analyzing">
                  escutando sua música, calculando o caráter…
                </div>
              )}

              {analysis && !analyzing && (
                <div className="analysis-result">
                  <div className="label">análise concluída</div>
                  <div className="body">
                    Duração: <strong>{fmtTime(analysis.duration)}</strong> ·
                    Pulso: <strong>{analysis.onsetsPerMin.toFixed(0)}</strong>{" "}
                    acentos/min · Intensidade:{" "}
                    <strong>
                      {analysis.rms > 0.15
                        ? "cheia"
                        : analysis.rms > 0.07
                        ? "média"
                        : "contida"}
                    </strong>
                    <br />
                    <span style={{ opacity: 0.85, fontStyle: "italic" }}>
                      Pronto para o próximo passo.
                    </span>
                  </div>
                </div>
              )}

              <div className="nav">
                <div></div>
                <button
                  className="btn btn-primary"
                  onClick={goNext}
                  disabled={!canAdvance()}
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              PASSO 2 — GERAR FRASE
              ═══════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="step">
              <div className="step-header">
                <div className="step-number">Passo 2 de 6</div>
                <h2 className="step-title">A frase que você vai ler</h2>
                <p className="step-instruction">
                  Eu vou gerar uma frase poética curta para você ler em voz alta
                  sobre sua música. Se quiser, escreva em uma linha o que essa
                  música está dizendo para você — vai ajudar a frase a sair mais
                  próxima do que você sente. <strong>Pode deixar em branco</strong>
                  , e eu interpreto pelo caráter da música.
                </p>
              </div>

              <div className="intent-field">
                <label>O que esta música está dizendo? (opcional)</label>
                <input
                  type="text"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  placeholder="ex: travessia silenciosa  ·  raiva que vira beleza"
                  maxLength={140}
                />
                <div className="hint">
                  Uma linha, livre. Ou nada — funciona também.
                </div>
              </div>

              {!phrase && !phraseManual && !generating && (
                <div style={{ textAlign: "center", margin: "30px 0" }}>
                  <button className="btn btn-primary" onClick={requestPhrase}>
                    Gerar frase
                  </button>
                </div>
              )}

              {generating && (
                <div className="phrase-box">
                  <div className="phrase-generating">criando sua frase…</div>
                </div>
              )}

              {phrase && !generating && (
                <>
                  <div className="phrase-box">
                    <div className="phrase-text">"{phrase}"</div>
                  </div>
                  <div className="phrase-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={requestPhrase}
                      disabled={generating}
                    >
                      ↻ Gerar outra
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setPhraseManual(true)}
                    >
                      Reescrever na minha letra
                    </button>
                  </div>
                </>
              )}

              {phraseManual && (
                <div className="manual-phrase">
                  <label
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: P.fgDim,
                      display: "block",
                      marginBottom: 10,
                    }}
                  >
                    Sua frase
                  </label>
                  <textarea
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    placeholder="Escreva aqui a frase que você vai ler…"
                  />
                </div>
              )}

              <div className="nav">
                <button className="btn btn-ghost" onClick={goBack}>
                  ← Voltar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={goNext}
                  disabled={!canAdvance()}
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              PASSO 3 — GRAVAR VOZ
              ═══════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="step">
              <div className="step-header">
                <div className="step-number">Passo 3 de 6</div>
                <h2 className="step-title">Grave sua voz</h2>
                <p className="step-instruction">
                  Coloque seus <strong>fones de ouvido</strong>. Quando estiver
                  pronta, clique em <strong>iniciar</strong>. Você verá uma
                  contagem de 3 segundos. Depois a música começa a tocar e o
                  microfone começa a gravar. Você lê a frase do jeito que quiser
                  — cantando, falando, sussurrando, gritando. Pode regravar
                  quantas vezes precisar.
                </p>
              </div>

              <div className="phrase-display">
                <div className="label">sua frase para ler</div>
                <div className="text">"{phrase}"</div>
              </div>

              {recState === "idle" && (
                <>
                  <div className="rec-warning">
                    <strong>Importante:</strong> use fones de ouvido. Sem eles, a
                    música vaza pelo microfone e contamina sua voz. Se você não
                    tem fones agora, ainda funciona — só o resultado será menos
                    limpo.
                  </div>

                  {micError && <div className="mic-error">⚠ {micError}</div>}

                  <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <button className="btn btn-rec" onClick={startCountdown}>
                      <span className="dot" />
                      Iniciar gravação
                    </button>
                  </div>
                </>
              )}

              {recState === "countdown" && (
                <div className="rec-countdown">
                  <div className="rec-countdown-num">
                    {recCountdown || "•"}
                  </div>
                  <div className="rec-countdown-sub">
                    {recCountdown > 0 ? "respira" : "começou"}
                  </div>
                </div>
              )}

              {recState === "recording" && (
                <>
                  <div className="rec-canvas-wrap">
                    <span className="rec-timer live">
                      {fmtTimeMs(recTime)}
                    </span>
                    <canvas
                      ref={recCanvasRef}
                      className="rec-canvas"
                      width={680}
                      height={130}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <button className="btn btn-rec" onClick={stopRecording}>
                      ■ Parar gravação
                    </button>
                  </div>
                </>
              )}

              {recState === "preview" && (
                <div className="rec-preview">
                  <div className="rec-preview-info">
                    ✓ Tomada gravada · {fmtTimeMs(recTime)}
                  </div>
                  {voiceUrl && (
                    <audio
                      src={voiceUrl}
                      controls
                      className="visible-audio"
                      style={{ width: "100%", marginBottom: 14 }}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <button className="btn btn-ghost" onClick={redoRecording}>
                      ↻ Regravar
                    </button>
                  </div>
                </div>
              )}

              <audio ref={baseAudioRef} />

              <div className="nav">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    cleanupMic();
                    goBack();
                  }}
                >
                  ← Voltar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    cleanupMic();
                    goNext();
                  }}
                  disabled={!canAdvance()}
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              PASSO 4 — DISTRIBUIÇÃO
              ═══════════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="step">
              <div className="step-header">
                <div className="step-number">Passo 4 de 6</div>
                <h2 className="step-title">Como sua voz vai aparecer</h2>
                <p className="step-instruction">
                  Sua leitura de{" "}
                  <strong>{fmtTimeMs(voiceDuration || recTime)}</strong> vai ser
                  distribuída ao longo dos{" "}
                  <strong>{fmtTime(analysis?.duration || 0)}</strong> da música.
                  Escolha como você quer que ela apareça. Você pode trocar
                  depois se não gostar.
                </p>
              </div>

              <div className="dist-options">
                {DISTRIBUTIONS.map((d) => (
                  <div
                    key={d.id}
                    className={`dist-option ${
                      distribution === d.id ? "selected" : ""
                    }`}
                    onClick={() => setDistribution(d.id)}
                  >
                    <div className="dist-option-head">
                      <div className="dist-radio" />
                      <div className="dist-option-title">{d.title}</div>
                    </div>
                    <div className="dist-option-desc">{d.desc}</div>
                  </div>
                ))}
              </div>

              <div className="nav">
                <button className="btn btn-ghost" onClick={goBack}>
                  ← Voltar
                </button>
                <button className="btn btn-primary" onClick={goNext}>
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              PASSO 5 — TRATAMENTO
              ═══════════════════════════════════════════════════════════════ */}
          {step === 5 && (
            <div className="step">
              <div className="step-header">
                <div className="step-number">Passo 5 de 6</div>
                <h2 className="step-title">Correção mínima</h2>
                <p className="step-instruction">
                  Pequenos ajustes na sua voz — nada que mude o que ela é, só
                  que a faça soar com mais <strong>corpo, brilho e estabilidade</strong>.
                  Os valores já estão num ponto seguro. Mexa só se sentir
                  vontade. Quando renderizar, isso será aplicado.
                </p>
              </div>

              <TreatSlider
                name="Brilho"
                desc="Realça frequências altas — sua voz fica mais clara, mais presente nos detalhes."
                value={treatment.brilho}
                onChange={(v) => setTreatment({ ...treatment, brilho: v })}
              />
              <TreatSlider
                name="Corpo"
                desc="Realça frequências graves-médias — sua voz ganha peso e profundidade."
                value={treatment.corpo}
                onChange={(v) => setTreatment({ ...treatment, corpo: v })}
              />
              <TreatSlider
                name="Espaço"
                desc="Adiciona reverb sutil — sua voz parece estar num lugar, não numa caixa seca."
                value={treatment.espaco}
                onChange={(v) => setTreatment({ ...treatment, espaco: v })}
              />
              <TreatSlider
                name="Estabilidade"
                desc="Compressão suave — iguala a dinâmica entre passagens fortes e fracas."
                value={treatment.estabilidade}
                onChange={(v) => setTreatment({ ...treatment, estabilidade: v })}
              />
              <TreatSlider
                name="Limpeza"
                desc="Remove graves baixos indesejados — ruído de ambiente, respiração pesada."
                value={treatment.limpeza}
                onChange={(v) => setTreatment({ ...treatment, limpeza: v })}
              />

              <div className="nav">
                <button className="btn btn-ghost" onClick={goBack}>
                  ← Voltar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={goNext}
                  disabled={rendering}
                >
                  {rendering ? "Renderizando…" : "Renderizar WAV final →"}
                </button>
              </div>

              {rendering && (
                <div className="rendering-overlay" style={{ marginTop: 24 }}>
                  <div className="rendering-icon">◐</div>
                  <div className="rendering-text">renderizando…</div>
                  <div className="rendering-text-detail">
                    Misturando sua voz com a música, aplicando o tratamento,
                    montando o WAV. Isso leva alguns segundos.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              PASSO 6 — RESULTADO
              ═══════════════════════════════════════════════════════════════ */}
          {step === 6 && (
            <div className="step">
              <div className="step-header">
                <div className="step-number">Passo 6 de 6</div>
                <h2 className="step-title">Pronto.</h2>
                <p className="step-instruction">
                  Sua música com sua voz dentro. Você pode ouvir aqui, baixar em
                  <strong> WAV</strong> para levar a qualquer programa, ou
                  começar tudo de novo com outra música.
                </p>
              </div>

              <div className="result-box">
                <div className="result-icon">∽</div>
                <div className="result-title">"{phrase}"</div>
                {finalUrl && (
                  <div className="result-audio">
                    <audio
                      src={finalUrl}
                      controls
                      className="visible-audio"
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                <div className="result-meta">
                  WAV · estéreo · 44.1kHz ·{" "}
                  {finalBlob
                    ? (finalBlob.size / 1048576).toFixed(2) + " MB"
                    : "—"}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <button className="btn btn-primary" onClick={downloadFinal}>
                  ↓ Baixar WAV
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setStep(5)}
                >
                  ← Ajustar correção
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setStep(4)}
                >
                  ← Mudar distribuição
                </button>
                <button className="btn btn-ghost" onClick={restart}>
                  ↻ Começar com outra música
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTE AUXILIAR: SLIDER DE TRATAMENTO
   ═══════════════════════════════════════════════════════════════════════════ */
function TreatSlider({ name, desc, value, onChange }) {
  return (
    <div className="treat-slider">
      <div className="treat-slider-head">
        <span className="treat-slider-name">{name}</span>
        <span className="treat-slider-val">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
      <div className="treat-slider-desc">{desc}</div>
    </div>
  );
}
