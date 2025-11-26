import React, { useState } from 'react';
import KallyniVideoConvite from './components/KallyniVideoConvite';
import FrutasMortais from './components/FrutasMortais';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'kallyni':
        return <KallyniVideoConvite />;
      case 'frutas-mortais':
        return <FrutasMortais />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 text-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
              <h1 className="text-5xl font-bold mb-8">
                RAÖW • CRU.BELDADE
              </h1>

              <div className="space-y-4">
                <button
                  onClick={() => setCurrentView('kallyni')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                >
                  🎉 Convite - 15 Anos da Kallyni
                </button>

                <button
                  onClick={() => setCurrentView('frutas-mortais')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-8 rounded-lg transition-all transform hover:scale-105 text-xl"
                >
                  ◻ Frutas Mortais ◻
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
