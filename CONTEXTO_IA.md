# MoonRock Saboaria — Contexto para IAs

> App educativo de saboaria artesanal para **Ana** (química UFMG, iniciante em saboaria).
> https://moonrock-saboaria.vercel.app
> GitHub: github.com/PedroAkaki/moonrock-saboaria

## Stack
Next.js 16 (App Router) + Tailwind + TypeScript + JSON estático + Vercel + PWA.
Dark theme lunar (preto+branco+hexágonos).

## Features já implementadas
- Calculadora NaOH com superfat, INS (alerta), DOS (alerta), forma (cm³→g→barras)
- 37 óleos com SAP, INCI, INS, perfil FA, disponibilidade BR
- PWA offline + ícone + splash screen
- Modal segurança EPI obrigatório
- Glossário com tooltips (35 termos hover)
- Roadmap visual estilo roadmap.sh (timeline vertical com nós)
- 3 níveis de estudo completos (Base Glicerinada, Óleo Usado, Cold Process)
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

## Pendências (o que ainda falta)

### 🔥 Fase 1 — App de Estudo
- Completar níveis 4 a 8 com conteúdo (estão como "Em Breve")
- Calculadora explicativa (mostrar fórmula no resultado)
- Tooltips educativos nos campos da calculadora
- Dark theme dos inputs/selects (alguns ainda claros)

### ⚡ Fase 2 — Ferramenta de Bancada
- Receitas ligadas aos módulos de estudo
- Biblioteca de óleos com função prática + substituições + risco DOS
- Diário de lote (registro de produção)

### 💤 Fase 3 — Avançado
- KOH, timer, custo, IFRA, PDF, modo mãos sujas

## 🚫 Não fazer agora
Login, backend, banco de dados, claims terapêuticos, comando de voz.

## Regras de ouro
- Conteúdo técnico (Ana é química, nada de TikTok)
- Sempre separar: cosmético corporal (nível 3) vs saneante doméstico (nível 2)
- Toda prática com NaOH/KOH deve ter alerta de segurança
- INS, dureza, espuma etc são **estimativas heurísticas**, não medição laboratorial
- Build precisa passar (`npm run build`)
- Mobile-first, PWA deve continuar funcionando
