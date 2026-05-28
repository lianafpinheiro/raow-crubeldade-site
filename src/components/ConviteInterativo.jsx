import React, { useState, useEffect, useRef } from 'react';

const ConviteInterativo = () => {
  const [nomeConvidado, setNomeConvidado] = useState('Kallyni');
  const canvasRef = useRef(null);
  const bgImageRef = useRef(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Configurações do convite
  const config = {
    bgSrc: '/assets/convite_base_sem_nome.png',
    nameY: 620,
    nameMaxWidth: 640, // 800 * 0.8
    canvasWidth: 800,
    canvasHeight: 1200,
    fontSize: 90,
    minFontSize: 50,
    fontFamily: '"Pinyon Script", "Playfair Display", serif',
    textColor: '#f3d9a4',
    shadowColor: 'rgba(0, 0, 0, 0.85)',
    shadowBlur: 18
  };

  // Carregar imagem de fundo
  useEffect(() => {
    const img = new Image();
    img.src = config.bgSrc;
    img.onload = () => {
      bgImageRef.current = img;
      setBgLoaded(true);
    };
    img.onerror = () => {
      console.warn('Não foi possível carregar a imagem de fundo:', config.bgSrc);
      setBgLoaded(false);
    };
  }, []);

  // Renderizar convite no canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Limpar canvas
    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Desenhar fundo
    if (bgLoaded && bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, config.canvasWidth, config.canvasHeight);
    } else {
      // Fallback: gradiente celestial
      const grad = ctx.createLinearGradient(0, 0, 0, config.canvasHeight);
      grad.addColorStop(0, '#071b33');
      grad.addColorStop(0.5, '#020614');
      grad.addColorStop(1, '#050814');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

      // Adicionar estrelas no fallback
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * config.canvasWidth;
        const y = Math.random() * config.canvasHeight;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Configurar texto
    const nome = nomeConvidado.trim() || 'Kallyni';
    ctx.font = `${config.fontSize}px ${config.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Ajustar tamanho da fonte se necessário
    let scaledFontSize = config.fontSize;
    let textWidth = ctx.measureText(nome).width;

    if (textWidth > config.nameMaxWidth) {
      const scale = config.nameMaxWidth / textWidth;
      scaledFontSize = Math.max(config.minFontSize, config.fontSize * scale);
      ctx.font = `${scaledFontSize}px ${config.fontFamily}`;
    }

    // Estilo do texto
    ctx.fillStyle = config.textColor;
    ctx.shadowColor = config.shadowColor;
    ctx.shadowBlur = config.shadowBlur;

    // Desenhar nome
    const centerX = config.canvasWidth / 2;
    ctx.fillText(nome, centerX, config.nameY);

  }, [nomeConvidado, bgLoaded]);

  // Fazer download do convite
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    const nomeArquivo = (nomeConvidado.trim() || 'kallyni').replace(/\s+/g, '_');
    link.download = `convite_${nomeArquivo}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b2447] via-[#050c1a] to-[#020514] text-[#e8edf7] py-12 px-6">
      {/* Estrelas de fundo */}
      <div className="fixed inset-0 pointer-events-none opacity-50 z-0"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20% 20%, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(1.5px 1.5px at 70% 30%, rgba(255, 255, 255, 0.5), transparent),
            radial-gradient(2px 2px at 40% 80%, rgba(255, 255, 255, 0.4), transparent),
            radial-gradient(1px 1px at 80% 70%, rgba(255, 255, 255, 0.6), transparent)
          `
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-[#0b2349]/96 to-[#04081490]/98 rounded-3xl border border-[#f3d9a4]/20 shadow-[0_30px_80px_rgba(0,0,0,0.8)] p-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda - Formulário */}
            <div className="flex flex-col gap-6 justify-center">
              <div>
                <h1 className="text-3xl font-bold tracking-[0.12em] uppercase text-[#f7c76b] mb-2"
                  style={{ textShadow: '0 0 18px rgba(0, 0, 0, 0.8)' }}>
                  Convite Interativo
                </h1>
                <h2 className="text-4xl text-[#f3d9a4] mt-2"
                  style={{ fontFamily: "'Pinyon Script', cursive" }}>
                  Kallyni — A Canção do Céu Azul
                </h2>
              </div>

              <p className="text-base leading-relaxed opacity-90 max-w-md">
                Personalize o nome no convite em tempo real e faça o download da sua versão em alta resolução,
                com o brilho exato de uma noite estrelada de gala.
              </p>

              <div className="space-y-3">
                <label htmlFor="nome-input" className="block text-sm uppercase tracking-[0.14em] text-[#f5e6c9]/90">
                  Nome para aparecer no convite
                </label>

                <div className="flex flex-wrap gap-3">
                  <input
                    id="nome-input"
                    type="text"
                    maxLength={40}
                    value={nomeConvidado}
                    onChange={(e) => setNomeConvidado(e.target.value)}
                    placeholder="Digite o nome aqui"
                    className="flex-1 min-w-[200px] px-4 py-2.5 rounded-full border border-[#f3d9a4]/35 bg-[#020814]/85 text-[#e8edf7] outline-none transition-all focus:border-[#f7c76b] focus:bg-[#081022]/92 focus:shadow-[0_0_0_1px_rgba(247,199,107,0.45)]"
                  />

                  <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-br from-[#ffe6b0] to-[#f3b75d] text-[#050612] font-semibold text-sm uppercase tracking-[0.13em] shadow-[0_10px_26px_rgba(0,0,0,0.75)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.9)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    ✨ Gerar meu convite
                  </button>
                </div>

                <p className="text-xs opacity-70 mt-2">
                  Dica: teste variações — "Kallyni", "Kallyni Vitória", "Família Frasson Pinheiro"… o céu é o limite.
                </p>
              </div>
            </div>

            {/* Coluna Direita - Preview */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-gradient-to-b from-white/6 to-transparent rounded-2xl p-4 border border-[#f3d9a4]/20 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.7)] max-w-md w-full">
                <canvas
                  ref={canvasRef}
                  width={config.canvasWidth}
                  height={config.canvasHeight}
                  className="w-full h-auto rounded-xl bg-[#02040a]"
                />
              </div>

              <p className="text-xs text-center opacity-75 max-w-md">
                Pré-visualização do convite personalizado. A imagem final será gerada em PNG.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConviteInterativo;
