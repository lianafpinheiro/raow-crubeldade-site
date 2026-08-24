import React, { useState } from 'react';
import KallyniVideoConvite from './components/KallyniVideoConvite';
import FrutasMortais from './components/FrutasMortais';
import ChecklistCores from './components/ChecklistCores';
import HauntingThoughts from './components/HauntingThoughts';
import LillythApp from './components/LillythApp';
import SistemaHeraldico from './components/SistemaHeraldico';
import EstudioGuiado from './components/EstudioGuiado';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'kallyni':
        return <KallyniVideoConvite />;
      case 'frutas-mortais':
        return <FrutasMortais />;
      case 'checklist-cores':
        return <ChecklistCores />;
      case 'haunting-thoughts':
        return <HauntingThoughts />;
      case 'lillyth':
        return <LillythApp />;
      case 'heraldico':
        return <SistemaHeraldico />;
      case 'estudio-guiado':
        return <EstudioGuiado />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 text-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
              <h1 className="text-5xl font-bold mb-8">
                RAÖW • CRU.BELDADE
              </h1>

              <div className="space-y-4">
                <button
                  onClick={() => setCurrentView('heraldico')}
                  className="w-full font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                  style={{ background: 'linear-gradient(135deg, #1A1810, #2A2418)', color: '#C4A253', border: '1px solid #C4A25355', letterSpacing: '0.12em' }}
                >
                  ♛ THE GODLESS CROWN — Sistema Heráldico
                </button>

                <button
                  onClick={() => setCurrentView('lillyth')}
                  className="w-full font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #7A5A1A)', color: '#0A0A0A', letterSpacing: '0.15em' }}
                >
                  ✦ LILLYTH — For the Lived
                </button>

                <button
                  onClick={() => setCurrentView('haunting-thoughts')}
                  className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                >
                  ☠ O Que Te Assombra?
                </button>

                <button
                  onClick={() => setCurrentView('kallyni')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                >
                  Convite - 15 Anos da Kallyni
                </button>

                <button
                  onClick={() => setCurrentView('frutas-mortais')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                >
                  ◻ Frutas Mortais ◻
                </button>

                <button
                  onClick={() => setCurrentView('checklist-cores')}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                >
                  Checklist de Avaliação – Uso das Cores
                </button>

                <button
                  onClick={() => setCurrentView('estudio-guiado')}
                  className="w-full bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                >
                  ∽ Estúdio Guiado — Sua Voz na Música
                </button>
              </div>

              <div className="text-sm text-gray-400 mt-8">
                <p>Escolha sua experiência</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {currentView !== 'home' && (
        <button
          onClick={() => setCurrentView('home')}
          className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          ← Voltar
        </button>
      )}
      {renderView()}
    </div>
  );
}

export default App;
