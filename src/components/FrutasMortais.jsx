import React, { useState, useEffect } from 'react';
import gameData from '../data/gameData.json';
import SceneRenderer from './SceneRenderer';
import ValoresDisplay from './ValoresDisplay';

const FrutasMortais = () => {
  const [gameState, setGameState] = useState({
    currentSceneId: 'prologo_1',
    variables: { ...gameData.initialVariables },
    history: [],
    showValores: false,
    gameStarted: false
  });

  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getCurrentScene = () => {
    return gameData.scenes.find(scene => scene.scene_id === gameState.currentSceneId);
  };

  const updateValores = (valoresDelta) => {
    if (!valoresDelta) return;

    setGameState(prev => {
      const newValores = { ...prev.variables.valores };

      Object.entries(valoresDelta).forEach(([key, delta]) => {
        const current = newValores[key] || 0;
        newValores[key] = Math.max(-100, Math.min(100, current + delta));
      });

      return {
        ...prev,
        variables: {
          ...prev.variables,
          valores: newValores
        }
      };
    });
  };

  const handleChoice = (option) => {
    const currentScene = getCurrentScene();

    // Adicionar ao histórico
    const newHistory = [
      ...gameState.history,
      {
        scene: gameState.currentSceneId,
        choice: option.text,
        valores: { ...gameState.variables.valores }
      }
    ];

    // Atualizar variáveis
    let newVariables = { ...gameState.variables };
    if (option.set_variable) {
      newVariables = { ...newVariables, ...option.set_variable };
    }

    // Atualizar valores morais
    if (option.valores) {
      const newValores = { ...newVariables.valores };
      Object.entries(option.valores).forEach(([key, delta]) => {
        const current = newValores[key] || 0;
        newValores[key] = Math.max(-100, Math.min(100, current + delta));
      });
      newVariables.valores = newValores;
    }

    // Avançar para próxima cena
    setGameState({
      ...gameState,
      currentSceneId: option.next_scene,
      variables: newVariables,
      history: newHistory
    });
  };

  const startGame = () => {
    setGameState({
      ...gameState,
      gameStarted: true
    });
  };

  const restartGame = () => {
    setGameState({
      currentSceneId: 'prologo_1',
      variables: { ...gameData.initialVariables },
      history: [],
      showValores: false,
      gameStarted: true
    });
  };

  const toggleValores = () => {
    setGameState({
      ...gameState,
      showValores: !gameState.showValores
    });
  };

  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="border-t border-b border-orange-500 py-8">
            <div className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">
              ◻ FRUTAS MORTAIS ◻
            </div>
            <div className="text-xl md:text-2xl text-orange-300">
              {gameData.metadata.subtitle}
            </div>
          </div>

          <div className="text-sm md:text-base leading-relaxed text-gray-300 px-4">
            {gameData.metadata.epitaph}
          </div>

          <button
            onClick={startGame}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 text-lg"
          >
            Pressione para começar
          </button>

          <div className="text-xs text-gray-500 mt-8">
            Versão {gameData.metadata.version}
          </div>
        </div>
      </div>
    );
  }

  const currentScene = getCurrentScene();
  const isGameOver = currentScene && currentScene.options.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="border-t border-b border-orange-500 py-4 mb-4">
            <div className="text-2xl md:text-3xl font-bold tracking-wider">
              ◻ FRUTAS MORTAIS ◻
            </div>
          </div>

          <button
            onClick={toggleValores}
            className="text-sm text-orange-400 hover:text-orange-300 underline"
          >
            {gameState.showValores ? 'Ocultar Valores' : 'Mostrar Valores'}
          </button>
        </div>

        {/* Valores Display */}
        {gameState.showValores && (
          <ValoresDisplay valores={gameState.variables.valores} />
        )}

        {/* Scene Renderer */}
        <SceneRenderer
          scene={currentScene}
          onChoice={handleChoice}
          isGameOver={isGameOver}
        />

        {/* Game Over */}
        {isGameOver && (
          <div className="mt-8 space-y-4">
            <ValoresDisplay valores={gameState.variables.valores} />

            <div className="text-center space-x-4">
              <button
                onClick={restartGame}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Jogar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500">
          <p>Metodologia: CRU.BELDADE — Fase SENTIR</p>
          <p>Vulnerabilidade: Molecular (o corpo, a ética corporificada)</p>
        </div>
      </div>
    </div>
  );
};

export default FrutasMortais;
