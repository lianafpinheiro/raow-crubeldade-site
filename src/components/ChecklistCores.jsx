import React, { useState } from 'react';
import { Check, Calendar, User, MessageSquare, Send, Printer } from 'lucide-react';

export default function ChecklistCores() {
  const [formData, setFormData] = useState({});

  const toggleOption = (section, option) => {
    setFormData(prev => {
      const currentSection = prev[section] || [];
      if (currentSection.includes(option)) {
        return { ...prev, [section]: currentSection.filter(item => item !== option) };
      } else {
        return { ...prev, [section]: [...currentSection, option] };
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    {
      id: "cognitivo",
      title: "Desenvolvimento Cognitivo, Emocional e Motor",
      options: [
        "As cores são utilizadas como estímulo visual para atenção e percepção.",
        "As atividades propostas promovem a expressão de sentimentos.",
        "Há estímulo à coordenação motora fina por meio de pintura, colagem ou desenho."
      ]
    },
    {
      id: "pedagogico",
      title: "Estratégias Pedagógicas com Cores",
      options: [
        "As cores são usadas para facilitar a memorização de conteúdos.",
        "Há associação de cores a conceitos (ex.: letras, números, categorias).",
        "As atividades envolvem raciocínio lógico e categorização por cores."
      ]
    },
    {
      id: "psicologia",
      title: "Psicologia das Cores",
      options: [
        "As atividades consideram os efeitos emocionais das cores (ex.: azul para calma, vermelho para atenção).",
        "As crianças são incentivadas a reconhecer e nomear sentimentos por meio das cores."
      ]
    },
    {
      id: "bncc",
      title: "Alinhamento com a BNCC",
      options: [
        "O campo de experiência \u201CTraços, sons, cores e formas\u201D está contemplado.",
        "A linguagem visual é valorizada como forma de expressão e aprendizagem."
      ]
    },
    {
      id: "praticas",
      title: "Atividades Práticas",
      options: [
        "Há propostas como desenho do animal preferido, mural das emoções, caça ao tesouro colorido.",
        "As atividades promovem criatividade, autonomia e expressão emocional."
      ]
    },
    {
      id: "maker",
      title: "Cultura Maker",
      options: [
        "As atividades seguem o princípio do \u201Caprender fazendo\u201D.",
        "As crianças são protagonistas na construção do conhecimento.",
        "Há espaço para experimentação e resolução de problemas com uso de cores."
      ]
    },
    {
      id: "mostre",
      title: "Abordagem \u201CMostre, não conte\u201D",
      options: [
        "Os conceitos são apresentados por meio de demonstrações visuais.",
        "As crianças manipulam e experimentam as cores em situações práticas."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-teal-50 py-8 px-4 font-sans print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden print:shadow-none print:max-w-full">

        <div className="bg-teal-600 p-8 text-white relative">
          <div className="absolute top-4 right-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              <Printer size={16} /> Imprimir / Salvar PDF
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Checklist de Avaliação – Uso das Cores</h1>
          <p className="text-teal-100 text-lg">
            Avaliar práticas pedagógicas e ambientais relacionadas ao uso das cores em educação infantil.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {sections.map((section, idx) => (
            <div key={section.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start gap-3 mb-4">
                <span className="bg-teal-100 text-teal-800 font-bold px-2 py-1 rounded text-sm">
                  {idx + 1}
                </span>
                <h2 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h2>
              </div>

              <p className="text-gray-500 text-sm mb-3 italic">Selecione os critérios atendidos nesta seção:</p>

              <div className="space-y-3 pl-2">
                {section.options.map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-start gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <div className="relative flex items-center mt-1">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-teal-600 checked:bg-teal-600 hover:border-teal-400"
                        onChange={() => toggleOption(section.id, option)}
                        checked={formData[section.id]?.includes(option) || false}
                      />
                      <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={14} />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-gray-50 p-6 rounded-lg space-y-6 mt-8 print:bg-white print:border print:border-gray-200">
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                <MessageSquare size={18} />
                Observações / Sugestões sobre o uso das cores
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none h-24"
                placeholder="Escreva sua resposta..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                  <User size={18} />
                  Identificação da turma/ambiente
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  placeholder="Sua resposta"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                  <Calendar size={18} />
                  Data da avaliação
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 print:hidden">
            <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors">
              <Send size={18} /> Enviar Avaliação
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-teal-600 text-sm mt-8 opacity-70 print:hidden">
        <p>Simulação Visual - Conteúdo pronto para Microsoft Forms</p>
      </div>
    </div>
  );
}
