# MoonRock Saboaria — Project Plan

> **Status:** MVP ativo · Protótipo funcional · Em desenvolvimento ativo
> **Repositório:** `github.com/PedroAkaki/moonrock-saboaria`
> **Deploy:** https://moonrock-saboaria.vercel.app
> **Domínio futuro:** moonrock.pousadamayon.com
> **Stack:** Next.js 16 (App Router) + Tailwind + TypeScript + Prisma + SQLite
> **Público:** Ana (iniciante em saboaria artesanal) — app educativo para aprender do zero
> **Última atualização:** 2026-06-29

---

## 1. Visão Geral

MoonRock Saboaria é um aplicativo web progressivo (PWA) para aprendizado e produção de saboaria artesanal, focado em **segurança, dados precisos e experiência na cozinha**. A dona (Ana) está começando com misturas prontas do Peter Paiva e quer evoluir para cold process.

### Propósito
- **Educar:** Roadmap do zero ao avançado
- **Calcular:** Soda cáustica precisa a partir de qualquer receita
- **Guiar:** Checklist de segurança obrigatório antes de produzir
- **Acompanhar:** Cura, lotes, histórico

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Observações |
|--------|-----------|-------------|
| Framework | Next.js 16 (App Router) | Turbopack, Server Components |
| Estilo | Tailwind CSS | Utilitário, responsivo |
| Tipagem | TypeScript | Strict mode |
| Dados estáticos | JSON + Prisma + SQLite | 37 óleos, 35 termos glossário |
| Deploy | Vercel (plano free) | GitHub Actions integrado |
| PWA | Manifest + Service Worker | Offline-first, instalável |
| Banco | SQLite (better-sqlite3) | Local, migra pra Turso se crescer |
| Domínio | moonrock.pousadamayon.com | Cloudflare DNS (pendente CNAME) |

---

## 3. Arquitetura do App

```
moonrock-saboaria/
├── app/
│   ├── page.tsx              → Landing page (dashboard)
│   ├── layout.tsx            → Root layout + PWA meta + SW reg
│   ├── globals.css           → Tailwind directives
│   ├── calculadora/          → Calculadora de saponificação
│   ├── oleos/                → Biblioteca de óleos (37 itens)
│   ├── receitas/             → Catálogo de receitas
│   └── roadmap/              → Roadmap de aprendizado (5 níveis)
├── components/
│   ├── GlossaryTerm.tsx      → Tooltip de glossário (hover)
│   └── SafetyChecklist.tsx   → Modal de segurança obrigatório
├── lib/soap/
│   ├── calculator.ts         → Core matemático (NaOH, INS, forma, DOS)
│   └── oils.ts               → Helpers + tipos do banco de óleos
├── data/
│   ├── oils.json             → 37 óleos com SAP, INS, FA, disponibilidade
│   ├── recipes.json          → 3 receitas guiadas
│   ├── roadmap.json          → 5 níveis de aprendizado
│   └── glossary.json         → 35 termos do glossário
├── public/
│   ├── manifest.json         → PWA manifest
│   └── sw.js                 → Service worker (cache-first)
└── Deep Research/            → Pesquisa externa (não versionado no app)
```

---

## 4. Features Implementadas (MVP)

| Feature | Status | Descrição |
|---------|--------|-----------|
| Calculadora de NaOH | ✅ | Input de óleos + %, superfat, ratio água:soda → NaOH + água |
| Cálculo de INS | ✅ | Média ponderada + alerta colorido (verde/âmbar/vermelho) |
| Alerta de DOS | ✅ | Detecta >15% óleos insaturados + superfat >8% |
| Calculadora de forma | ✅ | Input dimensões (cm) → volume → peso óleos → rendimento em barras |
| Biblioteca de 37 óleos | ✅ | SAP, INS, INCI, ácidos graxos, disponibilidade BR |
| Modal de segurança EPI | ✅ | Checklist obrigatório antes de ver resultados |
| Glossário com tooltips | ✅ | 35 termos com hover, ativos na calculadora e óleos |
| Roadmap de aprendizado | ✅ | 5 níveis (Segurança → Mix → Óleo Usado → CP → Autoral) |
| Catálogo de receitas | ✅ | 3 receitas guiadas |
| PWA (offline) | ✅ | Manifest + service worker, instalável |
| Deploy Vercel | ✅ | moonrock-saboaria.vercel.app |

---

## 5. Pesquisa Realizada (Deep Research)

**Total:** 11 arquivos, ~208KB de pesquisa de 4 provedores (DeepSeek, Gemini, Z.ai GLM-5.2, GPT).

