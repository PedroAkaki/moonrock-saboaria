# MoonRock Saboaria — Handoff para IA

## Projeto
App educativo de saboaria artesanal para **Ana** (química UFMG).
MVP ativo em https://moonrock-saboaria.vercel.app
Dark theme lunar (preto+branco+hexágonos).

## Stack
Next.js 16 (App Router), Tailwind CSS v4, TypeScript, JSON estático, Vercel, PWA.

## Estrutura do Repo
```
moonrock-saboaria/
├── app/
│   ├── page.tsx                  → Landing page (hero + cards + "Continuar Estudo")
│   ├── layout.tsx                → Layout escuro + PWA + hex-bg
│   ├── globals.css               → Tema escuro (moon-* colors via @theme)
│   ├── aprendizado/
│   │   ├── page.tsx              → Timeline visual de estudo (8 níveis)
│   │   └── [slug]/page.tsx       → Página de detalhe de cada nível/módulo
│   ├── calculadora/page.tsx      → Calculadora NaOH+INS+DOS+FORMA
│   ├── oleos/page.tsx            → Biblioteca 37 óleos
│   └── receitas/page.tsx         → Catálogo receitas (com badges Fase 2)
├── components/
│   ├── VisualRoadmap.tsx         → Timeline com nós + status (locked/available/done)
│   ├── LevelProgress.tsx         → Checklist de conclusão (localStorage)
│   ├── StudyCard.tsx             → Card de conceito (definição, erro, prática)
│   ├── ModuleQuiz.tsx            → Quiz (multiple-choice, true-false, short)
│   ├── QuickReviewBox.tsx        → Revisão rápida em tópicos
│   ├── BeforePracticeChecklist.tsx → Checklist pré-bancada
│   ├── ModuleTracker.tsx         → Rastreia último módulo visitado
│   ├── ResumeStudy.tsx           → Card "Continuar de onde parou"
│   ├── RelatedRecipes.tsx        → Receitas relacionadas ao módulo (Fase 2)
│   ├── InfoTooltip.tsx           → Tooltip de info (?) com clickOutside
│   ├── GlossaryTerm.tsx          → Tooltip de glossário (hover)
│   └── SafetyChecklist.tsx       → Modal segurança EPI obrigatório
├── lib/
│   ├── progress.ts               → Progresso unificado (localStorage, migração)
│   └── soap/
│       ├── calculator.ts         → Engine: NaOH/KOH, INS, DOS, forma, mold
│       └── oils.ts               → Tipos e helpers dos óleos
├── data/
│   ├── learning-modules.json     → 8 níveis (3 completos, 5 "em breve")
│   ├── oils.json                 → 37 óleos com SAP, INS, FA, disponibilidade
│   ├── recipes.json              → 3 receitas (com metadados Fase 2)
│   ├── glossary.json             → 35 termos
│   ├── curriculo.md              → Currículo completo (8 níveis + apêndice químico)
│   ├── roadmap.json              → Roadmap antigo (5 níveis, manter histórico)
│   └── deep-research-prompt.md   → Prompt usado nas pesquisas
├── public/
│   ├── manifest.json             → PWA manifest
│   ├── sw.js                     → Service worker (precache /aprendizado)
│   ├── icon-192/512.png          → Ícone PWA
│   └── splash-crescent.png       → Splash screen
├── scripts/
│   └── build-project-doc.sh      → Gera .md completo do projeto (~190KB)
├── CONTEXTO_IA.md                → Contexto rápido para IAs
├── HANDFOFF.md                   → Este arquivo
└── PENDENCIAS.md                 → Lista de pendências
```

## Estado Atual (01/07/2026)

### ✅ Fase 1 — App de Estudo (concluída)
- 8 níveis de estudo em `data/learning-modules.json` (3 completos, 5 "em breve")
- Rotas: `/aprendizado` (timeline) e `/aprendizado/[slug]` (detalhe)
- Quiz, cards de conceito, revisão rápida, checklist pré-bancada e checklist de conclusão
- Progresso unificado via localStorage (`lib/progress.ts`) com migração de chaves antigas
- ModuleTracker + ResumeStudy ("Continuar de onde parou")
- Calculadora com breakdown passo a passo, tooltips, dark theme completo

### ✅ Fase 2 v1 — Receitas Ligadas aos Módulos (concluída)
- `data/recipes.json`: campos `relatedModuleSlugs`, `technique`, `category`, `safetyLevel`, `studyGoal`, `requiresCalculatorValidation`
- `components/RelatedRecipes.tsx`: filtra receitas por módulo, mostra badges + estudo + alertas
- `/aprendizado/[slug]` exibe "Receitas para praticar este módulo"
- `/receitas` com badges (categoria, técnica, dificuldade) e alertas (limpeza, validação)
- Separação cosmético vs limpeza com alerta visual
- Alerta de validação da calculadora para receitas com NaOH

### Features de base
- Calculadora: NaOH, superfat, ratio água, INS (alerta), DOS (alerta), forma (cm³→g→barras)
- 37 óleos com SAP, INS, perfil FA, disponibilidade BR, estabilidade
- Modal segurança EPI obrigatório (8 itens de checklist)
- Glossário com tooltips hover (35 termos)
- PWA (service worker + manifest, offline, precache de 6 rotas)
- Dark theme completo com hexágonos

## Convenções
- UI em português, código em inglês
- "use client" só quando necessário (interatividade)
- Cores: moon-900 a moon-50 (definidas em globals.css via @theme)
- Dados estáticos em JSON em data/
- Tipos em lib/soap/oils.ts e interfaces in-line nos componentes
- Tailwind v4: sem config JS, tudo em globals.css com `@theme`

## Links
- App: https://moonrock-saboaria.vercel.app
- GitHub: https://github.com/PedroAkaki/moonrock-saboaria
- Project plan: PROJECT_PLAN.md
- Currículo completo: data/curriculo.md
- Gerador de doc completa: `bash scripts/build-project-doc.sh ~/Desktop/destino.md`

## Próximos passos (ordem recomendada)

### 🔥 1. Biblioteca de Óleos Avançada
Transformar a biblioteca de tabela para mentora de formulação:
- Função prática de cada óleo na fórmula (ex: "estabiliza espuma")
- Substituições possíveis (ex: "palma → sebo ou banha")
- Risco de DOS por óleo (alerta visual se instável)
- Busca/filtro (nome, tipo, disponibilidade, propriedades)
- Classificação GPT (liberado / alerta / bloqueado)

### ⚡ 2. Diário de Lote
Registro de produção: data, receita, peso, temperatura, fotos, pH, observações.

### ⚡ 3. Completar níveis 4 a 8
Conteúdo existe em `data/curriculo.md`, precisa passar para `learning-modules.json`.

### 💤 4. Glossário expandido (50+ termos)
### 💤 5. Seed de 12-20 receitas
### 💤 6. Modo KOH, Timer, Calculadora de custo, IFRA, PDF

## 🚫 Não fazer agora
Login, backend, banco de dados, claims terapêuticos, comando de voz, Supabase, SaaS, sistema de usuários, marketplace.

## Notas importantes
- Slug real do módulo de óleo usado: `sabao-de-oleo-usado` (não `sabao-oleo-usado`)
- Rota de estudo é `/aprendizado`, não `/roadmap` (rota antiga removida)
- Service worker faz precache de `/aprendizado` (não `/roadmap`)
- O componente `RelatedRecipes` usa `recipesData.recipes` (formato `{ description, recipes }`)
- `requiresCalculatorValidation` é diferente de `usingCalculator`: o primeiro é usado na UI de alerta da Fase 2
