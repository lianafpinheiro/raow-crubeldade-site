import React, { useState } from 'react';
import { Plus, ArrowLeft, Send, MapPin, Archive, Sparkles, Loader2, MessageSquare } from 'lucide-react';

const apiKey = ""; // A chave da API é injetada automaticamente pelo ambiente

const callGeminiWithRetry = async (prompt, retries = 5) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(Math.pow(2, i) * 1000);
    }
  }
};

const SkullIcon = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 C20 5 10 25 10 50 C10 70 20 80 25 90 L25 110 L35 110 L35 95 L45 95 L45 110 L55 110 L55 95 L65 95 L65 110 L75 110 L75 90 C80 80 90 70 90 50 C90 25 80 5 50 5 Z M30 60 C24 60 20 55 20 45 C20 35 24 30 30 30 C36 30 40 35 40 45 C40 55 36 60 30 60 Z M70 60 C64 60 60 55 60 45 C60 35 64 30 70 30 C76 30 80 35 80 45 C80 55 76 60 70 60 Z" fill="#E5D9C5"/>
    <path d="M 50 75 C 45 75 42 70 50 65 C 58 70 55 75 50 75 Z" fill="#1A1A1A"/>
    <path d="M -5 45 Q 15 50 30 65 Q 40 75 48 85" stroke="#991B1B" strokeWidth="3" fill="none" />
    <path d="M 0 35 Q 10 45 25 45 Q 10 35 0 35 Z" fill="#991B1B" />
    <circle cx="50" cy="95" r="4" fill="#991B1B" />
  </svg>
);

const MOCK_DATA = [
  {
    id: 1,
    text: "A louça na pia quando eu acordo.",
    mood: "Cômico",
    category: "Cotidiano",
    location: "São Paulo, SP",
    date: "14 Mai 2026"
  },
  {
    id: 2,
    text: "A sombra da minha barriga na parede depois de meses sentada escrevendo.",
    mood: "Neutro",
    category: "Corpo",
    location: "Prefiro não dizer",
    date: "15 Mai 2026"
  },
  {
    id: 3,
    text: "O silêncio absoluto depois que terminei um texto.",
    mood: "Pesado",
    category: "Memória",
    location: "Lisboa, Portugal",
    date: "16 Mai 2026"
  },
  {
    id: 4,
    text: "A TV sempre repetindo o mesmo episódio do podcast de mistério.",
    mood: "Medo",
    category: "Lugar",
    location: "Corredor de Casa",
    date: "17 Mai 2026"
  }
];

