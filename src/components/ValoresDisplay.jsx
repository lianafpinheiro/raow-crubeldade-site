import React from 'react';

const ValoresDisplay = ({ valores }) => {
  const pares = [
    { esq: 'autenticidade', dir: 'pragmatismo', esqLabel: 'Autenticidade', dirLabel: 'Pragmatismo' },
    { esq: 'individualismo', dir: 'coletivismo', esqLabel: 'Individualismo', dirLabel: 'Coletivismo' },
    { esq: 'confrontacao', dir: 'diplomacia', esqLabel: 'Confrontação', dirLabel: 'Diplomacia' },
    { esq: 'razao', dir: 'emocao', esqLabel: 'Razão', dirLabel: 'Emoção' },
    { esq: 'transformacao', dir: 'preservacao', esqLabel: 'Transformação', dirLabel: 'Preservação' }
  ];

  const createBar = (valEsq, valDir) => {
    const total = Math.abs(valEsq) + Math.abs(valDir);

    if (total === 0) {
      return { esqWidth: 0, dirWidth: 0, emptyWidth: 100 };
    }

    const percEsq = (Math.abs(valEsq) / total) * 100;
    const percDir = (Math.abs(valDir) / total) * 100;

    return {
      esqWidth: percEsq / 2,
      dirWidth: percDir / 2,
      emptyWidth: 100 - (percEsq / 2) - (percDir / 2)
    };
  };

  return (
    <div className="bg-black border-2 border-orange-500 p-6 rounded-lg mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-orange-400">
          SEUS VALORES ATUAIS
        </h2>
      </div>

      <div className="space-y-4">
        {pares.map((par, index) => {
          const valEsq = valores[par.esq] || 0;
          const valDir = valores[par.dir] || 0;
          const bar = createBar(valEsq, valDir);

          return (
            <div key={index} className="space-y-2">
              {/* Labels */}
              <div className="flex justify-between text-xs text-gray-400">
                <span className={valEsq > 0 ? 'text-orange-400 font-bold' : ''}>
                  {par.esqLabel}
                </span>
                <span className={valDir > 0 ? 'text-orange-400 font-bold' : ''}>
                  {par.dirLabel}
                </span>
              </div>

              {/* Bar */}
              <div className="flex h-6 bg-gray-800 rounded overflow-hidden">
                {/* Left side */}
                <div
                  className="bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-500"
                  style={{ width: `${bar.esqWidth}%` }}
                ></div>

                {/* Middle (empty) */}
                <div
                  className="bg-gray-700"
                  style={{ width: `${bar.emptyWidth}%` }}
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                    {valEsq === 0 && valDir === 0 ? '·········' : ''}
                  </div>
                </div>

                {/* Right side */}
                <div
                  className="bg-gradient-to-l from-blue-600 to-blue-500 transition-all duration-500"
                  style={{ width: `${bar.dirWidth}%` }}
                ></div>
              </div>

              {/* Values */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>{valEsq > 0 ? `+${valEsq}` : ''}</span>
                <span>{valDir > 0 ? `+${valDir}` : ''}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Suas escolhas definem quem você é.</p>
      </div>
    </div>
  );
};

export default ValoresDisplay;
