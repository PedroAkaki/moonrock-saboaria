# MoonRock Saboaria — Lista de Pendências (para delegar a IAs)

> **Legenda:** 🔥 Prioridade máxima | ⚡ Média | 💤 Baixa
> **Status:** ⬜ Não iniciado | 🔄 Em progresso | ✅ Concluído

---

## ✅ Fase 1 — App de Estudo (CONCLUÍDA)

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 1 | Criar `data/learning-modules.json` | ✅ | 8 níveis a partir de `data/curriculo.md` |
| 2 | Rota `/aprendizado/[slug]` | ✅ | Página dinâmica para cada nível de estudo |
| 3 | Timeline visual `/aprendizado` | ✅ | 8 níveis como cards clicáveis, status bloqueado/disponível/concluído |
| 4 | Níveis 1, 2, 3 completos | ✅ | Base Glicerinada, Óleo Usado, CP Básico |
| 5 | Níveis 4 a 8 como "em breve" | ✅ | Estrutura pronta, conteúdo resumido |
| 6 | Componente `LevelProgress` | ✅ | Checklist salvo em localStorage |
| 7 | Separar cosmético de limpeza | ✅ | Alertas visuais no módulo de óleo usado |
| 8 | Calculadora explicativa (breakdown) | ✅ | Fórmula passo a passo no resultado |
| 9 | Tooltips educativos nos campos | ✅ | Superfat, SAP, INS, DOS, água:soda |
| 10 | Dark theme completo | ✅ | Inputs/selects consistentes (sem fundo branco) |
| 11 | Estudo Interativo v1 | ✅ | Quiz, cards de conceito, revisão, checklist pré-bancada |
| 12 | Progresso Unificado | ✅ | `lib/progress.ts` com chave única + migração |
| 13 | InfoTooltip | ✅ | pointerdown + Escape + hover |
| 14 | ModuleTracker + ResumeStudy | ✅ | Último módulo + "Continuar de onde parou" |
| 15 | PWA + ícone + splash | ✅ | manifest.json + sw.js + ícones |

---

## ✅ Fase 2 v1 — Receitas Ligadas aos Módulos (CONCLUÍDA)

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 16 | `relatedModuleSlugs` em recipes.json | ✅ | Cada receita aponta para o(s) módulo(s) que pratica |
| 17 | Seção "Receitas para praticar" | ✅ | Em `/aprendizado/[slug]` via `RelatedRecipes.tsx` |
| 18 | Badges em `/receitas` | ✅ | Categoria, técnica, dificuldade, segurança |
| 19 | Separação cosmético vs limpeza | ✅ | Alerta visual + badge vermelho/roxo |
| 20 | Alerta de validação calculadora | ✅ | `requiresCalculatorValidation` para receitas com NaOH |
| 21 | `studyGoal` em recipes.json | ✅ | Objetivo pedagógico de cada receita |
| 22 | SW precache corrigido | ✅ | `/roadmap` → `/aprendizado` |

---

## ✅ Motor de Estudo v1 — /aprendizado como painel (CONCLUÍDO)

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 23 | Criar `lib/learning.ts` | ✅ | Helpers: progresso granular, próxima ação, stats, badges |
| 24 | Stats bar em /aprendizado | ✅ | Concluídos / em andamento / disponíveis |
| 25 | Card "Continuar agora" | ✅ | Próxima ação recomendada com link |
| 26 | Progresso granular no VisualRoadmap | ✅ | % + micro-status em cada módulo |
| 27 | Badges de conquista | ✅ | Primeiro módulo, Segurança validada, CP desbloqueado |
| 28 | Atualizar documentação | ✅ | CONTEXTO_IA.md e PENDENCIAS.md |

---

## ✅ Roadmap Visual v1 — Mapa completo da jornada (CONCLUÍDO)

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 29 | Criar `app/roadmap/page.tsx` | ✅ | Rota /roadmap com metadata |
| 30 | Criar `components/RoadmapMap.tsx` | ✅ | Mapa visual com nós expandíveis, tópicos e links |
| 31 | Atualizar home | ✅ | Botões: Começar Estudo → /aprendizado, Ver Mapa Completo → /roadmap |
| 32 | Atualizar documentação | ✅ | Diferenciação clara entre /aprendizado e /roadmap |

---

