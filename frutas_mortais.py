#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FRUTAS MORTAIS ◻ — Motor de Narrativa Interativa
Versão 1.0 — OSSO (Estrutura Essencial)

"You taught me to polish the blade: less ornament, more bone."
— Carta ao General Caído

Metodologia: CRU.BELDADE — Fase SENTIR
Vulnerabilidade: Molecular (o corpo, a ética corporificada)
"""

import json
import os
import time
from typing import Dict, List, Optional, Any

# ═══════════════════════════════════════════════════════════════
# DADOS DO JOGO — Versão Expandida
# ═══════════════════════════════════════════════════════════════

DADOS_DO_JOGO = {
    "metadata": {
        "title": "Frutas Mortais ◻",
        "subtitle": "Um Jogo de Cognição Corporificada",
        "version": "1.0.0-osso",
        "epitaph": "You taught me to polish the blade: less ornament, more bone. Now silence weighs and quickens. RAÖW does not ask for absolution – it asks for breath. I keep howling."
    },

    "variables": {
        "garden_path": None,
        "fruit_choice": None,
        "identity_projection": None,
        "extraction_resist": False,
        "root_cut": False,
        "medication_taken": False,
        "trust_silas": False,
        "valores": {
            "autenticidade": 0,
            "pragmatismo": 0,
            "individualismo": 0,
            "coletivismo": 0,
            "confrontacao": 0,
            "diplomacia": 0,
            "razao": 0,
            "emocao": 0,
            "transformacao": 0,
            "preservacao": 0
        }
    },

    "scenes": [
        {
            "scene_id": "prologo_1",
            "title": "PRÓLOGO: CITRÓPOLIS",
            "lado": "A",
            "description": "Citrópolis pulsa em néon e ferrugem. A sarjeta respira como órgão doente. Arranha-céus de vidro refletem céus cor de cobre oxidado. Hologramas prometem felicidade em 12 parcelas.",
            "atmosphere": {
                "visual": "Néon laranja, vidro espelhado, geometria perfeita",
                "sound": "Zumbido de drones, jingles corporativos, silêncio humano",
                "smell": "Cítrico sintético, ozônio, ausência de suor"
            },
            "dialogue": [
                {"speaker": "NARRADOR", "text": "Aqui, até a decadência é estética."},
                {"speaker": "NARRADOR", "text": "Aqui, até o esquecimento é ritual."},
                {"speaker": "NARRADOR", "text": "Citrópolis é a cidade onde as emoções foram resolvidas. Não eliminadas — isso seria bárbaro. Resolvidas. Otimizadas. Cultivadas."}
            ],
            "options": [
                {
                    "text": "Observar os caminhantes de cabeça-fruta",
                    "next_scene": "prologo_2"
                },
                {
                    "text": "Fixar o olhar no alto-falante",
                    "next_scene": "prologo_3"
                }
            ]
        },

        {
            "scene_id": "prologo_2",
            "title": "OS CAMINHANTES",
            "lado": "A",
            "description": "Caminhantes com cabeças de frutas perfeitas. Maçãs vermelhas demais. Bananas amarelas demais. Todos iguais. Todos obedientes. Todos vazios.",
            "dialogue": [
                {"speaker": "NARRADOR", "text": "O Protocolo da Amnésia é proteção."},
                {"speaker": "NARRADOR", "text": "Sem memória, sem dor. Sem dor, sem resistência."},
                {"speaker": "NARRADOR", "text": "Eles caminham em formação perfeita. Produtivos. Eficientes. Mortos."}
            ],
            "options": [
                {
                    "text": "Seguir com eles (integração)",
                    "next_scene": "hospital_branco_1",
                    "set_variable": {"garden_path": "integration"}
                },
                {
                    "text": "Desviar para a sarjeta (resistência)",
                    "next_scene": "prologo_4",
                    "set_variable": {"garden_path": "resistance"}
                }
            ]
        },

        {
            "scene_id": "prologo_3",
            "title": "O ALTO-FALANTE",
            "lado": "A",
            "description": "O alto-falante vibra. Não é som. É invasão. As palavras entram pelos poros, instalam-se nos ossos, reescrevem a memória.",
            "dialogue": [
                {"speaker": "ALTO-FALANTE", "text": "🍊 FÓSFORO™ — A Felicidade Que Você Merece."},
                {"speaker": "ALTO-FALANTE", "text": "Sem fruta, sem nome. Sem nome, sem voz. Sem voz, sem valor."},
                {"speaker": "NARRADOR", "text": "A propaganda não convence. Ela programa."}
            ],
            "options": [
                {
                    "text": "Ignorar e caminhar (submissão)",
                    "next_scene": "hospital_branco_1",
                    "set_variable": {"garden_path": "submission"}
                },
                {
                    "text": "Resistir e tapar os ouvidos (rebelião)",
                    "next_scene": "prologo_4",
                    "set_variable": {"garden_path": "rebellion"}
                }
            ]
        },

        {
            "scene_id": "prologo_4",
            "title": "FÓSFORO (SUJEITO ZERO)",
            "lado": "A",
            "description": "Na sarjeta, uma figura diferente. Cabeça humana — não fruta. Aura quente, vibrante, perigosa. Ela te vê. E você sente que ser visto é perigoso aqui.",
            "dialogue": [
                {"speaker": "NARRADOR", "text": "Fósforo. Sujeito Zero. A primeira que resistiu."},
                {"speaker": "NARRADOR", "text": "Ela retém memória como veneno. Como arma."},
                {"speaker": "FÓSFORO", "text": "Você ainda tem rosto. Eles não te transformaram... ainda."},
                {"speaker": "FÓSFORO", "text": "Corre. Ou fica. Mas escolhe rápido. Aqui, hesitação mata mais que bala."}
            ],
            "options": [
                {
                    "text": "Seguir Fósforo",
                    "next_scene": "hospital_branco_1",
                    "set_variable": {"identity_projection": "revolutionary"}
                },
                {
                    "text": "Ficar parado (observar)",
                    "next_scene": "hospital_branco_1",
                    "set_variable": {"identity_projection": "observer"}
                }
            ]
        },

        {
            "scene_id": "hospital_branco_1",
            "title": "DESPERTAR NO BRANCO",
            "lado": "A",
            "description": "Você desperta. Quarto de hospital imaculado. Branco sobre branco sobre branco. O teto pulsa como músculo vivo. Você não sabe seu nome. Você não sabe como chegou aqui. Você só sabe que algo está errado.",
            "dialogue": [
                {"speaker": "NARRADOR", "text": "O Hospital Branco não cura. Ele planta."},
                {"speaker": "NARRADOR", "text": "Cartazes cobrem as paredes. Todos repetem o mesmo slogan."}
            ],
            "options": [
                {
                    "text": "Ler os cartazes",
                    "next_scene": "hospital_branco_2"
                },
                {
                    "text": "Observar a médica",
                    "next_scene": "hospital_branco_3"
                }
            ]
        },

        {
            "scene_id": "hospital_branco_2",
            "title": "OS CARTAZES",
            "lado": "A",
            "description": "Os cartazes vibram. Não são papel. São carne escrita. Pele tatuada com propaganda.",
            "dialogue": [
                {"speaker": "CARTAZ", "text": "O Protocolo da Amnésia é proteção."},
                {"speaker": "CARTAZ", "text": "Sem memória, sem trauma."},
                {"speaker": "CARTAZ", "text": "A Corporação dos Jardineiros cuida de você."},
                {"speaker": "NARRADOR", "text": "Você sente náusea. Não pelos cartazes. Pela forma como eles fazem sentido."}
            ],
            "options": [
                {
                    "text": "Desviar o olhar",
                    "next_scene": "hospital_branco_3"
                }
            ]
        },

        {
            "scene_id": "hospital_branco_3",
            "title": "A MÉDICA ROMÃ",
            "lado": "A",
            "description": "A médica entra. Você vê algo impossível: ela tem cabeça de romã. Vermelha, inchada, prestes a explodir. Sementes translúcidas brilhando através da pele.",
            "dialogue": [
                {"speaker": "MÉDICA ROMÃ", "text": "Olá, Kael. Meu nome é Dra. Mira."},
                {"speaker": "NARRADOR", "text": "Kael. É esse seu nome? Soa estranho."},
                {"speaker": "MÉDICA ROMÃ", "text": "Você sofreu um... incidente. É normal não se lembrar."},
                {"speaker": "MÉDICA ROMÃ", "text": "Vou prescrever algo para ajudar. Chamamos de... fertilizante."},
                {"speaker": "NARRADOR", "text": "Ela estende um frasco translúcido. Líquido cor de âmbar. Cheiro adocicado enjoativo."}
            ],
            "options": [
                {
                    "text": "💊 Aceitar o fertilizante",
                    "next_scene": "hospital_aceitar",
                    "set_variable": {"medication_taken": True},
                    "valores": {"pragmatismo": 3, "preservacao": 2, "diplomacia": 1}
                },
                {
                    "text": "🔥 Recusar o fertilizante",
                    "next_scene": "hospital_recusar",
                    "set_variable": {"medication_taken": False},
                    "valores": {"autenticidade": 3, "transformacao": 2, "confrontacao": 1}
                }
            ]
        },

        {
            "scene_id": "hospital_aceitar",
            "title": "ACEITAR É ESQUECER",
            "lado": "B",
            "description": "Você bebe. O líquido desce como mel quente. O espelho na parede trinca levemente — ou você imaginou?",
            "dialogue": [
                {"speaker": "NARRADOR", "text": "Aceitar é esquecer. Mas esquecer também é uma forma de sobreviver."},
                {"speaker": "NARRADOR", "text": "As visões desfocam. A romã da Dra. Mira ainda está lá, mas embaçada."},
                {"speaker": "NARRADOR", "text": "Você pode fingir normalidade agora. Pode sorrir de volta."},
                {"speaker": "NARRADOR", "text": "Mas uma parte de você grita. A parte que sente verdades no corpo."},
                {"speaker": "NARRADOR", "text": "Grita que você traiu algo fundamental."}
            ],
            "options": [
                {
                    "text": "◻ TRÊS DIAS DEPOIS",
                    "next_scene": "mercado_frutas_1"
                }
            ]
        },

        {
            "scene_id": "hospital_recusar",
            "title": "RECUSAR É LEMBRAR",
            "lado": "B",
            "description": "Você recusa. O espelho permanece inteiro. A Dra. Mira faz anotações. Muitas anotações.",
            "dialogue": [
                {"speaker": "NARRADOR", "text": "Recusar é lembrar. Mas lembrar também é uma forma de morrer."},
                {"speaker": "MÉDICA ROMÃ", "text": "Entendo. A escolha é sua."},
                {"speaker": "NARRADOR", "text": "Mas você vê nos olhos dela: decepção. Medo."},
                {"speaker": "NARRADOR", "text": "As visões continuam. Intensas. Inescapáveis."},
                {"speaker": "NARRADOR", "text": "Cada pessoa é uma fruta. Cada emoção uma textura."},
                {"speaker": "NARRADOR", "text": "Você prefere uma verdade perturbadora a uma mentira confortável."}
            ],
            "options": [
                {
                    "text": "◻ TRÊS DIAS DEPOIS",
                    "next_scene": "mercado_frutas_1"
                }
            ]
        },

        {
            "scene_id": "mercado_frutas_1",
            "title": "O MERCADO DAS FRUTAS",
            "lado": "A",
            "description": "Você recebe alta. Sem memória, sem identidade, sem casa. A Dra. Mira te dá um endereço temporário e créditos básicos. Você vaga pelas ruas. Citrópolis é um pomar de frutas artificiais.",
            "dialogue": [
                {"speaker": "NARRADOR", "text": "Bananas uniformes. Maçãs geométricas. Morangos que nunca apodrecem."},
                {"speaker": "NARRADOR", "text": "Você sente náusea física. Não pela feiura, mas pela perfeição."},
                {"speaker": "NARRADOR", "text": "É quando você o encontra."}
            ],
            "options": [
                {
                    "text": "Continuar",
                    "next_scene": "mercado_frutas_2"
                }
            ]
        },

        {
            "scene_id": "mercado_frutas_2",
            "title": "SILAS (O FIGO)",
            "lado": "A",
            "description": "Na sarjeta — literalmente — um homem idoso sentado. Quando você olha para ele, vê: um figo. Rugoso, marrom, quase feio. Mas a textura interior... doçura complexa. Camadas sobre camadas.",
            "dialogue": [
                {"speaker": "NARRADOR", "text": "É a primeira fruta autêntica que você vê."},
                {"speaker": "SILAS", "text": "Você também é um Leitor."},
                {"speaker": "SILAS", "text": "Posso ver pela forma como você me olha."},
                {"speaker": "SILAS", "text": "Meu nome é Silas. E tenho muito a te ensinar, Kael."},
                {"speaker": "NARRADOR", "text": "Ele sabe seu nome. Você não disse seu nome."}
            ],
            "options": [
                {
                    "text": "🤝 Confiar em Silas",
                    "next_scene": "fim_osso",
                    "set_variable": {"trust_silas": True},
                    "valores": {"transformacao": 3, "coletivismo": 2}
                },
                {
                    "text": "🚶 Manter distância",
                    "next_scene": "fim_osso",
                    "set_variable": {"trust_silas": False},
                    "valores": {"individualismo": 3, "preservacao": 2}
                }
            ]
        },

        {
            "scene_id": "fim_osso",
            "title": "FIM DA DEMONSTRAÇÃO — VERSÃO OSSO",
            "lado": "B",
            "description": "A jornada de Kael está apenas começando. Esta foi a primeira de muitas escolhas que definirão não apenas quem Kael é, mas quem Kael escolhe ser.",
            "dialogue": [
                {"speaker": "NARRADOR", "text": "━━━━━━━━━━━━━━━━━━━━━━━"},
                {"speaker": "NARRADOR", "text": "Em Frutas Mortais, não há respostas fáceis."},
                {"speaker": "NARRADOR", "text": "Apenas perguntas cada vez mais profundas."},
                {"speaker": "NARRADOR", "text": "━━━━━━━━━━━━━━━━━━━━━━━"},
                {"speaker": "NARRADOR", "text": "Obrigado por experienciar o Capítulo 1."},
                {"speaker": "NARRADOR", "text": "━━━━━━━━━━━━━━━━━━━━━━━"}
            ],
            "options": []
        }
    ]
}


# ═══════════════════════════════════════════════════════════════
# SISTEMA DE GERENCIAMENTO DE ESTADO
# ═══════════════════════════════════════════════════════════════

class GameState:
    """Gerencia o estado persistente do jogo"""

    def __init__(self):
        self.variables = DADOS_DO_JOGO["variables"].copy()
        self.history = []  # Histórico de escolhas

    def set_variable(self, key: str, value: Any) -> None:
        """Define uma variável de jogo"""
        self.variables[key] = value

    def get_variable(self, key: str) -> Any:
        """Obtém uma variável de jogo"""
        return self.variables.get(key)

    def update_valores(self, valores_delta: Dict[str, int]) -> None:
        """Atualiza valores morais"""
        for key, delta in valores_delta.items():
            current = self.variables["valores"].get(key, 0)
            self.variables["valores"][key] = max(-100, min(100, current + delta))

    def add_to_history(self, scene_id: str, choice_text: str) -> None:
        """Adiciona escolha ao histórico"""
        self.history.append({
            "scene": scene_id,
            "choice": choice_text,
            "valores": self.variables["valores"].copy()
        })

    def mostrar_valores(self) -> str:
        """Retorna string formatada dos valores morais"""
        valores = self.variables["valores"]
        output = ["\n" + "═"*50]
        output.append("SEUS VALORES ATUAIS:")
        output.append("═"*50)

        pares = [
            ("Autenticidade", "Pragmatismo"),
            ("Individualismo", "Coletivismo"),
            ("Confrontação", "Diplomacia"),
            ("Razão", "Emoção"),
            ("Transformação", "Preservação")
        ]

        for esq, dir in pares:
            val_esq = valores.get(esq.lower(), 0)
            val_dir = valores.get(dir.lower(), 0)
            barra = self._criar_barra(val_esq, val_dir, esq, dir)
            output.append(barra)

        output.append("═"*50 + "\n")
        return "\n".join(output)

    def _criar_barra(self, val_esq: int, val_dir: int, nome_esq: str, nome_dir: str) -> str:
        """Cria visualização em barra dos valores opostos"""
        total = abs(val_esq) + abs(val_dir)
        if total == 0:
            return f"{nome_esq:15} [{'·'*20}] {nome_dir:15}"

        perc_esq = abs(val_esq) / total if val_esq < 0 else val_esq / total
        perc_dir = abs(val_dir) / total if val_dir < 0 else val_dir / total

        largura = 20
        blocos_esq = int(perc_esq * largura / 2)
        blocos_dir = int(perc_dir * largura / 2)
        meio = largura - blocos_esq - blocos_dir

        barra = "◼" * blocos_esq + "·" * meio + "◼" * blocos_dir
        return f"{nome_esq:15} [{barra}] {nome_dir:15}"


# ═══════════════════════════════════════════════════════════════
# MOTOR DE NARRATIVA
# ═══════════════════════════════════════════════════════════════

def limpar_tela():
    """Limpa a tela do terminal"""
    os.system('cls' if os.name == 'nt' else 'clear')

def digitar_texto(texto: str, velocidade: float = 0.03):
    """Efeito de digitação para texto"""
    for char in texto:
        print(char, end='', flush=True)
        time.sleep(velocidade)
    print()

def obter_cena_por_id(scene_id: str) -> Optional[Dict]:
    """Encontra cena pelo ID"""
    for cena in DADOS_DO_JOGO["scenes"]:
        if cena["scene_id"] == scene_id:
            return cena
    return None

def renderizar_cena(cena: Dict, state: GameState):
    """Renderiza uma cena completa"""
    limpar_tela()

    # Header
    print("\n" + "◻"*25)
    print(f"FRUTAS MORTAIS — {cena.get('title', 'SEM TÍTULO')}")
    print(f"LADO {cena.get('lado', '?')}: {('O JARDIM DAS ILUSÕES' if cena.get('lado') == 'A' else 'O POMAR DAS VERDADES')}")
    print("◻"*25 + "\n")

    # Descrição
    print("─" * 50)
    digitar_texto(cena["description"], velocidade=0.01)
    print("─" * 50 + "\n")

    # Atmosfera (se existir)
    if "atmosphere" in cena:
        atm = cena["atmosphere"]
        print("[ ATMOSFERA ]")
        if "visual" in atm:
            print(f"  Visual: {atm['visual']}")
        if "sound" in atm:
            print(f"  Som: {atm['sound']}")
        if "smell" in atm:
            print(f"  Cheiro: {atm['smell']}")
        print()

    # Diálogos
    if "dialogue" in cena:
        for fala in cena["dialogue"]:
            speaker = fala["speaker"]
            text = fala["text"]

            if speaker == "NARRADOR":
                print(f"  {text}")
            else:
                print(f"\n  {speaker}:")
                print(f"  > {text}")

            time.sleep(0.5)
        print()

    print("─" * 50)

def renderizar_opcoes(opcoes: List[Dict]) -> int:
    """Renderiza opções e retorna escolha do jogador"""
    print("\n[ O QUE FAZES? ]\n")

    for i, opcao in enumerate(opcoes, 1):
        texto = opcao["text"]
        print(f"  [{i}] {texto}")

        # Mostrar preview de valores se existir
        if "valores" in opcao:
            valores_str = ", ".join([f"{k}+{v}" for k, v in opcao["valores"].items()])
            print(f"      └─ {valores_str}")

    print()

    while True:
        try:
            escolha = input("◻ Escolha (número): ").strip()
            indice = int(escolha) - 1

            if 0 <= indice < len(opcoes):
                return indice
            else:
                print(f"⚠ Escolha entre 1 e {len(opcoes)}")
        except ValueError:
            print("⚠ Digite apenas o número da opção")
        except KeyboardInterrupt:
            print("\n\n[ Jogo interrompido ]\n")
            exit(0)

def processar_opcao(opcao: Dict, state: GameState):
    """Processa efeitos da opção escolhida"""
    # Atualizar variáveis
    if "set_variable" in opcao:
        for key, value in opcao["set_variable"].items():
            state.set_variable(key, value)

    # Atualizar valores morais
    if "valores" in opcao:
        state.update_valores(opcao["valores"])


# ═══════════════════════════════════════════════════════════════
# LOOP PRINCIPAL
# ═══════════════════════════════════════════════════════════════

def iniciar_jogo():
    """Loop principal do jogo"""

    # Mostrar abertura
    limpar_tela()
    print("\n" + "═"*50)
    print(" "*10 + "◻ FRUTAS MORTAIS ◻")
    print(" "*5 + "Um Jogo de Cognição Corporificada")
    print("═"*50)
    print()
    print(DADOS_DO_JOGO["metadata"]["epitaph"])
    print()
    print("═"*50)
    input("\nPressione ENTER para começar...")

    # Inicializar estado
    state = GameState()
    cena_atual_id = "prologo_1"

    # Loop principal
    while True:
        # Carregar cena
        cena = obter_cena_por_id(cena_atual_id)

        if cena is None:
            print(f"\n⚠ Erro: Cena '{cena_atual_id}' não encontrada.")
            break

        # Renderizar cena
        renderizar_cena(cena, state)

        # Verificar se é cena final
        if not cena["options"]:
            print("\n" + state.mostrar_valores())
            print("\n[ FIM ]\n")
            break

        # Renderizar opções e obter escolha
        indice_escolhido = renderizar_opcoes(cena["options"])
        opcao_escolhida = cena["options"][indice_escolhido]

        # Adicionar ao histórico
        state.add_to_history(cena_atual_id, opcao_escolhida["text"])

        # Processar efeitos da escolha
        processar_opcao(opcao_escolhida, state)

        # Avançar para próxima cena
        cena_atual_id = opcao_escolhida["next_scene"]

        # Pausa dramática
        input("\n[ Pressione ENTER para continuar ]")


# ═══════════════════════════════════════════════════════════════
# PONTO DE ENTRADA
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    try:
        iniciar_jogo()
    except KeyboardInterrupt:
        print("\n\n[ Jogo interrompido pelo jogador ]\n")
    except Exception as e:
        print(f"\n⚠ Erro inesperado: {e}\n")
