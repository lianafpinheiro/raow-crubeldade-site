# Gerador de Convite Interativo - Kallyni 15 Anos

## 📜 Visão Geral

Sistema de geração de convites personalizados em tempo real para a festa de 15 anos da Kallyni. Permite que cada convidado crie e baixe sua própria versão do convite com seu nome personalizado.

## ✨ Funcionalidades

- **Personalização em Tempo Real**: Digite o nome e veja-o aparecer instantaneamente no convite
- **Download em Alta Resolução**: Gere imagens PNG de 800×1200px prontas para impressão ou compartilhamento digital
- **Design Celestial**: Tema noite estrelada com gradientes azul-escuro e detalhes dourados
- **Tipografia Elegante**: Fontes script e serif para um visual sofisticado
- **Ajuste Automático**: O tamanho da fonte se adapta automaticamente para nomes longos
- **Duas Versões**: Componente React integrado + página HTML standalone

## 🚀 Como Usar

### Versão React (Integrada ao App)

1. Inicie o servidor de desenvolvimento:
```bash
npm install
npm run dev
```

2. Abra o navegador em `http://localhost:3000`

3. Clique em "✨ Gerador de Convite Personalizado"

4. Digite o nome do convidado e clique em "Gerar meu convite"

### Versão Standalone (HTML Puro)

1. Abra o arquivo `convite-interativo.html` diretamente no navegador

2. Certifique-se de que o arquivo `assets/convite_base_sem_nome.png` está acessível

## 📁 Estrutura de Arquivos

```
raow-crubeldade-site/
├── src/
│   └── components/
│       └── ConviteInterativo.jsx        # Componente React
├── convite-interativo.html              # Versão standalone
├── generate_invitation_background.py    # Script gerador da imagem de fundo
├── assets/
│   └── convite_base_sem_nome.png       # Imagem de fundo (arte base)
└── public/
    └── assets/
        └── convite_base_sem_nome.png   # Cópia para servir via Vite
```

## 🎨 Configurações de Design

### Cores

- **Azul Noite**: `#050c1a` - Fundo principal
- **Azul Profundo**: `#071428` - Gradientes
- **Dourado**: `#f3d9a4` - Texto e detalhes
- **Dourado Intenso**: `#f7c76b` - Destaques e botões
- **Texto Suave**: `#e8edf7` - Texto secundário

### Tipografia

- **Título Decorativo**: "Pinyon Script" (cursive)
- **Títulos Formais**: "Playfair Display" (serif)
- **Corpo de Texto**: System fonts com fallback

### Canvas

- **Dimensões**: 800px × 1200px
- **Formato**: PNG
- **Posição do Nome**: Y = 620px (centro vertical superior)
- **Largura Máxima do Texto**: 80% da largura do canvas (640px)

## 🔧 Customização

### Ajustar a Posição do Nome

No arquivo `ConviteInterativo.jsx` ou `convite-interativo.html`, modifique:

```javascript
const config = {
  nameY: 620,           // Posição vertical (em pixels)
  fontSize: 90,         // Tamanho da fonte base
  minFontSize: 50,      // Tamanho mínimo para nomes longos
  nameMaxWidth: 640     // Largura máxima do texto
};
```

### Mudar o Estilo do Texto

Ajuste as propriedades no método de renderização:

```javascript
ctx.fillStyle = "#f3d9a4";           // Cor do texto
ctx.shadowColor = "rgba(0, 0, 0, 0.85)";  // Cor da sombra
ctx.shadowBlur = 18;                 // Intensidade do glow
```

### Regenerar a Imagem de Fundo

Se você precisa modificar a arte base (informações do evento, layout, etc.):

```bash
python3 generate_invitation_background.py
```

Isso regerará o arquivo `assets/convite_base_sem_nome.png` com as configurações atualizadas.

## 🧪 Testes

### Teste de Nomes Variados

Teste com diferentes comprimentos de nomes:

- **Curto**: "Ana", "João"
- **Médio**: "Kallyni", "Maria Silva"
- **Longo**: "Maria da Silva Santos", "Família Frasson Pinheiro"
- **Muito Longo**: "Senhor e Senhora Francisco de Assis"

Verifique se:
- A fonte diminui proporcionalmente para nomes longos
- O texto permanece centralizado
- A legibilidade é mantida

### Teste de Fontes

Verifique se as fontes web carregam corretamente:

1. Abra o DevTools do navegador (F12)
2. Vá para a aba Network
3. Filtre por "font"
4. Recarregue a página
5. Confirme que "Pinyon Script" e "Playfair Display" carregaram

Se as fontes não carregarem, o sistema usa fontes fallback automaticamente.

## 📦 Dependências

### React Component
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `vite`: ^5.4.9
- `tailwindcss`: ^3.4.14

### Python Script
- `Pillow`: ^12.0.0 (para geração de imagens)

Instale as dependências Python:
```bash
pip install Pillow
```

## 🌐 Integração com App Principal

O componente está integrado em `src/App.jsx`:

```javascript
import ConviteInterativo from './components/ConviteInterativo';

// ...
case 'convite-interativo':
  return <ConviteInterativo />;
```

Acessível através do menu principal com o botão:
**"✨ Gerador de Convite Personalizado"**

## 🎯 Detalhes do Evento

As informações do evento estão codificadas na imagem de fundo:

- **Evento**: 15 Anos da Kallyni - A Canção do Céu Azul
- **Data**: 20 de Dezembro de 2025
- **Horário**: 19h30
- **Local**: Cantina Nostra, Rua 10 de Novembro
- **RSVP**: +55 54 99638-1003

Para atualizar estas informações, edite `generate_invitation_background.py` e regenere a imagem.

## 🐛 Troubleshooting

### A imagem de fundo não carrega

**Problema**: Canvas mostra apenas o gradiente de fallback com estrelas.

**Solução**:
1. Verifique se `assets/convite_base_sem_nome.png` existe
2. Para a versão React, certifique-se de que o arquivo está em `public/assets/`
3. Verifique o console do navegador para erros de carregamento
4. Confirme que o caminho no código está correto

### As fontes não aparecem corretas

**Problema**: O texto aparece com fontes padrão do sistema.

**Solução**:
1. Verifique sua conexão com a internet (fontes carregam do Google Fonts)
2. Aguarde alguns segundos após o carregamento da página
3. O sistema tem fallbacks automáticos para fontes não disponíveis

### O download não funciona

**Problema**: Botão não gera o arquivo PNG.

**Solução**:
1. Verifique se seu navegador permite downloads automáticos
2. Desabilite bloqueadores de pop-up temporariamente
3. Teste em modo anônimo/privado
4. Tente um navegador diferente (Chrome, Firefox, Safari)

### Nome muito longo fica ilegível

**Problema**: Fonte fica pequena demais para nomes extensos.

**Solução**: Ajuste o `minFontSize` no código:
```javascript
minFontSize: 60  // Aumente de 50 para 60 ou mais
```

## 📄 Licença

Este projeto faz parte do repositório KALLYNI: A Canção do Céu Azul.

---

**Desenvolvido para a festa de 15 anos da Kallyni** ✨🎉

*"O céu é o limite"*
