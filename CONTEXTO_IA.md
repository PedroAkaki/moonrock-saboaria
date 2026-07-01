# MoonRock Saboaria — Contexto para IAs

> App educativo de saboaria artesanal para **Ana** (química UFMG, iniciante em saboaria).
> https://moonrock-saboaria.vercel.app
> GitHub: github.com/PedroAkaki/moonrock-saboaria

## Stack
Next.js 16 (App Router) + Tailwind v4 + TypeScript + JSON estático + Vercel + PWA.
Dark theme lunar (preto+branco+hexágonos). Tailwind sem config JS — tudo em `app/globals.css` com `@theme`.

## Rotas principais
- `/` → Home com "Vamos Estudar" + "Continuar de onde parou"
- `/aprendizado` → Timeline visual de estudo (estilo roadmap.sh)
- `/aprendizado/[slug]` → Página de detalhe de cada nível/módulo
- `/calculadora` → Calculadora de saponificação
- `/oleos` → Biblioteca de 37 óleos
- `/receitas` → Catálogo de receitas

## Features já implementadas

### ✅ Fase 1 — App de Estudo
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

### ✅ Fase 2 v1 — Receitas Ligadas aos Módulos
- `relatedModuleSlugs`, `technique`, `category`, `safetyLevel`, `studyGoal`, `requiresCalculatorValidation` em recipes.json
- `components/RelatedRecipes.tsx` — filtra receitas por módulo, mostra badges + estudo + alertas
- Seção "Receitas para praticar" em /aprendizado/[slug]
- Badges em /receitas (categoria, técnica, dificuldade, segurança)
- Separação cosmético vs limpeza com alerta visual
- Alerta de validação da calculadora para receitas com NaOH

### ✅ Base (sempre presente)
- Calculadora NaOH com superfat, INS (alerta), DOS (alerta), forma (cm³→g→barras)
- 37 óleos com SAP, INCI, INS, perfil FA, disponibilidade BR
- PWA offline + ícone + splash screen
- Modal segurança EPI obrigatório

## Arquivos essenciais

| Arquivo | Conteúdo |
|---------|----------|
| `app/aprendizado/page.tsx` | Página inicial do estudo (timeline visual) |
| `app/aprendizado/[slug]/page.tsx` | Página de detalhe de cada nível |
| `components/VisualRoadmap.tsx` | Timeline vertical com nós conectados |
| `components/RelatedRecipes.tsx` | Receitas relacionadas ao módulo (Fase 2) |
| `components/LevelProgress.tsx` | Checklist interativo com localStorage |
| `components/ModuleQuiz.tsx` | Quiz interativo (multiple, true/false, short) |
| `components/StudyCard.tsx` | Card de conceito com definição, erro, prática |
| `components/ResumeStudy.tsx` | Card "Continuar de onde parou" |
| `data/learning-modules.json` | 8 níveis (3 completos, 5 esqueleto) |
| `data/curriculo.md` | Conteúdo editorial completo dos 8 níveis |
| `data/oils.json` | 37 óleos |
| `data/recipes.json` | Receitas com metadados da Fase 2 |
| `lib/soap/calculator.ts` | Engine matemático (NaOH, INS, DOS) |
| `lib/progress.ts` | Progresso unificado localStorage |

## Comandos úteis
- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `bash scripts/build-project-doc.sh ~/Desktop/destino.md` — gerar .md completo do projeto

## Pendências (próximas)

### 🔥 Próximo: Biblioteca de Óleos Avançada
Transformar a biblioteca de tabela para mentora de formulação:
- função prática de cada óleo na fórmula
- substituições possíveis
- risco de DOS por óleo
- busca/filtro (nome, tipo, disponibilidade)
- classificação GPT (liberado / alerta / bloqueado)

### ⚡ Depois
- Diário de Lote (registro de produção)
- Completar níveis 4 a 8 (conteúdo existe em curriculo.md)
- Expandir glossário para 50+ termos
- Seed de 12-20 receitas

### 💤 Futuro
- Modo KOH, Timer, Calculadora de custo, IFRA, PDF batch sheet
- Modo Mãos Sujas, Sincronia nuvem, Domínio próprio

## 🚫 Não fazer agora
Login, backend, banco de dados, claims terapêuticos, comando de voz, Supabase, SaaS, sistema de usuários, marketplace.

## Regras de ouro
- Conteúdo técnico, adulto e prático: Ana é química, mas iniciante em saboaria
- Nada de resumo genérico, blog superficial ou tom de TikTok
- Sempre separar: cosmético corporal (ex: Cold Process) vs sabão/saneante doméstico (ex: óleo usado)
- Toda prática com NaOH/KOH deve ter alerta de segurança
- INS, dureza, espuma, limpeza e condicionamento são **estimativas heurísticas**, não medição laboratorial
- Não inventar fontes, normas, valores SAP, IFRA ou regras ANVISA
- Quando faltar confiança, marcar como "pendente de validação"
- Não criar claims terapêuticos, dermatológicos ou medicinais
- Build precisa passar (`npm run build`)
- Mobile-first, PWA deve continuar funcionando
- Slug real do módulo de óleo usado: `sabao-de-oleo-usado` (não `sabao-oleo-usado`)
