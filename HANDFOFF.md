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
│   │   └── [slug]/page.tsx       → Página de detalhe de cada nível
│   ├── calculadora/page.tsx      → Calculadora NaOH + guardrails v24
│   ├── oleos/page.tsx            → Biblioteca 39 óleos com filtros
│   ├── receitas/page.tsx         → Catálogo receitas + botão "Usar na Calculadora" (v25)
│   ├── diario/page.tsx           → Diário de lote
│   └── roadmap/page.tsx          → Mapa visual global
├── components/
│   ├── UseRecipeInCalculatorButton.tsx  → Botão receita → calculadora (v25)
│   ├── VisualRoadmap.tsx                → Timeline com nós + status
│   ├── LevelProgress.tsx                → Checklist conclusão
│   ├── StudyCard.tsx                    → Card de conceito
│   ├── ModuleQuiz.tsx                   → Quiz (multiple, true-false, short)
│   ├── QuickReviewBox.tsx               → Revisão rápida
│   ├── BeforePracticeChecklist.tsx      → Checklist pré-bancada
│   ├── ModuleTracker.tsx                → Último módulo visitado
│   ├── ResumeStudy.tsx                  → "Continuar de onde parou"
│   ├── RelatedRecipes.tsx               → Receitas relacionadas
│   ├── InfoTooltip.tsx                  → Tooltip de info
│   ├── GlossaryTerm.tsx                 → Tooltip de glossário
│   ├── SafetyChecklist.tsx              → Modal EPI obrigatório
│   └── ModuleOrbitMap.tsx               → Mapa de sub-nós do módulo
├── lib/
│   ├── progress.ts             → Progresso unificado (localStorage)
│   ├── learning.ts             → Helpers do motor de estudo
│   └── soap/
│       ├── calculator.ts       → Engine NaOH + guardrails v24
│       └── oils.ts             → Tipos + helpers (sem getRecommendedMax)
├── data/
│   ├── learning-modules.json   → 8 níveis (3 completos, 5 "em breve")
│   ├── oils.json               → 39 óleos com dosRisk, confidenceLevel
│   ├── recipes.json            → 3 receitas (1 compatível com calculadora)
│   ├── glossary.json           → 35 termos
│   ├── curriculo.md            → Currículo completo (8 níveis + apêndice)
│   ├── roadmap.json            → Roadmap antigo
│   └── deep-research-prompt.md → Prompt usado nas pesquisas
├── public/
│   ├── manifest.json           → PWA manifest
│   ├── sw.js                   → Service worker
│   ├── icon-192/512.png        → Ícone PWA
│   └── splash-crescent.png     → Splash screen
├── scripts/
│   └── build-project-doc.sh    → Gera .md completo do projeto
├── CONTEXTO_IA.md               → Contexto rápido para IAs
├── HANDFOFF.md                  → Este arquivo
└── PENDENCIAS.md                → Lista de pendências
```

## Estado Atual (01/07/2026)

### ✅ Fase 1 — App de Estudo (concluída)
- 8 níveis (3 completos, 5 "em breve")
- Quiz, cards, revisão, checklist pré-bancada, progresso unificado
- ModuleTracker + ResumeStudy
- Calculadora com breakdown, tooltips, dark theme

### ✅ Fase 2 v1 — Receitas Ligadas (concluída)
- `RelatedRecipes.tsx` filtra por módulo
- Badges em /receitas, separação cosmético vs limpeza
- Alerta de validação da calculadora

### ✅ v23.1 — Biblioteca de Óleos Avançada (majoritariamente concluída)
- Função prática (`formulaRole`, `beginnerNote`, `recommendedUse`) em 39 óleos
- Substituições (`substitutions` + `substitutionNotes`)
- Risco de DOS (`dosRisk`), classificação (`confidenceLevel`)
- Busca + 5 filtros, borda vermelha em óleos de risco
- `getRecommendedMax` deletado, validação movida para `validateInput` + `validateFormulaWarnings`

### ✅ v24 — Calculator Guardrails (concluído)
- `validateFormulaWarnings()`: maxPercent, confidenceLevel, DOS risk
- Warnings UI (info/warning/danger + blocking)
- Óleo bloqueado impede cálculo

### ✅ v25 — Receita → Calculadora (concluído)
- `UseRecipeInCalculatorButton.tsx` com payload no localStorage
- Chave `moonrock:recipe:calculator:v1` (separada de `lastFormula:v1`)
- Só receita CP Clássico compatível (azeite 70% + coco 20% + mamona 10%)
- Base glicerinada e óleo usado incompatíveis

### Features de base
- 39 óleos com SAP, INS, perfil FA, disponibilidade BR, estabilidade
- Calculadora: NaOH, superfat, água, INS (alerta), DOS (alerta), forma (cm³→g→barras)
- Modal segurança EPI obrigatório (8 itens, vinagre apenas superfícies)
- Glossário com tooltips hover (35 termos)
- PWA offline (precache de 6 rotas)
- Dark theme completo com hexágonos

### ✅ v33 — Módulo 6: Cold Process Avançado (concluído)
- De placeholder "em breve" para `available`, no padrão dos módulos 1-4
- Reologia da massa, tempo de trabalho, aceleração/seize, ricing, vanilina, cores em meio alcalino
- 8 studyCards, 6 quiz, diagnóstico visual de design (rios de glicerina, gel parcial, soda ash, superaquecimento)
- Glossário: 45 termos (rios de glicerina, gel parcial, ricing)

## Próximos passos (ordem recomendada)
1. 🔥 **Módulo 5: Hot Process** — migrar de curriculo.md
2. ⚡ Seed de 5-6 novas receitas compatíveis
3. ⚡ Glossário: Ponto de Krafft, Índice de acidez, Quelante, Fase alfa/beta
4. 💤 Módulos 7 e 8 (Saboaria Líquida KOH, Syndet)

## Convenções
- UI em português, código em inglês
- "use client" só quando necessário
- Cores: moon-900 a moon-50 (globals.css via @theme)
- Dados estáticos em JSON em data/
- Tipos em lib/soap/oils.ts e interfaces in-line nos componentes
- Tailwind v4: sem config JS, tudo em globals.css com `@theme`

## Links
- App: https://moonrock-saboaria.vercel.app
- GitHub: https://github.com/PedroAkaki/moonrock-saboaria
- Currículo completo: data/curriculo.md
- Gerador de doc completa: `bash scripts/build-project-doc.sh ~/Desktop/destino.md [contexto]`

## 🚫 Não fazer agora
Login, backend, banco de dados, claims terapêuticos, comando de voz, Supabase, SaaS, sistema de usuários, marketplace.

## Notas importantes
- Slug real do módulo de óleo usado: `sabao-de-oleo-usado` (não `sabao-oleo-usado`)
- Rota de estudo é `/aprendizado`, não `/roadmap`
- Service worker faz precache de `/aprendizado` (não `/roadmap`)
- `requiresCalculatorValidation` ≠ `usingCalculator`
- `maxPercent` agora é validado em `validateInput` + `validateFormulaWarnings`
- `getRecommendedMax` foi deletado em v23.1
