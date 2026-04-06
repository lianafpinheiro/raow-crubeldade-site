# Sàfra Bruta · Sistema Editorial Completo

## Arquivos

### 1. **safra-bruta-brutal.html** ⭐ RECOMENDADO
**Versão visual sofisticada com Pacote 3 (brutalismo mineral)**

- Design completo com animações, gradientes controlados
- CSS sofisticado que espelha a bruteza do romance
- Paleta mineral refinada
- Otimizado para leitura imersiva

**Como usar:**
```bash
open safra-bruta-brutal.html  # macOS
# ou
xdg-open safra-bruta-brutal.html  # Linux
# ou abra em seu navegador
```

### 2. **safra-bruta-completo.html**
**Versão minimalista, pura estrutura**

- HTML estrutural, sem CSS sofisticado
- Foco em conteúdo e legibilidade
- Ideal para edição ou referência rápida

### 3. **massa-madre.html**
**Sistema de avaliação editorial funcional**

- 6 Leis da Obra (Regime Canónico)
- 6 Forças em Regime (personagens)
- Sistema de avaliação com armazenamento local
- Gera pareceres editorialais em texto puro
- Exportável para PDF via navegador

---

## Gerar PDF

### Opção 1: Navegador (Recomendado)

1. Abra `safra-bruta-brutal.html` no navegador
2. Pressione **Ctrl+P** (Windows/Linux) ou **Cmd+P** (macOS)
3. Selecione "Salvar como PDF"
4. Configure:
   - Orientação: Retrato
   - Margens: Normal ou Mínimo
   - Habilite "Gráficos de fundo"
5. Salve como `safra-bruta-brutal.pdf`

### Opção 2: Linha de comando (se tiver wkhtmltopdf instalado)

```bash
wkhtmltopdf safra-bruta-brutal.html safra-bruta-brutal.pdf
```

### Opção 3: Python + weasyprint

```bash
pip install weasyprint
python3 << 'EOF'
from weasyprint import HTML
HTML('safra-bruta-brutal.html').write_pdf('safra-bruta-brutal.pdf')
EOF
```

---

## Massa Madre · Sistema de Avaliação

Abra `massa-madre.html` no navegador e:

1. **Visualizar as 6 Leis** em seção dedicada
2. **Ver Forças em Regime** (6 personagens/organismos)
3. **Avaliar um texto**:
   - Preencha metadados (título, versão, avaliador, data)
   - Honre ou questione cada Lei
   - Adicione observações por Lei
   - Selecione decisão final
4. **Gerar Parecer Limpo**:
   - Sistema monta texto automático
   - Copie para área de transferência
   - Exporte para PDF via navegador

**Dados são salvos localmente** no navegador (localStorage).

---

## Estrutura Visual

### safra-bruta-brutal.html

```
Nav (fixa, mineral)
  ↓
Abertura (com linha ácida, animações)
  ↓
Regime Canónico (6 Leis)
  ↓
Forças em Regime (6 Personagens)
  ↓
Estrutura Canónica (5 Blocos romanescos)
  ↓
Coda (frase final + metadados)
  ↓
Footer (assinatura + selo)
```

### Paleta de Cores (Pacote 3)

```
--pedra:        #0a0908  (fundo base)
--basalto:      #11100f  (fundo secundário)
--ferrugem:     #5a2a1d  (acentos, labels)
--cal:          #ddd1bc  (texto principal)
--neve:         #ebe4d8  (títulos)
--palha:        #bda27b  (secundário)
```

**Zero dourado, zero boutique. Só pedra.**

---

## Tipografia

- **Serif**: Cormorant Garamond (títulos, prosa)
- **Mono**: IBM Plex Mono (labels, navegação)
- **Weight**: Primariamente 300 (light), 400 (regular)
- **Letter-spacing**: Mínimo, controlado (0.002em a 0.32em)

---

## Responsividade

Todos os arquivos são **fully responsive**:
- Mobile (< 768px): Layout ajustado, fontes escalonadas
- Tablet (768px–1024px): Grid reajustado
- Desktop (> 1024px): Experiência completa

---

## Pacotes Aplicados

### Pacote 1 (Conceitual)
- Reescrita de 8 critérios genéricos → 6 Leis da Obra
- Integração de 6 Forças em Regime (personagens)
- Substituição de tom curatorial por ton material

### Pacote 2 (Textual — Cruel)
- "Lei da Obra" → "Regime Canónico"
- "Organismos em Campo" → "Forças em Regime"
- "Macroestrutura" → "Estrutura Canónica"
- Versão mais dura das Leis
- Remoção de metadados de submissão
- Footer: "A casa tem fome." (ao invés de tese)
- Abertura linha: "Basalto · borra · retenção · safra"

### Pacote 3 (Visual — Brutalismo Mineral)
- Paleta de cores 22 ajustes CSS refinados
- Animações sutis (emerge, crescer, pressao, pulso)
- Gradientes controlados
- Remoção de efeitos vistosos
- Tipografia seca
- Sem "luxo editorial subterrâneo"

---

## Notas Finais

**Objetivo**: Criar um sistema editorial que é:
- ✓ Espelho canônico do romance
- ✓ Sem frescura curatorial
- ✓ Brutalista mineral
- ✓ Funcional (avaliação integrada)
- ✓ Pronto para impressão/PDF
- ✓ Material, não simbólico

**A Madre não simboliza. Age.**

---

## Arquivos Inclusos

```
.
├── safra-bruta-brutal.html        (RECOMENDADO · Pacote 3 visual)
├── safra-bruta-completo.html      (Minimalista · estrutural)
├── massa-madre.html               (Sistema de avaliação)
├── GUIA-SAFRA-BRUTA.md           (Este arquivo)
└── generate-pdfs.js              (Script para conversão automática)
```

---

**Versão**: v3.0 (Pacote 1 + Pacote 2 + Pacote 3)  
**Data**: 6 de Abril de 2026  
**Autora**: Violeta Wilde  
**Sistema Editorial**: Massa Madre · A Liturgia da Terra
