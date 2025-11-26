#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Demo automática do jogo Frutas Mortais
Simula uma jornada completa para demonstração
"""

import frutas_mortais as fm
import time

def simular_jornada():
    """Simula uma jornada completa pelo jogo"""

    # Inicializar estado
    state = fm.GameState()

    # Jornada pré-definida (escolhas)
    jornada = [
        ('prologo_1', 1),  # Fixar o olhar no alto-falante
        ('prologo_3', 1),  # Resistir e tapar os ouvidos
        ('prologo_4', 0),  # Seguir Fósforo
        ('hospital_branco_1', 1),  # Observar a médica
        ('hospital_branco_3', 1),  # Recusar o fertilizante
        ('hospital_recusar', 0),  # Três dias depois
        ('mercado_frutas_1', 0),  # Continuar
        ('mercado_frutas_2', 0),  # Confiar em Silas
    ]

    print('\n' + '='*60)
    print(' '*15 + '◻ FRUTAS MORTAIS ◻')
    print(' '*15 + 'DEMO AUTOMÁTICA')
    print('='*60 + '\n')

    for scene_id, choice_idx in jornada:
        cena = fm.obter_cena_por_id(scene_id)

        if not cena:
            break

        # Mostrar cena
        print(f'\n{"◻"*30}')
        print(f'CENA: {cena["title"]}')
        print(f'LADO {cena["lado"]}: {"O JARDIM DAS ILUSÕES" if cena["lado"] == "A" else "O POMAR DAS VERDADES"}')
        print(f'{"◻"*30}\n')

        # Mostrar descrição
        print(f'📖 {cena["description"]}\n')

        # Mostrar diálogos (apenas primeiros 2)
        if 'dialogue' in cena:
            for i, fala in enumerate(cena['dialogue'][:2]):
                speaker = fala['speaker']
                text = fala['text']

                if speaker == 'NARRADOR':
                    print(f'   {text}')
                else:
                    print(f'   {speaker}: {text}')

            if len(cena['dialogue']) > 2:
                print(f'   [...mais {len(cena["dialogue"]) - 2} diálogos...]')
            print()

        # Mostrar opções
        if cena['options']:
            print('[ OPÇÕES ]')
            for i, opcao in enumerate(cena['options']):
                marcador = '→' if i == choice_idx else ' '
                print(f'  {marcador} [{i+1}] {opcao["text"]}')

            # Processar escolha
            opcao_escolhida = cena['options'][choice_idx]

            # Atualizar valores
            if 'valores' in opcao_escolhida:
                state.update_valores(opcao_escolhida['valores'])
                print(f'\n   ⚡ Valores alterados: {opcao_escolhida["valores"]}')

            # Atualizar variáveis
            if 'set_variable' in opcao_escolhida:
                for key, value in opcao_escolhida['set_variable'].items():
                    state.set_variable(key, value)

            # Adicionar ao histórico
            state.add_to_history(scene_id, opcao_escolhida['text'])

        time.sleep(0.5)

    # Mostrar valores finais
    print('\n' + '='*60)
    print(state.mostrar_valores())

    # Mostrar histórico
    print('\n' + '='*60)
    print('HISTÓRICO DA JORNADA:')
    print('='*60)
    for i, escolha in enumerate(state.history, 1):
        print(f'{i}. {escolha["choice"]}')

    print('\n' + '='*60)
    print('🎮 FIM DA DEMONSTRAÇÃO')
    print('='*60 + '\n')

if __name__ == '__main__':
    simular_jornada()
