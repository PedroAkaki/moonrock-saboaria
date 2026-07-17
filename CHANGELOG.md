# Changelog — MoonRock Saboaria

Todas as versões notáveis do MoonRock Saboaria.

---

## v32 — Cold Process Avançado completo (17/07/2026)

**Arquivos:** `data/learning-modules.json`, `data/curriculo.md`, `data/roadmap-nodes.ts`, `app/aprendizado/[slug]/page.tsx`

- Módulo 6 (Cold Process Avançado) expandido de prévia para módulo completo e desbloqueado (`status: available`)
- Conteúdo novo baseado em pesquisa (Soap Queen, Lovin Soap, School of Natural Skincare, 7VIRIDES, Dunn): reologia do traço, receitas "lentas", seize/ricing, gel phase como decisão estética, soda ash, glycerin rivers e química de corantes em pH 9-10
- 9 fundamentos químicos, processo em 11 passos (drop/ITP/hanger/camadas), 7 studyCards, quiz com 6 questões, diagnóstico de trace com estado "Emulsão Estável", exercício prático e checklists
- Roadmap: nó `cold-process-avancado` passa de `locked` para `learning-module` com link
- `curriculo.md` Nível 6 ampliado com os mesmos achados

---

## v31.3 — Learning Orbit Refactor (01/07/2026)

**Arquivos:** `components/LearningOrbit.tsx` (novo), `components/MainLearningOrbit.tsx` (novo), `components/ModuleOrbitMap.tsx` (refatorado), `app/aprendizado/page.tsx`

- Criação de `LearningOrbit` — componente genérico de órbita reutilizável
- Criação de `MainLearningOrbit` — órbita principal dos 8 módulos em `/aprendizado`
- Correção de alinhamento do `ModuleOrbitMap`: separação entre wrapper `translate(x,y)` e botão `-translate-x/y`
- Substituição do `VisualRoadmap` por `MainLearningOrbit` na página `/aprendizado`
- Módulos 5-8 mantidos como locked

---

## v31.1 — Roadmap Micro-polish (01/07/2026)

**Arquivos:** `components/RoadmapMap.tsx`

- Badge "◉ Você está aqui" com pulse no nó atual
- Texto explicativo em nós bloqueados: "Complete os módulos anteriores para desbloquear"
- Fade gradiente na borda direita para indicar scroll horizontal mobile
- `focus-visible:ring` nos links clicáveis para acessibilidade

---

## v31 — Roadmap Visual Polish (01/07/2026)

**Arquivos:** `components/RoadmapMap.tsx`

- Tópicos laterais agrupados por tipo (Conceito, Segurança, Ferramenta, Receita)
- Nó bloqueado com badge "🔒 Em breve" + opacidade reduzida
- Backbone vertical com gradiente linear (dourado → transparente)
- Barra de progresso com gradiente `from-purple-500 to-purple-300`
- Legend expandida com ícone de bloqueado
- Espaçamento aumentado (`min-w-[880px]`, laterais 260px)
- Lint limpo: `lastSection` mutável → derivado do índice do array

---

## v30 — Roadmap Preview 5-8 (01/07/2026)

**Arquivos:** `data/learning-modules.json`

- Módulos 5-8 expandidos de 1 linha para prévias completas:
  - summary, objective, scope_warning, prerequisites
  - 2-3 parágrafos de fundamentals
  - safety, conclusion_criteria, quickReview, related_glossary
- **Não** adicionados: quiz, studyCards, processo, checklist, exercício
- Módulos 5-8 mantidos como `soon`

---

## v29.1 — Backup Completo (01/07/2026)

**Arquivos:** `lib/storage/backup.ts`

- `confirm()` antes de importar: "Substituir lotes e progresso?"
- Suporte a backup legado (só batches, sem progress)
- Validação separada para `hasProgress` e `hasBatches`

---

## v29 — Storage Foundation + Backup JSON (01/07/2026)

**Arquivos:** `lib/storage/backup.ts` (novo), `app/diario/page.tsx`

- `exportBackup()` — exporta progresso + batches para JSON versionado
- `importBackup()` — valida schema, escreve localStorage, nunca corrompe dados atuais
- `downloadJson()` + `readJsonFile()` — utilitários de arquivo
- Botões Exportar/Importar no header do Diário
- Formato: `{ version, exportedAt, app, progress, batches }`

---

## v28 — Seed de Experimentos Guiados (01/07/2026)

**Arquivos:** `data/recipes.json`, `app/page.tsx`

