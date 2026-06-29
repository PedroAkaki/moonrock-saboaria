# MoonRock Saboaria — Handoff para IA

## Projeto
App educativo de saboaria artesanal para **Ana** (química UFMG).
MVP ativo em https://moonrock-saboaria.vercel.app
Dark theme lunar (preto+branco+hexágonos).

## Stack
Next.js 16 (App Router), Tailwind CSS, TypeScript, JSON estático, Vercel, PWA.

## Estrutura do Repo
```
moonrock-saboaria/
├── app/
│   ├── page.tsx              → Landing page
│   ├── layout.tsx            → Layout escuro + PWA + hex-bg
│   ├── globals.css           → Tema escuro (moon-* colors)
│   ├── calculadora/page.tsx  → Calculadora NaOH+INS+DOS+FORMA
│   ├── oleos/page.tsx        → Biblioteca 37 óleos
│   ├── receitas/page.tsx     → Catálogo receitas
│   └── roadmap/page.tsx      → Roadmap atual (5 níveis, resumido)
├── components/
│   ├── GlossaryTerm.tsx      → Tooltips de glossário
│   └── SafetyChecklist.tsx   → Modal segurança EPI
├── lib/soap/
│   ├── calculator.ts         → Engine matemático (NaOH/KOH, INS, DOS, forma)
│   └── oils.ts               → Tipos e helpers dos óleos
├── data/
│   ├── oils.json             → 37 óleos com SAP, INS, FA, disponibilidade
│   ├── recipes.json          → 3 receitas
│   ├── roadmap.json          → 5 níveis resumidos
│   ├── glossary.json         → 35 termos
│   └── curriculo.md          → Currículo completo (8 níveis detalhados)
├── public/
│   ├── icon-192/512.png      → Ícone PWA (moon+rock)
│   ├── card-crystal.png      → Imagem card receita
│   ├── texture-craters.png   → Textura calculadora
│   ├── splash-crescent.png   → Splash screen
│   └── texture-veil.png      → Textura fundo telas
└── graphify-out/             → Grafo AST (156 nós, 151 arestas)
```

## Features Implementadas
- Calculadora: NaOH, superfat, ratio água, INS (alerta), DOS (alerta), forma (cm³→g→barras)
- 37 óleos com SAP, INS, perfil FA, disponibilidade BR, estabilidade
- Modal segurança EPI (obrigatório antes de ver resultados)
- Glossário com tooltips hover (35 termos)
- PWA (service worker + manifest, offline)
- Dark theme completo
- Planos no vault e PROJECT_PLAN.md

## Pesquisa Realizada (208KB)
11 arquivos em ~/Desktop/MoonRock/Deep Research/
Provedores: DeepSeek, Gemini, Z.ai GLM-5.2, GPT
Classificação GPT: óleos em 3 status (liberado / alerta / bloqueado)

## Próxima Etapa: Roadmap Interativo

Transformar o roadmap atual (5 níveis rasos) em **páginas de estudo detalhadas** para Ana.

### O que cada nível precisa ter:
- **Fundamentos** — química profunda (não básica — ela é formada em química)
- **Matérias-primas** — detalhes pertinentes ao nível
- **Processos** — passo a passo com temperaturas, tempos, mecanismos
- **Canais YouTube** — referências em vídeo
- **Referências** — artigos científicos, livros, normas
- **Critério de conclusão** — prático (produziu + aprovou)

### Os 8 níveis do currículo (`data/curriculo.md`):
1. Base Glicerinada (M&P)
2. Sabão de Óleo Usado
3. Cold Process Básico
4. Controle de Formulação
5. Hot Process
6. Cold Process Avançado (swirls, cores)
7. Saboaria Líquida (KOH)
8. Syndet e Formulação Avançada

### Sugestão de implementação:
- Cada nível do roadmap atual vira um link para `/roadmap/[id]/`
- Página de nível com seções expansíveis (accordion)
- Componente reutilizável `LevelDetail.tsx` que recebe dados do `curriculo.md`
- Checklist de progresso (localStorage)
- Links para calculadora quando aplicável

## Convenções
- UI em português, código em inglês
- "use client" só quando necessário (interatividade)
- Cores: moon-900 a moon-50 (globals.css)
- Dados estáticos em JSON em data/
- Tipos em lib/soap/oils.ts

