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

## ✅ v23.1 — Biblioteca de Óleos Avançada (MAJORITARIAMENTE CONCLUÍDA)

Transformar a biblioteca de tabela para mentora de formulação:

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 23 | Função prática por óleo | ✅ | `formulaRole`, `beginnerNote`, `recommendedUse` em 39 óleos |
| 24 | Substituições possíveis | ✅ | `substitutions` (25/39) + `substitutionNotes` (39/39) |
| 25 | Risco de DOS por óleo | ✅ | `dosRisk` (baixo/medio/alto) derivado de iodine + stability |
| 26 | Busca/filtro na biblioteca | ✅ | Por nome/INCI/descrição + 5 filtros: tipo, estabilidade, disponibilidade, DOS, confiança |
| 27 | Classificação por confiança | ✅ | `confidenceLevel` (liberado/alerta/bloqueado) com badge visual |

**Pendente:** maxPercent < 10 com alerta especial, modo comparação entre óleos, link óleo → calculadora, `fattyAcids` em tooltip expansível, `cost`/`meltingPoint` com disclosure progressivo.

---

## ✅ v24 — Calculator Guardrails (CONCLUÍDO)

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 28 | `validateFormulaWarnings` | ✅ | Warnings por maxPercent, confidenceLevel, DOS risk |
| 29 | Warnings UI na calculadora | ✅ | Severidade info/warning/danger + blocking |
| 30 | Bloqueio por óleo bloqueado | ✅ | `confidenceLevel === "bloqueado"` impede cálculo |

---

## ✅ v25 — Receita → Calculadora (CONCLUÍDO)

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 31 | `UseRecipeInCalculatorButton` | ✅ | Botão que salva payload no localStorage e redireciona |
| 32 | Pré-preenchimento na calculadora | ✅ | Leitura + validação + preenchimento automático |
| 33 | Chave exclusiva | ✅ | `moonrock:recipe:calculator:v1` — separada de `lastFormula:v1` |

---

## ✅ v27 — Módulo 4: Controle de Formulação (CONCLUÍDO)

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 34 | Conteúdo do Módulo 4 | ✅ | 5 fundamentos, 6 studyCards, 5 quiz, checklist, exercício prático |
| 35 | INS, iodo, DOS, maxPercent, substituição | ✅ | Conceitos heurísticos com exemplos práticos |
| 36 | Integração com calculadora e biblioteca | ✅ | Warnings, maxPercent, confidenceLevel, dosRisk |

---

## 🔥 PRÓXIMO — Módulo 5: Hot Process

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 37 | Conteúdo do Módulo 5 | ⬜ | Migrar de `data/curriculo.md` |
| 38 | Quiz, cards, checklist | ⬜ | Mesmo padrão dos módulos 1-4 |

---

## ⚡ SEGUINTE

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 37 | Seed de 5-6 novas receitas compatíveis com Calculadora | ⬜ | Receitas que passam pelos guardrails v24 |
| 38 | Glossário expandido (45+ termos) | 🔄 | Adicionar Ponto de Krafft, Índice de acidez, Quelante, Fase alfa/beta, DOS |
| 39 | Completar módulos 5 a 8 | ⬜ | Um por vez, começando pelo 5 após o 4 |

---

## 💤 FUTURO — Features Avançadas

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 40 | Modo KOH na calculadora | ⬜ | Alternar entre NaOH e KOH |
| 41 | Timer de traço e cura | ⬜ | Cronômetro + notificação |
| 42 | Calculadora de custo por barra | ⬜ | Input preço/kg → custo por barra |
| 43 | IFRA checker | ⬜ | Validar dosagem de fragrância por categoria |
| 44 | Exportar ficha técnica PDF | ⬜ | Batch sheet |
| 45 | Modo "Mãos Sujas" | ⬜ | Botões gigantes, tela sempre acesa |
| 46 | Sincronização em nuvem | ⬜ | Turso ou similar |
| 47 | Domínio moonrock.pousadamayon.com | ⬜ | Só falta CNAME no Cloudflare |
| 48 | Modo iniciante vs avançado | ⬜ | Esconder dual lye, KOH, syndet |

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