## 🔥 PRÓXIMO — Biblioteca de Óleos Avançada

Transformar a biblioteca de tabela para mentora de formulação:

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 23 | Função prática por óleo | ⬜ | Texto explicativo (ex: "estabiliza espuma") |
| 24 | Substituições possíveis | ⬜ | "Pode substituir palma por sebo ou banha" |
| 25 | Risco de DOS por óleo | ⬜ | Alerta visual se o óleo for instável |
| 26 | Busca/filtro na biblioteca | ⬜ | Por nome, tipo, disponibilidade, propriedades |
| 27 | Classificação GPT | ⬜ | Status: liberado / alerta / bloqueado |

---

## ⚡ SEGUINTE — Conteúdo e Profundidade

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 28 | Diário de lote | ⬜ | Cadastro: data, receita, peso, temperatura, pH, observações |
| 29 | Completar níveis 4 a 8 | ⬜ | Conteúdo existe em `curriculo.md`, falta migrar para learning-modules.json |
| 30 | Glossário expandido (50+ termos) | ⬜ | Expandir de 35 para 50+ |
| 31 | Seed de 12-20 receitas | ⬜ | A partir dos templates do GPT |

---

## 💤 FUTURO — Features Avançadas

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 32 | Modo KOH na calculadora | ⬜ | Alternar entre NaOH e KOH |
| 33 | Timer de traço e cura | ⬜ | Cronômetro + notificação |
| 34 | Calculadora de custo por barra | ⬜ | Input preço/kg → custo por barra |
| 35 | IFRA checker | ⬜ | Validar dosagem de fragrância por categoria |
| 36 | Exportar ficha técnica PDF | ⬜ | Batch sheet |
| 37 | Modo "Mãos Sujas" | ⬜ | Botões gigantes, tela sempre acesa |
| 38 | Sincronização em nuvem | ⬜ | Turso ou similar |
| 39 | Domínio moonrock.pousadamayon.com | ⬜ | Só falta CNAME no Cloudflare |
| 40 | Modo iniciante vs avançado | ⬜ | Esconder dual lye, KOH, syndet |

---

## NÃO FAZER AGORA (escopo congelado)

- ❌ Login/autenticação
- ❌ Banco de dados (Turso/PG) — app 100% estático
- ❌ Backend
- ❌ Refatorar stack (Next.js 16 + Tailwind)
- ❌ Alterar engine matemática (`lib/soap/calculator.ts`) sem pedido explícito
- ❌ Claims terapêuticos/cosméticos (proibido ANVISA)
- ❌ Misturar sabonete corporal com sabão de limpeza
- ❌ Comando de voz
- ❌ Sistema de usuários
- ❌ Animações complexas que prejudiquem performance mobile

---

## Critérios Globais de Qualidade

- Conteúdo em PT-BR
- Tom técnico, adulto e rigoroso (Ana é química UFMG, iniciante em saboaria)
- Explicar fundamentos químicos sem infantilizar
- Toda prática com NaOH/KOH deve ter alerta de segurança
- Separar claramente: cosmético / saneante / conteúdo educativo
- Não prometer benefícios terapêuticos
- Não inventar valores técnicos sem fonte (consultar `data/curriculo.md` e deep research)
- Build precisa passar (`npm run build`)
- Mobile-first (responsivo, touch targets ≥ 48px)
- PWA/offline deve continuar funcionando

---

## Decisões Técnicas Confirmadas

- Saponificação = hidrólise alcalina de triglicerídeos → sais de ácidos graxos + glicerol
- NaOH = sabão sólido/barra; KOH = sabão líquido/macio (não intercambiáveis)
- SAP = valor médio, sujeito a variação por lote/fornecedor. Superfat cobre essa variação
- INS, iodo, dureza, limpeza, espuma, condicionamento = **estimativas heurísticas**, não medição laboratorial
- Sabão de óleo usado = limpeza doméstica, **nunca** sabonete corporal
- Fragrâncias devem respeitar limite do fornecedor/IFRA; percentual genérico ≠ permissão universal
- Segurança: EPIs, soda na água (nunca inverso), lavar com água corrente em contato (nunca vinagre na pele)
- Regulatório ANVISA: pendente de validação primária antes de texto final sobre venda
- Slug real do óleo usado: `sabao-de-oleo-usado` (não `sabao-oleo-usado`)
