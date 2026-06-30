# MoonRock Saboaria — Contexto para IAs

> App educativo de saboaria artesanal para **Ana** (química UFMG, iniciante em saboaria).
> https://moonrock-saboaria.vercel.app
> GitHub: github.com/PedroAkaki/moonrock-saboaria

## Stack
Next.js 16 (App Router) + Tailwind + TypeScript + JSON estático + Vercel + PWA.
Dark theme lunar (preto+branco+hexágonos).

## Rotas principais
- `/` → Home com "Vamos Estudar" + "Continuar de onde parou"
- `/aprendizado` → Timeline visual de estudo (estilo roadmap.sh)
- `/aprendizado/[slug]` → Página de detalhe de cada nível/módulo
- `/calculadora` → Calculadora de saponificação
- `/oleos` → Biblioteca de 37 óleos
- `/receitas` → Catálogo de receitas

## Features já implementadas
- Calculadora NaOH com superfat, INS (alerta), DOS (alerta), forma (cm³→g→barras)
- 37 óleos com SAP, INCI, INS, perfil FA, disponibilidade BR
- PWA offline + ícone + splash screen
- Modal segurança EPI obrigatório
- Glossário com tooltips (35 termos hover)
- Roadmap visual estilo roadmap.sh (timeline vertical com nós)
- 3 níveis de estudo completos (Base Glicerinada, Sabão de Óleo Usado, Cold Process Básico)
- 5 níveis "Em Breve" (estruturados)
- Checklist de progresso (localStorage)
- "Continuar Estudo" na home (retoma de onde parou)

## Arquivos essenciais (saber que existem)

| Arquivo | Conteúdo |
|---------|----------|
| `app/aprendizado/page.tsx` | Página inicial do estudo (timeline visual) |
| `app/aprendizado/[slug]/page.tsx` | Página de detalhe de cada nível |
| `components/VisualRoadmap.tsx` | Timeline vertical com nós conectados |
| `components/LevelProgress.tsx` | Checklist interativo com localStorage |
| `data/learning-modules.json` | 8 níveis (3 completos, 5 esqueleto) |
| `data/curriculo.md` | Conteúdo editorial completo dos 8 níveis |
| `data/oils.json` | 37 óleos |
| `lib/soap/calculator.ts` | Engine matemático (NaOH, INS, DOS) |

## Comandos úteis
- `npm run dev` — desenvolvimento
- `npm run build` — build de produção

## Pendências (o que ainda falta)

### 🔥 Fase 2 — Ferramenta de Bancada (próxima)
**Receitas Ligadas aos Módulos v1** — fechar o ciclo: estudar → escolher receita → calcular → praticar.

Detalhes:
- Adicionar `relatedModuleSlugs` em recipes.json
- Seção "Receitas para praticar" em /aprendizado/[slug]
- Separar cosmético vs limpeza nas receitas
- Badges em /receitas

Depois:
- Biblioteca de óleos com função prática + substituições + risco DOS
- Diário de lote (registro de produção)

### ✅ Fase 1 — App de Estudo (CONCLUÍDO)
- Estudo Interativo v1 (quiz, cards, revisão, checklist pré-bancada)
- Calculadora explicativa (breakdown, tooltips, dark theme)
- Progresso unificado (lib/progress.ts — chave única localStorage)
- 3 níveis completos com estudo ativo

### 💤 Fase 3 — Avançado
- KOH, timer, custo, IFRA, PDF, modo mãos sujas

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