### Arquivos no vault: `brain/raw/` + Desktop/MoonRock/Deep Research/

| Arquivo | Fonte | Tamanho | Destaque |
|---------|-------|---------|----------|
| deepseek-v2-response.md | DeepSeek | 41KB | Tabela SAP 45+ óleos, 19 receitas, glossário 50+ termos |
| deepseek-deep-research-response.md | DeepSeek | 32KB | Primeira rodada, fornecedores BR, roadmap |
| gpt-deep-research-response.md | GPT | 21KB | Classificação de confiança por óleo, pseudocódigo, análise ANVISA |
| gemini-v2-dossie-tecnico.md | Gemini | 19KB | Fórmula heurística de propriedades (FA→scores), syndet completo |
| zai-glm5-gpt-prompt-v2.md | Z.ai | 18KB | Esquema JSON, auto-auditoria, pseudocódigo |

### Principais descobertas consolidadas

**Óleos bloqueados da calculadora (SAP não confirmado):**
- Copaíba (resina, não é triglicerídeo)
- Pracaxi (SAP não encontrado com confiança)
- Patauá (SAP não encontrado com confiança)

**Divergências entre fontes:**
| Parâmetro | DeepSeek | Gemini | GPT | Z.ai |
|-----------|----------|--------|-----|------|
| Fator forma (cm³→g) | 0.40 | 0.68 | 0.70 | 0.40 |
| Buriti SAP NaOH | 0.140 | 0.152 | 0.152 | 0.159 |
| Murumuru SAP | 0.135 | 0.180 | 0.196 | 0.172 |

---

## 6. Roadmap de Desenvolvimento

### 📦 Fase 1 — MVP ✅ (Concluído)
- [x] Projeto Next.js inicializado
- [x] Calculadora de saponificação funcional
- [x] Seed de 37 óleos com dados completos
- [x] Deploy na Vercel
- [x] PWA offline
- [x] Glossário com tooltips
- [x] Modal de segurança EPI
- [x] Cálculo de INS + alerta
- [x] Alerta de DOS
- [x] Calculadora de forma por dimensões
- [x] Repositório GitHub

### 🚀 Fase 2 — Polimento (Próximo)
- [ ] Aplicar classificação de confiança do GPT nos óleos (liberado / alerta / bloqueado)
- [ ] Adicionar fator 0.70 como opção de cálculo de forma
- [ ] Modo KOH na calculadora (já temos fórmula)
- [ ] Gerar seed de 12-20 receitas dos templates do GPT
- [ ] Modo "Mãos Sujas" (comando de voz, botões gigantes)
- [ ] Dark mode (cozinha com pouca luz)
- [ ] Cadastro de lote (diário do saboeiro)

### 🌟 Fase 3 — Produto
- [ ] Modo execução passo a passo
- [ ] Timer de traço e cura
- [ ] Calculadora de custo por barra
- [ ] Exportação de ficha técnica / batch sheet PDF
- [ ] IFRA checker (validação de dosagem de fragrâncias)
- [ ] Sincronização em nuvem (Turso)
- [ ] Compartilhamento de receitas
- [ ] Domínio moonrock.pousadamayon.com (CNAME Cloudflare pendente)

---

## 7. Convenções de Código

- **Idioma:** Português brasileiro para UI e data; inglês para código (variáveis, funções)
- **Componentes:** Client Components marcados com `"use client"` apenas quando necessário (interatividade)
- **Dados estáticos:** JSON em `data/`, importados via Server Components
- **CSS:** Tailwind utility-first. Sem CSS modules ou styled-components
- **Tooltips:** `<GlossaryTerm term="superfat">` — lookup automático em `glossary.json`
- **Segurança:** Superfat mínimo 0%, concentração lixívia máxima 50%, coco máximo 35% sem alerta

---

## 8. Pesquisa em Andamento

Deep Research rodando em Gemini + GPT com o prompt refinado (`gpt-refined-prompt.md`). Foco em validação cruzada de SAP values, fornecedores brasileiros adicionais e confirmação da Lei 15.154/2025.

---

## 9. Links Úteis

- **App:** https://moonrock-saboaria.vercel.app
- **Repositório:** https://github.com/PedroAkaki/moonrock-saboaria
- **Vault pesquisa:** `~/Desktop/MoonRock/Deep Research/` (11 arquivos)
- **Vault conhecimento:** `~/Desktop/CODE/brain/`

---

*Este plano foi gerado por Hermes Agent (DeepSeek API) em 29/06/2026.*
