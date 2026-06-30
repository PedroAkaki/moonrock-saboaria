# MoonRock Saboaria — Lista de Pendências (para delegar a IAs)

> **Legenda:** 🔥 Prioridade máxima | ⚡ Média | 💤 Baixa
> **Status:** ⬜ Não iniciado | 🔄 Em progresso | ✅ Concluído

---

## 🔥 PRIORIDADE MÁXIMA — Roadmap Interativo

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 1 | Criar `data/learning-modules.json` | ⬜ | Estruturar JSON com 8 níveis a partir de `data/curriculo.md` |
| 2 | Rota `/roadmap/[slug]` | ⬜ | Página dinâmica para cada nível de estudo |
| 3 | Atualizar `/roadmap` com cards | ⬜ | Listar 8 níveis como cards clicáveis, com status (bloqueado/disponível/concluído) |
| 4 | Implementar níveis 1, 2, 3 completos | ⬜ | Base Glicerinada, Óleo Usado, CP Básico — com todas as seções |
| 5 | Níveis 4 a 8 como "em breve" | ⬜ | Estrutura pronta, conteúdo resumido |
| 6 | Componente `LevelProgress` | ⬜ | Checklist salvo em localStorage |
| 7 | Separar sabonete cosmético de sabão de limpeza | ⬜ | Alertas visuais diferentes no nível de óleo usado |

**Prompt para IA:**
```
Leia HANDFOFF.md e data/curriculo.md. Implemente o Roadmap Interativo: criar
data/learning-modules.json, rota /roadmap/[slug], atualizar /roadmap com cards.
Conteúdo completo apenas para níveis 1, 2, 3. Níveis 4-8 como "em breve".
Manter dark theme, hexágonos. Não mexer na calculadora nem oils.json.
```

---

## 🔥 PRIORIDADE MÁXIMA — Calculadora Explicativa

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 8 | Mostrar fórmula do cálculo no resultado | ⬜ | Ex: "NaOH = 500g × 0.135 × (1 - 0.05) = 64.1g" |
| 9 | Tooltip explicativo em cada campo | ⬜ | "Superfat: % de óleo não saponificado. Aumenta hidratação mas reduz dureza" |
| 10 | Mostrar contribuição de cada óleo | ⬜ | Gráfico/barra de quanto cada óleo contribui pra dureza, espuma, etc. |
| 11 | Modo "KOH" na calculadora | ⬜ | Alternar entre NaOH e KOH (já temos a fórmula em calculator.ts) |

---

## 🔥 MÉDIA — Biblioteca de Óleos

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 12 | Adicionar campo "função na fórmula" | ⬜ | Texto explicativo por óleo (ex: "estabiliza espuma") |
| 13 | Adicionar "substituições possíveis" | ⬜ | "Pode substituir palma por sebo ou banha" |
| 14 | Adicionar "risco de DOS" por óleo | ⬜ | Alerta visual se o óleo for instável |
| 15 | Busca/filtro na biblioteca | ⬜ | Por nome, tipo, disponibilidade, propriedades |
| 16 | Aplicar classificação GPT | ⬜ | Status: liberado / alerta / bloqueado (copaíba, pracaxi, patauá) |

---

## ⚡ MÉDIA — Experiência na Cozinha

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 17 | Modo "Mãos Sujas" | ⬜ | Botões gigantes, comando de voz, tela sempre acesa |
| 18 | Timer de traço e cura | ⬜ | Cronômetro na tela + notificação quando a cura terminar |
| 19 | Diário de lote | ⬜ | Cadastro: data, receita, peso, temperatura, fotos, pH, observações |
| 20 | Modo escuro completo | 🔄 | Calculadora ainda tem inputs com background claro |

---

## ⚡ MÉDIA — Dados e Conteúdo

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 21 | Seed de 12-20 receitas | ⬜ | A partir dos templates do GPT em `deep-research-response.md` |
| 22 | Glossário completo (50+ termos) | ⬜ | Expandir de 35 para 50+ (Z.ai P3 tem 64 termos) |
| 23 | Receitas ligadas aos módulos | ⬜ | Cada nível do roadmap linkar pras receitas correspondentes |
| 24 | Conteúdo do apêndice químico na UI | ⬜ | Renderizar fórmulas químicas do `curriculo.md` nas páginas |

---

## 💤 BAIXA — Features Avançadas

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 25 | Calculadora de custo por barra | ⬜ | Input preço/kg dos insumos → custo por barra |
| 26 | IFRA checker | ⬜ | Validar dosagem de fragrância por categoria |
| 27 | Exportar ficha técnica PDF | ⬜ | Batch sheet para conformidade BPF |
| 28 | Sincronização em nuvem (Turso) | ⬜ | Salvar receitas na nuvem pra acessar de outro dispositivo |
| 29 | Domínio moonrock.pousadamayon.com | ⬜ | Só falta CNAME no Cloudflare |
| 30 | Modo "iniciante" vs "avançado" | ⬜ | Esconder dual lye, KOH, syndet do modo iniciante |

---

## ✅ JÁ FEITO (não refazer)

- Calculadora NaOH com superfat, ratio água:soda
- Cálculo INS com alerta colorido
- Alerta DOS
- Calculadora de forma (cm³ → g → barras)
- 37 óleos com SAP, INCI, INS, FA
- Modal segurança EPI (obrigatório)
- Glossário com tooltips (35 termos)
- Roadmap atual (5 níveis — será substituído)
- 3 receitas guiadas
- PWA (manifest + service worker)
- Dark theme lunar
- Ícone PWA
- Imagens: card-crystal, splash-crescent, texture-craters, texture-veil
- Project plan no GitHub + vault
- Graphify (grafo AST do código)
- Handoff para IAs (HANDFOFF.md)
- Currículo completo (curriculo.md, 8 níveis + apêndice químico)

---

## Ordem recomendada de execução

1. 🔥 **Roadmap Interativo** (itens 1-7) — o maior gap pedagógico
2. 🔥 **Calculadora Explicativa** (itens 8-11) — ensinar enquanto calcula
3. 🔥 **Óleos com Profundidade** (itens 12-16) — biblioteca vira consulta técnica
4. ⚡ **Modo Cozinha** (itens 17-20) — UX para produção real
5. ⚡ **Conteúdo** (itens 21-24) — mais receitas, glossário, conexões
6. 💤 **Avançado** (itens 25-30) — custo, IFRA, PDF, sync