## Links
- App: https://moonrock-saboaria.vercel.app
- GitHub: https://github.com/PedroAkaki/moonrock-saboaria
- Project plan: PROJECT_PLAN.md
- Currículo completo: data/curriculo.md

## Próximos passos sugeridos
1. Criar `/roadmap/[id]/page.tsx` para cada nível
2. Componente `LevelDetail` com abas/seções
3. Populary conteúdo de `curriculo.md` nos níveis
4. Sistema de progresso (checklist por nível)
5. Vincular calculadora e receitas nos níveis

---

## Especificação: Roadmap Interativo (Níveis de Estudo)

### Contexto
Ana é química pela UFMG. O roadmap atual em `data/roadmap.json` (5 níveis genéricos) é superficial demais. Precisamos de **páginas de estudo completas** com profundidade técnica real.

### Fonte de dados
`data/curriculo.md` contém o conteúdo completo de 8 níveis, cada um com:
- **Fundamentos** — química aplicada (cinética, diagramas de fase, mecanismos)
- **Matérias-primas** — detalhes pertinentes ao nível com viés químico
- **Processos** — passo a passo com temperaturas, tempos, reações
- **Canais YouTube** — referências brasileiras e internacionais
- **Referências** — artigos científicos (JAOCS, Langmuir, Embrapa), livros, normas ABNT
- **Critério de conclusão** — prático (produziu + aprovou no teste)

### Arquitetura Sugerida

#### Dados
Converter `data/curriculo.md` para `data/curriculo.json` (estruturado) com:
```json
{
  "levels": [
    {
      "id": "base-glicerinada",
      "title": "Base Glicerinada (Melt & Pour)",
      "order": 1,
      "color": "green",
      "icon": "cube",
      "sections": [
        {
          "id": "fundamentos",
          "title": "Fundamentos",
          "content": "...",
          "chemicalFormulas": ["..."],
          "keyConcepts": ["Ponto de fusão", "Recristalização"]
        },
        {
          "id": "materias-primas",
          "title": "Matérias-Primas",
          "content": "...",
          "items": [
            { "name": "Base Transparente", "details": "...", "chemistry": "..." }
          ]
        },
        {
          "id": "processos",
          "title": "Processos",
          "steps": ["Passo 1...", "Passo 2..."]
        },
        {
          "id": "referencias",
          "title": "Referências",
          "youtube": ["Canal X", "Canal Y"],
          "papers": ["Título - Autor - Ano"],
          "books": ["Título - Autor"]
        }
      ],
      "completionCriteria": "Produzir 3 barras sem bolhas...",
      "linkedRecipes": ["base-glicerina-mel"],
      "linkedCalculator": true
    }
  ]
}
```

#### Componentes
- **LevelCard** — card na página do roadmap que leva pro detalhe
- **LevelPage** — `/roadmap/[id]` com seções expansíveis (accordion)
- **LevelProgress** — checklist salvo em localStorage
- **ScientificFormula** — componente pra renderizar fórmulas químicas (LaTeX ou Unicode)
- **ReferenceLink** — link externo com ícone (YouTube, PDF, artigo)

#### Páginas
- `/roadmap` — mantém a visão geral com cards melhores
- `/roadmap/[id]` — página de detalhe com seções

### Fluxo do Usuário
1. Abre `/roadmap` → vê os 8 níveis como cards
2. Clica em um nível → vai pra `/roadmap/base-glicerinada`
3. Vê as seções: Fundamentos → MPs → Processos → Referências
4. Marca checklist de conclusão (salva no localStorage)
5. Avança para o próximo nível

### Implementação Priorizada

**Fase 1 (MVP do currículo):**
1. Estruturar `curriculo.json` a partir do `curriculo.md`
2. Criar `app/roadmap/[id]/page.tsx` com accordion sections
3. Melhorar `/roadmap` com cards linkando pros detalhes
4. Adicionar `levelProgress` no localStorage

**Fase 2 (Rico):**
5. Componente `ScientificFormula` para renderizar equações
6. Vídeos embutidos do YouTube
7. PDF/print de cada nível
8. Sistema de "nível concluído → desbloqueia próximo"