- 6 novas receitas: 3 M&P, 2 óleo usado, 1 CP simples
- Total: 3 → 9 receitas
- Home atualizada: 3 → 9 receitas guiadas
- Receitas M&P sem calculadora; óleo usado com validação; CP compatível com v25

---

## v27 — Módulo 4: Controle de Formulação (01/07/2026)

**Arquivos:** `data/learning-modules.json`

- Módulo 4 de `soon` → `available` com conteúdo completo
- 5 fundamentos (INS, iodo, maxPercent, substituição, heurística vs teste)
- 6 studyCards, 5 quiz (cf1-cf5), 7 quickReview, 6 beforePracticeChecklist
- Glossário sem termos ausentes (10 referências)
- Módulos 5-8 mantidos como `soon`

---

## v26.2 — Glossário Expandido (01/07/2026)

**Arquivos:** `data/glossary.json`

- +7 termos: gel phase, glicerol, higroscópico, oxidação lipídica, SAP, soda livre, triglicerídeos
- Total: 35 → 42 termos
- 0 termos referenciados sem entrada no glossário

---

## v26.1 — Home Count Fix (01/07/2026)

**Arquivos:** `app/page.tsx`

- "37 óleos" → "39 óleos" (2 ocorrências)
- Investigação do glossário: 36 termos, estrutura íntegra, sem correção necessária

---

## v26 — Project Docs Sync (01/07/2026)

**Arquivos:** `PENDENCIAS.md`, `CONTEXTO_IA.md`, `HANDFOFF.md`

- Biblioteca de Óleos marcada como majoritariamente concluída
- v24 e v25 adicionadas como concluídas
- Próximo passo redefinido: Módulo 4 apenas (não 4-8 em lote)
- Diário de Lote removido das pendências (já implementado)

---

## v25 — Receita → Calculadora (01/07/2026)

**Arquivos:** `components/UseRecipeInCalculatorButton.tsx` (novo), `app/receitas/page.tsx`, `app/calculadora/page.tsx`, `data/recipes.json`

- Botão "Usar esta receita na calculadora" para receitas compatíveis
- Payload salvo em `moonrock:recipe:calculator:v1`
- Calculadora lê, valida tipagem sem `any`, pré-preenche e remove chave
- Apenas receita CP Clássico (azeite 70% + coco 20% + mamona 10%) compatível
- Chave `lastFormula:v1` mantida exclusiva para Calculadora → Diário

---

## v24 — Calculator Guardrails (01/07/2026)

**Arquivos:** `lib/soap/calculator.ts`, `app/calculadora/page.tsx`

- `validateFormulaWarnings()` com 3 regras:
  - maxPercent: warning até +5%, danger acima
  - confidenceLevel: alerta → warning, bloqueado → danger + blocking
  - DOS risk: >=10% warning, >=20% ou >=10%+superfat>8 → danger
- Warnings UI na calculadora (info/warning/danger)
- Bloqueio de cálculo por óleo bloqueado

---

## v23.1 — Biblioteca de Óleos Avançada (01/07/2026)

**Arquivos:** `lib/soap/oils.ts`, `lib/soap/calculator.ts`, `app/oleos/page.tsx`

- `getRecommendedMax` deletado (retornava 100 fixo)
- `getOilDifficulty` deletado (nunca usado)
- `validateInput` agora valida `maxPercent` por óleo
- `recommendedUse` e `shelfLife` exibidos nos cards
- Borda vermelha sutil em óleos com DOS alto ou bloqueado
- Comentário órfão removido

---

## v22 — Correções químicas no Módulo 2 (30/06/2026)

- FFA/AGL corrigido: "excesso de gordura não saponificada", não "soda livre"
- Quiz ou3 corrigido com explicação correta
- SafetyChecklist: "Vinagre apenas para superfícies"
- TRACE_LABELS: +Aceleração +Separação de Fases
- ModuleOrbitMap: descrição do superfat corrigida
- 5 ocorrências de "soda livre" removidas

---

## v21 — Módulos 1, 2, 3 expandidos (30/06/2026)

- Módulo 3: trace_diagnosis expandido (6 entradas), studyCard água:soda, quiz cp6
- Módulo 2: FFA, purificação, trace_diagnosis, ou3/ou4, água:soda corrigida
- Módulo 1: solventes, plastificantes, técnicas design, mp4/mp5

---

## v20 — Roadmap data-driven (30/06/2026)

- Roadmap com statusSource, tipos, backbone mascarado, conectores tracejados

---

## v19 e anteriores — Motor de Estudo, Receitas, Fase 1

- Consultar `git log --oneline` para versões anteriores à v20
