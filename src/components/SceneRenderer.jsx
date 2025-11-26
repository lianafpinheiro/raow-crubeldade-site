import React, { useState, useEffect } from 'react';

const SceneRenderer = ({ scene, onChoice, isGameOver }) => {
  const [visibleDialogueIndex, setVisibleDialogueIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setVisibleDialogueIndex(0);
    setTypewriterText('');
    setIsTyping(true);
  }, [scene]);

  useEffect(() => {
    if (!scene || !isTyping) return;

    const description = scene.description;
    let index = 0;

    const interval = setInterval(() => {
      if (index < description.length) {
        setTypewriterText(description.substring(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [scene, isTyping]);

  useEffect(() => {
    if (isTyping || !scene?.dialogue) return;

    const timer = setTimeout(() => {
      if (visibleDialogueIndex < scene.dialogue.length) {
        setVisibleDialogueIndex(prev => prev + 1);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [visibleDialogueIndex, isTyping, scene]);

  if (!scene) {
    return (
      <div className="text-center text-red-500">
        Erro: Cena não encontrada
      </div>
    );
  }

  const getLadoLabel = (lado) => {
    return lado === 'A' ? 'O JARDIM DAS ILUSÕES' : 'O POMAR DAS VERDADES';
  };

  const getSpeakerStyle = (speaker) => {
    const styles = {
      'NARRADOR': 'text-gray-400 italic',
      'FÓSFORO': 'text-orange-500 font-bold',
      'MÉDICA ROMÃ': 'text-red-400 font-bold',
      'ALTO-FALANTE': 'text-yellow-400 font-bold',
      'CARTAZ': 'text-green-400 font-bold',
      'SILAS': 'text-amber-600 font-bold'
    };
    return styles[speaker] || 'text-white font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Scene Header */}
      <div className="border border-orange-500 p-6 rounded-lg bg-black/50 backdrop-blur">
        <div className="text-xs text-orange-400 mb-2">
          {scene.title}
        </div>
        <div className="text-sm text-gray-500">
          LADO {scene.lado}: {getLadoLabel(scene.lado)}
        </div>
      </div>

      {/* Description */}
      <div className="border-l-4 border-orange-600 pl-6 py-4">
        <p className="text-base md:text-lg leading-relaxed text-gray-200">
          {typewriterText}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
      </div>

      {/* Atmosphere */}
      {scene.atmosphere && !isTyping && (
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg space-y-2 text-sm">
          <div className="text-orange-400 font-bold mb-2">[ ATMOSFERA ]</div>
          {scene.atmosphere.visual && (
            <div>
              <span className="text-gray-500">Visual:</span>{' '}
              <span className="text-gray-300">{scene.atmosphere.visual}</span>
            </div>
          )}
          {scene.atmosphere.sound && (
            <div>
              <span className="text-gray-500">Som:</span>{' '}
              <span className="text-gray-300">{scene.atmosphere.sound}</span>
            </div>
          )}
          {scene.atmosphere.smell && (
            <div>
              <span className="text-gray-500">Cheiro:</span>{' '}
              <span className="text-gray-300">{scene.atmosphere.smell}</span>
            </div>
          )}
        </div>
      )}

      {/* Dialogue */}
      {!isTyping && scene.dialogue && (
        <div className="space-y-4">
          {scene.dialogue.slice(0, visibleDialogueIndex).map((line, index) => (
            <div
              key={index}
              className="animate-fadeIn"
            >
              {line.speaker === 'NARRADOR' ? (
                <p className={`${getSpeakerStyle(line.speaker)} pl-4`}>
                  {line.text}
                </p>
              ) : (
                <div className="bg-gray-900/50 border-l-4 border-orange-500 p-4 rounded">
                  <div className={`text-sm mb-2 ${getSpeakerStyle(line.speaker)}`}>
                    {line.speaker}:
                  </div>
                  <p className="text-gray-200">
                    {line.text}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Options */}
      {!isTyping && visibleDialogueIndex >= (scene.dialogue?.length || 0) && scene.options.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="text-orange-400 font-bold text-center mb-4">
            [ O QUE FAZES? ]
          </div>

          <div className="space-y-3">
            {scene.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onChoice(option)}
                className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-orange-500 p-4 rounded-lg transition-all transform hover:scale-102 group"
              >
                <div className="text-white group-hover:text-orange-300 transition-colors">
                  [{index + 1}] {option.text}
                </div>

                {option.valores && (
                  <div className="text-xs text-gray-500 mt-2 ml-6">
                    └─ {Object.entries(option.valores).map(([k, v]) => `${k}+${v}`).join(', ')}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneRenderer;