export default function HauntingThoughts() {
  const [view, setView] = useState('home');
  const [entries, setEntries] = useState(MOCK_DATA);
  const [toast, setToast] = useState(null);

  const [text, setText] = useState('');
  const [mood, setMood] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [isDesdobrando, setIsDesdobrando] = useState(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDesdobrar = async () => {
    if (!text.trim()) return;
    setIsDesdobrando(true);
    try {
      const prompt = `Você é um escritor melancólico, irônico e perspicaz, mestre em terror psicológico e cotidiano absurdo. O usuário vai te dizer o que o assombra de forma simples. Sua tarefa é reescrever ou expandir esse assombro em um parágrafo curto (máximo de 2 a 3 linhas). Deixe o texto poético, existencial ou levemente cômico e estranho. Mantenha em primeira pessoa, como se o usuário estivesse narrando. Assombro original: "${text}"`;
      const result = await callGeminiWithRetry(prompt);
      if (result) {
        setText(result.trim());
        showToast("Sombra desdobrada com sucesso.");
      }
    } catch {
      showToast("A sombra permaneceu em silêncio (Erro na API).");
    } finally {
      setIsDesdobrando(false);
    }
  };

  const handleOuvirEco = async (entryId, entryText) => {
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, isFetchingEcho: true } : e));
    try {
      const prompt = `Alguém acabou de arquivar o seguinte relato de um assombro: "${entryText}". Escreva um 'Eco da Sombra', uma resposta direta a isso de no máximo 2 frases curtas. Seja enigmático, observador e com um toque de humor sombrio. Aja como se você fosse a própria escuridão, a parede da casa ou o vazio respondendo à pessoa.`;
      const result = await callGeminiWithRetry(prompt);
      if (result) {
        setEntries(prev => prev.map(e => e.id === entryId ? { ...e, echo: result.trim(), isFetchingEcho: false } : e));
      }
    } catch {
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, isFetchingEcho: false, echo: "... (silêncio)" } : e));
      showToast("As sombras não quiseram falar.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newEntry = {
      id: Date.now(),
      text,
      mood: mood || 'Não especificado',
      category: category || 'Outros',
      location: location || 'Desconhecido',
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setEntries([newEntry, ...entries]);
    setText('');
    setMood('');
    setCategory('');
    setLocation('');
    showToast("Relato arquivado com sucesso.");
    setView('gallery');
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in">
      <SkullIcon className="w-32 h-32 mb-8 drop-shadow-2xl" />
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#E5D9C5] mb-4 tracking-tighter">
        O QUE TE<br/><span className="text-red-800">ASSOMBRA?</span>
      </h1>
      <p className="text-neutral-400 text-lg md:text-xl max-w-md mb-12 font-light">
        Pode ser medo, rotina, lembrança, lugar, ideia ou só cansaço.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => setView('form')}
          className="flex-1 bg-red-900 hover:bg-red-800 text-[#E5D9C5] py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Responder
        </button>
        <button
          onClick={() => setView('gallery')}
          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-[#E5D9C5] py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <Archive size={20} />
          Ver Arquivo
        </button>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <button
        onClick={() => setView('home')}
        className="text-neutral-400 hover:text-[#E5D9C5] mb-8 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-serif text-[#E5D9C5] mb-2">Novo Relato</h2>
        <p className="text-neutral-500 mb-8 text-sm">O mundo é cômico. O arquivo é sério. Deixe sua marca.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[#E5D9C5] font-medium">O que te assombra hoje? *</label>
              <button
                type="button"
                onClick={handleDesdobrar}
                disabled={!text.trim() || isDesdobrando}
                className="text-xs flex items-center gap-1 bg-[#1a1a1a] hover:bg-neutral-800 border border-neutral-700 text-[#E5D9C5] py-1.5 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isDesdobrando ? (
                  <Loader2 size={14} className="animate-spin text-neutral-400" />
                ) : (
                  <Sparkles size={14} className="text-yellow-600 group-hover:text-yellow-500 transition-colors" />
                )}
                Desdobrar Sombra
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              placeholder="Ex: A pia cheia de louça. O silêncio. A sombra na parede..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-[#E5D9C5] focus:border-red-900 focus:ring-1 focus:ring-red-900 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[#E5D9C5] mb-2 font-medium">Categoria</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Cotidiano', 'Corpo', 'Memória', 'Lugar', 'Medo'].map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-2 rounded border text-sm transition-all ${
                    category === cat
                      ? 'bg-neutral-800 border-neutral-600 text-white'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#E5D9C5] mb-2 font-medium">Humor da Assombração</label>
            <div className="flex gap-4">
              {['Cômico', 'Neutro', 'Pesado'].map(m => (
                <label key={m} className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-white transition-colors">
                  <input
                    type="radio"
                    name="mood"
                    value={m}
                    checked={mood === m}
                    onChange={(e) => setMood(e.target.value)}
                    className="accent-red-800"
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#E5D9C5] mb-2 font-medium">Local (Opcional)</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: São Paulo, Cozinha, Prefiro não dizer"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-[#E5D9C5] focus:border-red-900 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-900 hover:bg-red-800 text-[#E5D9C5] py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 mt-8"
          >
            <Send size={20} />
            Arquivar Assombro
          </button>
        </form>
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-end mb-12">
        <div>
          <button
            onClick={() => setView('home')}
            className="text-neutral-400 hover:text-[#E5D9C5] mb-6 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} /> Voltar
          </button>
          <h2 className="text-4xl font-serif text-[#E5D9C5]">O Arquivo</h2>
          <p className="text-neutral-500 mt-2">Registros de obsessões, medos e cotidianos.</p>
        </div>
        <button
          onClick={() => setView('form')}
          className="hidden md:flex bg-neutral-800 hover:bg-neutral-700 text-[#E5D9C5] py-2 px-4 rounded-lg font-medium transition-all items-center gap-2"
        >
          <Plus size={18} /> Adicionar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-[#1a1a1a] border border-neutral-800 p-6 rounded-xl hover:border-red-900/50 transition-colors group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-red-800/80 uppercase tracking-wider">{entry.category}</span>
                <span className="text-xs text-neutral-600">{entry.date}</span>
              </div>
              <p className="text-[#E5D9C5] text-lg font-serif leading-relaxed mb-6">
                "{entry.text}"
              </p>

              {entry.echo && (
                <div className="mb-6 p-4 bg-[#121212] border-l-2 border-red-900 rounded-r-lg relative">
                  <MessageSquare size={14} className="absolute top-4 left-3 text-red-900/50" />
                  <p className="text-sm text-neutral-400 italic pl-6 leading-relaxed">
                    {entry.echo}
                  </p>
                </div>
              )}

              {!entry.echo && (
                <button
                  onClick={() => handleOuvirEco(entry.id, entry.text)}
                  disabled={entry.isFetchingEcho}
                  className="mb-6 text-xs flex items-center gap-2 text-neutral-500 hover:text-red-400 transition-colors w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {entry.isFetchingEcho ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} className="text-red-900" />
                  )}
                  Ouvir o Eco das Sombras
                </button>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-800/50">
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <MapPin size={12} />
                {entry.location}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                entry.mood === 'Cômico' ? 'bg-yellow-900/20 text-yellow-500' :
                entry.mood === 'Pesado' ? 'bg-red-900/20 text-red-500' :
                'bg-neutral-800 text-neutral-400'
              }`}>
                {entry.mood}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] font-sans selection:bg-red-900/50 selection:text-white pb-20">
      <nav className="border-b border-neutral-800 p-4 flex justify-between items-center bg-[#121212]/80 backdrop-blur-md sticky top-0 z-10">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <SkullIcon className="w-8 h-8 text-[#E5D9C5] group-hover:scale-110 transition-transform" />
          <span className="font-serif font-bold text-[#E5D9C5] tracking-wide hidden sm:block">
            O QUE TE ASSOMBRA?
          </span>
        </div>
        <div className="text-neutral-500 text-sm font-mono">
          {entries.length} Registros
        </div>
      </nav>

      <main>
        {view === 'home' && renderHome()}
        {view === 'form' && renderForm()}
        {view === 'gallery' && renderGallery()}
      </main>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-neutral-800 text-[#E5D9C5] px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles size={18} className="text-red-700" />
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
}
