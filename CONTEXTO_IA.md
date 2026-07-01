# MoonRock Saboaria — Contexto para IAs

> App educativo de saboaria artesanal para **Ana** (química UFMG, iniciante em saboaria).
> https://moonrock-saboaria.vercel.app
> GitHub: github.com/PedroAkaki/moonrock-saboaria

## Stack
Next.js 16 (App Router) + Tailwind v4 + TypeScript + JSON estático + Vercel + PWA.
Dark theme lunar (preto+branco+hexágonos). Tailwind sem config JS — tudo em `app/globals.css` com `@theme`.

## Features já implementadas

### ✅ Fase 1 — App de Estudo (concluída)
- Estudo Interativo v1 (quiz, cards, revisão, checklist pré-bancada)
- Calculadora explicativa (breakdown, tooltips, dark theme)
- Progresso unificado (`lib/progress.ts` — chave única localStorage, migração de chaves antigas)
- 3 níveis completos (Base Glicerinada, Sabão de Óleo Usado, Cold Process Básico)
- 5 níveis "Em Breve" (estruturados)
- Roadmap visual (timeline vertical com nós, status locked/available/done)
- "Continuar Estudo" na home (retoma de onde parou)
- ModuleTracker (último módulo visitado)
- InfoTooltip com pointerdown + Escape + hover
- GlossaryTerm com tooltips (35 termos)

### ✅ Motor de Estudo v1 — /aprendizado como painel
- Stats gerais: concluídos / em andamento / disponíveis
- Card "Continuar agora" com próxima ação recomendada
- Progresso granular por módulo (quiz, checklist, conclusão)
- Micro-status em cada nó do VisualRoadmap
- Barra de progresso percentual por módulo
- Badges de conquista discretos
- Helpers em `lib/learning.ts`

### ✅ Roadmap Visual v1 — /roadmap como mapa global
- Página `/roadmap` com visão panorâmica dos 8 níveis
- `RoadmapMap.tsx` — nós principais + tópicos laterais + links
- Conexões entre módulos, receitas, calculadora e óleos

### ✅ Fase 2 v1 — Receitas Ligadas aos Módulos (concluída)
- `relatedModuleSlugs`, `technique`, `category`, `safetyLevel`, `studyGoal` em recipes.json
- `RelatedRecipes.tsx` — filtra receitas por módulo
- Badges em /receitas (categoria, técnica, dificuldade, segurança)
- Separação cosmético vs limpeza com alerta visual

### ✅ v23.1 — Biblioteca de Óleos Avançada (majoritariamente concluída)
- Função prática (`formulaRole`, `beginnerNote`, `recommendedUse`) em 39 óleos
- Substituições (`substitutions` + `substitutionNotes`)
- Risco de DOS por óleo (`dosRisk`: baixo/medio/alto)
- Busca + 5 filtros (tipo, estabilidade, disponibilidade, DOS, confiança)
- Classificação (`confidenceLevel`: liberado/alerta/bloqueado)
- Borda vermelha em óleos com DOS alto ou bloqueado
- Exibe `shelfLife` nos cards

### ✅ v24 — Calculator Guardrails (concluído)
- `validateFormulaWarnings()` — maxPercent, confidenceLevel, DOS risk
- Warnings UI com severidade info/warning/danger + blocking
- Óleo bloqueado impede cálculo; maxPercent/DOS alertam mas não bloqueiam

### ✅ v25 — Receita → Calculadora (concluído)
- `UseRecipeInCalculatorButton.tsx` — botão âmbar, salva payload no localStorage
- Chave `moonrock:recipe:calculator:v1` (separada de `lastFormula:v1`)
- Calculadora lê, valida sem `any`, pré-preenche e remove chave
- Só receita CP Clássico (azeite+coco+mamona) compatível

### ✅ Base (sempre presente)
- Calculadora NaOH com superfat, INS (alerta), DOS (alerta), forma (cm³→g→barras)
- 39 óleos com SAP, INCI, INS, perfil FA, disponibilidade BR
- PWA offline + ícone + splash screen
- Modal segurança EPI obrigatório

## Rotas principais
- `/` → Home com "Vamos Estudar" + "Continuar de onde parou"
- `/roadmap` → Mapa visual global
- `/aprendizado` → Timeline de estudo (motor linear)
- `/aprendizado/[slug]` → Detalhe de cada nível
- `/calculadora` → Calculadora com guardrails v24
- `/oleos` → Biblioteca de 39 óleos com filtros e DOS
- `/receitas` → Catálogo com botão "Usar na Calculadora"

## Arquivos essenciais

| Arquivo | Conteúdo |
|---------|----------|
| `app/aprendizado/page.tsx` | Timeline visual de estudo |
| `app/aprendizado/[slug]/page.tsx` | Detalhe de cada nível |
| `components/VisualRoadmap.tsx` | Timeline com nós conectados |
| `components/RelatedRecipes.tsx` | Receitas relacionadas ao módulo |
| `components/ModuleQuiz.tsx` | Quiz interativo |
| `components/StudyCard.tsx` | Card de conceito |
| `components/UseRecipeInCalculatorButton.tsx` | Botão receita → calculadora (v25) |
| `data/learning-modules.json` | 8 níveis (3 completos) |
| `data/curriculo.md` | Currículo completo |
| `data/oils.json` | 39 óleos |
| `data/recipes.json` | 3 receitas (1 compatível) |
| `lib/soap/calculator.ts` | Engine + guardrails v24 |
| `lib/progress.ts` | Progresso unificado |

## Comandos úteis
- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- Slug real do módulo de óleo usado: `sabao-de-oleo-usado` (não `sabao-oleo-usado`)

### 🔥 Próximo — Módulo 4: Controle de Formulação
Migrar de `data/curriculo.md` para `learning-modules.json`.

### ⚡ Depois
- Seed de 5-6 novas receitas compatíveis com Calculadora
- Glossário expandido (45+ termos): Ponto de Krafft, Índice de acidez, Quelante, Fase alfa/beta, DOS
- Módulos 5 a 8 (um por vez)

### 💤 Futuro
Modo KOH, Timer, Calculadora de custo, IFRA, PDF batch sheet, Modo Mãos Sujas, Sincronia nuvem, Domínio próprio.

## 🚫 Não fazer agora
Login, backend, banco de dados, claims terapêuticos, comando de voz, Supabase, SaaS, sistema de usuários, marketplace.

## Regras de ouro
- Conteúdo técnico, adulto e prático — Ana é química, iniciante em saboaria
- Separar cosmético corporal vs sabão/saneante doméstico
- Toda prática com NaOH/KOH deve ter alerta de segurança
- INS, dureza, espuma, limpeza = **estimativas heurísticas**, não medição laboratorial
- Não inventar fontes, normas, valores SAP, IFRA ou regras ANVISA
- Build precisa passar (`npm run build`)
- Mobile-first, PWA deve continuar funcionando
- Slug real do módulo de óleo usado: `sabao-de-oleo-usado`
