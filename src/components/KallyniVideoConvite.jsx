import React, { useState, useEffect } from 'react';

const KallyniVideoConvite = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Duração de cada cena em segundos (total: 90s)
  const sceneDurations = [8, 10, 10, 12, 15, 20, 15]; // CENAS 1-7
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newProgress = (elapsed / totalDuration) * 100;

      if (newProgress >= 100) {
        setIsPlaying(false);
        setProgress(0);
        setCurrentScene(0);
        clearInterval(interval);
        return;
      }

      setProgress(newProgress);

      let accumulated = 0;
      for (let i = 0; i < sceneDurations.length; i++) {
        accumulated += sceneDurations[i];
        if (elapsed < accumulated) {
          setCurrentScene(i);
          break;
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentScene(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleWhatsAppRSVP = () => {
    window.open('https://wa.me/5554996381003?text=Ol%C3%A1!%20Confirmo%20minha%20presen%C3%A7a%20nos%2015%20anos%20da%20Kallyni%20%F0%9F%8E%89', '_blank');
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0B5B5E] via-[#06373A] to-[#0B5B5E] overflow-hidden flex items-center justify-center p-4">
      {/* Container do vídeo vertical (Stories) */}
      <div className="relative w-full max-w-[375px] h-[812px] bg-[#0B5B5E] shadow-2xl rounded-3xl overflow-hidden">

        {/* CENA 1: Fade In do Azul Celeste + Gotas de Orvalho (0-8s) */}
        {currentScene === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: 'fadeIn 3s ease-in-out',
              background: 'radial-gradient(circle at 50% 30%, #0B5B5E 0%, #06373A 100%)'
            }}
          >
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-[#FFD700] opacity-60"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 3 + 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            <div className="relative">
              <div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-[#FFD700]/10 backdrop-blur-sm"
                style={{
                  animation: 'pulse 2s ease-in-out infinite',
                  boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md" />
              </div>
            </div>

            <div className="absolute bottom-32 text-center px-8 animate-fadeIn">
              <p className="text-white/80 text-lg italic font-light">
                No silêncio azul do amanhecer,
              </p>
              <p className="text-white/80 text-lg italic font-light mt-2">
                nasce um convite feito de luz e sonho.
              </p>
            </div>
          </div>
        )}

        {/* CENA 2: Envelope Materializando com Selo K (8-18s) */}
        {currentScene === 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0B5B5E] to-[#06373A]">
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-[#FFD700]"
                  style={{
                    width: '3px',
                    height: '3px',
                    top: '50%',
                    left: '50%',
                    animation: `orbit ${Math.random() * 4 + 4}s linear infinite`,
                    animationDelay: `${i * 0.1}s`,
                    '--orbit-radius': `${Math.random() * 150 + 100}px`,
                    '--orbit-angle': `${(i * 360) / 30}deg`
                  }}
                />
              ))}
            </div>

            <div
              className="relative"
              style={{
                animation: 'scaleRotate 5s ease-in-out',
                transformStyle: 'preserve-3d'
              }}
            >
              <div
                className="w-80 h-56 rounded-2xl shadow-2xl relative"
                style={{
                  background: 'linear-gradient(135deg, #1A7A7F 0%, #0B5B5E 100%)',
                  transform: 'rotateY(-15deg) rotateX(5deg)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-24"
                  style={{
                    background: 'linear-gradient(180deg, #134F52 0%, #0B5B5E 100%)',
                    clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                  }}
                />

                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: 'sealGlow 2s ease-in-out infinite'
                  }}
                >
                  <div
                    className="w-24 h-24 rounded-full relative"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #FFE68F 0%, #FFD700 50%, #B8860B 100%)',
                      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.6), inset 0 -2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-5xl font-bold"
                        style={{
                          fontFamily: 'Georgia, serif',
                          color: '#D4AF37',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.4), -1px -1px 2px rgba(255,255,255,0.3)',
                          transform: 'scale(1.1)'
                        }}
                      >
                        K
                      </span>
                    </div>

                    <div className="absolute inset-0" style={{ fontSize: '8px' }}>
                      {[0, 90, 180, 270].map((angle, i) => (
                        <div
                          key={i}
                          className="absolute text-[#D4AF37]"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${angle}deg) translate(32px, -50%)`,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          ❧
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-24 text-center px-8 animate-fadeIn">
              <p className="text-white/90 text-lg italic font-light">
                Cada passo desenha esperança na areia,
              </p>
              <p className="text-white/90 text-lg italic font-light mt-2">
                enquanto o vento sussurra promessas de encontro.
              </p>
            </div>
          </div>
        )}

        {/* CENA 3: Explosão de Luz do Selo (18-28s) */}
        {currentScene === 2 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white via-[#FFD700] to-[#0B5B5E]">
            <div className="absolute inset-0">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 origin-left"
                  style={{
                    width: '400px',
                    height: '4px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,215,0,0.5) 50%, transparent 100%)',
                    transform: `rotate(${(i * 360) / 16}deg)`,
                    animation: 'rayPulse 2s ease-in-out infinite',
                    animationDelay: `${i * 0.05}s`,
                    filter: 'blur(2px)'
                  }}
                />
              ))}
            </div>

            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/50"
                style={{
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`,
                  animation: `expandFade ${2 + i * 0.3}s ease-out infinite`,
                  animationDelay: `${i * 0.4}s`
                }}
              />
            ))}

            <div
              className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, #FFFFFF 0%, #FFD700 50%, #D4AF37 100%)',
                boxShadow: '0 0 60px rgba(255,255,255,1), 0 0 100px rgba(255,215,0,0.8)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            >
              <span
                className="text-7xl font-bold"
                style={{
                  fontFamily: 'Georgia, serif',
                  color: '#B8860B',
                  textShadow: '0 0 20px rgba(255,255,255,0.8)'
                }}
              >
                K
              </span>
            </div>

            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-r from-white to-[#FFD700]"
                  style={{
                    width: `${Math.random() * 8 + 3}px`,
                    height: `${Math.random() * 8 + 3}px`,
                    top: '50%',
                    left: '50%',
                    animation: `explode ${Math.random() * 2 + 1}s ease-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                    '--angle': `${Math.random() * 360}deg`,
                    '--distance': `${Math.random() * 300 + 100}px`
                  }}
                />
              ))}
            </div>

            <div className="absolute bottom-24 text-center px-8 z-10">
              <p className="text-[#0B5B5E] text-xl font-semibold italic drop-shadow-lg">
                De mãos abertas, deixo voar o desejo:
              </p>
              <p className="text-[#0B5B5E] text-xl font-semibold italic mt-2 drop-shadow-lg">
                que todos possam ouvir a canção do céu azul.
              </p>
            </div>
          </div>
        )}

        {/* CENA 4: Nome Kallyni em Tipografia Script (28-40s) */}
        {currentScene === 3 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#06373A] via-[#0B5B5E] to-[#06373A]">
            <div className="absolute inset-0">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.8 + 0.2,
                    animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center">
              <h1
                className="text-8xl font-bold mb-6"
                style={{
                  fontFamily: "'Brush Script MT', cursive",
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(255,215,0,0.5)',
                  animation: 'shimmer 3s ease-in-out infinite, letterReveal 2s ease-out forwards',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                }}
              >
                Kallyni
              </h1>

              <div className="flex items-center justify-center my-6 gap-4">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#FFD700]" />
                <div
                  className="w-4 h-4 rounded-full bg-[#FFD700]"
                  style={{
                    boxShadow: '0 0 20px rgba(255,215,0,0.8)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#FFD700]" />
              </div>

              <p
                className="text-3xl tracking-widest text-[#FFD700]"
                style={{
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 2px 10px rgba(255,215,0,0.4)',
                  animation: 'fadeIn 2s ease-in 1s forwards',
                  opacity: 0
                }}
              >
                MEUS 15 ANOS
              </p>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-[#FFD700]"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    top: `${30 + Math.random() * 40}%`,
                    left: `${10 + Math.random() * 80}%`,
                    animation: `floatUpDown ${Math.random() * 4 + 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: Math.random() * 0.6 + 0.4,
                    filter: 'blur(1px)'
                  }}
                />
              ))}
            </div>

            <div className="absolute bottom-32 text-center px-8 animate-fadeIn">
              <p className="text-white/80 text-lg italic font-light">
                Olhos que buscam o infinito,
              </p>
              <p className="text-white/80 text-lg italic font-light mt-2">
                coração aberto ao azul que canta.
              </p>
            </div>
          </div>
        )}

        {/* CENA 5: Convite Formal com Detalhes REAIS (40-55s) */}
        {currentScene === 4 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0B5B5E] to-[#06373A] overflow-y-auto">
            <div
              className="relative w-[90%] max-w-[340px] rounded-2xl shadow-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, #0B5B5E 0%, #1A7A7F 100%)',
                transform: 'perspective(1000px) rotateY(-5deg)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,215,0,0.3)',
                animation: 'cardFloat 4s ease-in-out infinite',
                minHeight: '600px'
              }}
            >
              <div className="text-center mb-4">
                <div className="text-[#FFD700] text-2xl mb-3" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>
                  ❧ ❦ ❧
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-[#FFD700] text-xs tracking-widest font-light">
                  VOCÊ É ESPECIALMENTE CONVIDADO
                </p>

                <h2
                  className="text-5xl font-bold my-3"
                  style={{
                    fontFamily: "'Brush Script MT', cursive",
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(255,215,0,0.3)'
                  }}
                >
                  Kallyni
                </h2>

                <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

                <p className="text-white text-xl font-light mt-3">
                  MEUS 15 ANOS
                </p>

                <div className="space-y-2 mt-4 text-white/90 text-sm">
                  <div className="flex items-start justify-center gap-2">
                    <span className="text-[#FFD700] text-lg">📅</span>
                    <p className="text-base">20 de Dezembro de 2025</p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[#FFD700] text-lg">🕐</span>
                    <p className="text-base">19h30</p>
                  </div>

                  <div className="flex items-start justify-center gap-2">
                    <span className="text-[#FFD700] text-lg">📍</span>
                    <div className="text-center">
                      <p className="text-base font-semibold">Cantina Nostra</p>
                      <p className="text-xs text-white/70">Rua 10 de Novembro</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/80 space-y-2">
                  <p className="font-semibold text-[#FFD700]">
                    📱 Confirme sua presença:
                  </p>
                  <p>
                    +55 54 99638-1003
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="italic text-white/90 leading-relaxed">
                      Meu maior presente é sua presença
                    </p>
                    <p className="text-[10px] text-white/70 mt-1">
                      Se desejar me presentear, aceito com carinho contribuições via mesmo número
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 text-center">
                <div className="text-[#FFD700] text-xl" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>
                  ❧ ❦ ❧
                </div>
              </div>

              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, rgba(255,215,0,0.2) 0%, transparent 50%)',
                  animation: 'borderGlow 3s ease-in-out infinite'
                }}
              />
            </div>

            <div className="absolute inset-0">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-[#FFD700]"
                  style={{
                    width: '3px',
                    height: '3px',
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: 0.6
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* CENA 6: Mensagem Poética (55-75s) */}
        {currentScene === 5 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#06373A] via-[#0B5B5E] to-[#06373A]">
            <div className="absolute inset-0">
              {[...Array(150)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 2.5 + 0.5}px`,
                    height: `${Math.random() * 2.5 + 0.5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random(),
                    animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            <div
              className="absolute top-1/4 w-40 h-40 rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #FFE68F 0%, #FFD700 40%, #D4AF37 100%)',
                boxShadow: '0 20px 60px rgba(255,215,0,0.6), inset 0 -4px 12px rgba(0,0,0,0.3)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-7xl font-bold"
                  style={{
                    fontFamily: 'Georgia, serif',
                    color: '#B8860B',
                    textShadow: '2px 2px 6px rgba(0,0,0,0.5), -1px -1px 3px rgba(255,255,255,0.3)'
                  }}
                >
                  K
                </span>
              </div>
            </div>

            <div className="relative z-10 text-center px-8 mt-32">
              <div className="space-y-6">
                <p
                  className="text-white text-2xl italic font-light leading-relaxed"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    animation: 'fadeInUp 2s ease-out forwards'
                  }}
                >
                  Entre estrelas, sonhos e risos,
                </p>
                <p
                  className="text-white text-2xl italic font-light leading-relaxed"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    animation: 'fadeInUp 2s ease-out 0.5s forwards',
                    opacity: 0
                  }}
                >
                  te espero para celebrar
                </p>
                <p
                  className="text-white text-2xl italic font-light leading-relaxed"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    animation: 'fadeInUp 2s ease-out 1s forwards',
                    opacity: 0
                  }}
                >
                  este momento mágico.
                </p>

                <div className="flex justify-center mt-8">
                  <div
                    className="w-6 h-6 text-[#FFD700] text-2xl"
                    style={{
                      animation: 'pulse 2s ease-in-out infinite 1.5s',
                      filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))',
                      opacity: 0,
                      animationFillMode: 'forwards'
                    }}
                  >
                    ✦
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-[#FFD700]"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    top: '-5%',
                    left: `${Math.random() * 100}%`,
                    animation: `fall ${Math.random() * 8 + 5}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random() * 0.6 + 0.3
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* CENA 7: Encerramento Épico com CTA WhatsApp (75-90s) */}
        {currentScene === 6 && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#06373A] via-[#0B5B5E] to-black">
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-32 opacity-20"
                  style={{
                    background: `radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                    top: `${i * 20}%`,
                    animation: `cloudMove ${15 - i * 2}s linear infinite`,
                    animationDelay: `${i * 2}s`
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0">
              {[...Array(200)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 3 + 0.5}px`,
                    height: `${Math.random() * 3 + 0.5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random(),
                    animation: `twinkle ${Math.random() * 3 + 1}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
              <div
                className="w-48 h-48 rounded-full relative"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #FFE68F 0%, #FFD700 40%, #D4AF37 100%)',
                  boxShadow: '0 30px 80px rgba(255,215,0,0.8), inset 0 -6px 16px rgba(0,0,0,0.4)',
                  animation: 'finalPulse 4s ease-in-out infinite'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-8xl font-bold"
                    style={{
                      fontFamily: 'Georgia, serif',
                      color: '#B8860B',
                      textShadow: '3px 3px 8px rgba(0,0,0,0.6), -2px -2px 4px rgba(255,255,255,0.4)'
                    }}
                  >
                    K
                  </span>
                </div>

                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: '0 0 60px rgba(255,215,0,0.6), 0 0 100px rgba(255,215,0,0.3)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-center w-full px-6 mt-8">
              <h2
                className="text-6xl font-bold mb-4"
                style={{
                  fontFamily: "'Brush Script MT', cursive",
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(255,215,0,0.6)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              >
                Kallyni
              </h2>

              <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-[#FFD700] to-transparent my-6" />

              <p className="text-white text-xl font-light mb-3 italic">
                A canção que nasce no céu,
              </p>
              <p className="text-white text-xl font-light italic mb-6">
                ecoa em cada coração.
              </p>

              <button
                onClick={handleWhatsAppRSVP}
                className="mt-6 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto"
                style={{
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              >
                <span className="text-2xl">💬</span>
                Confirmar Presença
              </button>

              <p className="text-white/60 text-sm mt-4">
                +55 54 99638-1003
              </p>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    background: `radial-gradient(circle, #FFD700 0%, #FFF8DC 100%)`,
                    top: '-10%',
                    left: `${Math.random() * 100}%`,
                    animation: `fall ${Math.random() * 6 + 4}s linear infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                    opacity: Math.random() * 0.8 + 0.2,
                    boxShadow: '0 0 8px rgba(255,215,0,0.8)'
                  }}
                />
              ))}
            </div>

            <div
              className="absolute inset-0 bg-black pointer-events-none"
              style={{
                animation: 'fadeInSlow 3s ease-in 12s forwards',
                opacity: 0
              }}
            />
          </div>
        )}

        {/* Controles */}
        <div className="absolute bottom-4 left-0 right-0 px-6 z-50">
          <div className="bg-white/20 h-1 rounded-full mb-3 backdrop-blur-sm">
            <div
              className="bg-[#FFD700] h-full rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={togglePlay}
            className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-[#FFD700] text-[#0B5B5E] hover:bg-white transition-all shadow-lg"
          >
            {isPlaying ? (
              <span className="text-2xl">⏸</span>
            ) : (
              <span className="text-2xl">▶</span>
            )}
          </button>

          <p className="text-center text-white/60 text-xs mt-2">
            Cena {currentScene + 1} de 7 • {Math.floor(progress)}%
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInSlow {
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes floatUpDown {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -30px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        @keyframes finalPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
          }
        }

        @keyframes scaleRotate {
          0% { transform: scale(0.3) rotateY(90deg) rotateX(20deg); opacity: 0; }
          50% { transform: scale(1.05) rotateY(-10deg) rotateX(3deg); }
          100% { transform: scale(1) rotateY(-15deg) rotateX(5deg); opacity: 1; }
        }

        @keyframes sealGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255,215,0,0.6)); }
          50% { filter: drop-shadow(0 0 25px rgba(255,215,0,0.9)); }
        }

        @keyframes rayPulse {
          0%, 100% { opacity: 0.6; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1.2); }
        }

        @keyframes expandFade {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance));
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        @keyframes letterReveal {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cardFloat {
          0%, 100% { transform: perspective(1000px) rotateY(-5deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-5deg) translateY(-10px); }
        }

        @keyframes borderGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes cloudMove {
          from { transform: translateX(-100%); }
          to { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default KallyniVideoConvite;
