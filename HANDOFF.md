# MoonRock — Handoff de Engenharia

Atualizado em 2026-07-20.

## Estado atual

- O app permanece **local-first**: `localStorage` e backup JSON, sem backend, banco ou autenticação.
- Marco 0 está concluído e protege o contrato persistido de Batch v1.
- Batch v2 — Etapa 2 está concluída para Cold Process: novos lotes CP são v2; editar um CP v1 promove somente esse registro, no clique de salvar. A leitura não persiste migrações.
- A chave `moonrock:diario:batches:v1` continua sendo a chave de armazenamento por compatibilidade, mas agora aceita uma lista validada de Batch v1 e Batch v2. Backups v1 continuam importáveis e novos backups podem conter ambos os formatos.
- O conteúdo `cold-process-avancado` está disponível, possui receita de prática e registra os conceitos que serão persistíveis quando a UI do Diário v2 for autorizada.
- O pré-requisito de cinco lotes CP aparece como indicador no Aprendizado. Ele não bloqueia módulos e não altera o progresso educacional.
- O Diário CP v2 possui uma conferência opcional de 24–48 h: data, situação de desmolde, toque da superfície e sinais visuais iniciais. É um único registro de processo, não uma linha do tempo genérica. A avaliação depois da cura continua em `result`.

## Contratos que não podem regredir

- Chave atual de Diário: `moonrock:diario:batches:v1`; Batch persistido continua com `version: 1`.
- `id`, `batchCode`, `createdAt`, `method` e `version` são imutáveis em lotes v1.
- Leitura e normalização não regravam `localStorage`.
- Backup deve validar integralmente antes de persistir.
- A ponte Calculadora → Diário continua usando `moonrock:calculator:lastFormula:v1`.

## Foco aprovado: Cold Process

Ana seguirá concentrada em Cold Process pelo próximo mês. Priorizar o ciclo aprender → praticar → registrar → avaliar, sem iniciar Hot Process, Melt & Pour ou Óleo Usado.

Antes de expandir Batch v2 para outro método, ainda é necessária autorização explícita para cada formulário e seus campos. A expansão deve reutilizar o repositório de lotes existente e manter dados ocultos preservados.

## Próximas melhorias de Aprendizado CP

1. Estruturar práticas progressivas: controle da fórmula, temperatura/trace, uma variável (cor ou fragrância) e design simples.
2. Ligar cada prática aos campos CP do Diário, inclusive a conferência de 24–48 h, sem criar registros automaticamente a partir do módulo.
3. Melhorar a avaliação de cura usando o `result` existente antes de criar qualquer histórico de observações.
4. Revisar instruções de segurança e recuperação de lote com fontes rastreáveis antes de ampliar o conteúdo prático.

## Simulador de mistura de óleos — planejado, não iniciado

Objetivo: uma ferramenta da Calculadora para Cold Process que permita tanto ajustar percentuais livremente e ver propriedades estimadas em tempo real quanto pedir uma sugestão para um objetivo explícito.

- Usará somente os atributos já existentes em `data/oils.json` (`hardness`, `cleansing`, `conditioning`, `bubbly`, `creamy`, `iodine`, `ins`, `maxPercent`, estabilidade e risco de DOS).
- Terá dois modos pequenos: **explorar** (a usuária altera a mistura) e **sugerir** (objetivo + óleos permitidos + peso total). A sugestão deve expor percentuais, propriedades estimadas, limites respeitados e concessões; se não houver combinação viável, deve dizer isso em vez de inventar uma fórmula.
- A regra será determinística e testada fora da UI. Valores são heurísticas educacionais, não garantia de qualidade, segurança cosmética ou resultado de bancada.
- A saída poderá preencher a Calculadora para revisão consciente; não criará automaticamente Receita ou Lote, não alterará o cálculo de NaOH e não introduzirá catálogo, banco ou otimizador genérico.
- Pré-requisito: auditar e normalizar as faixas de cada propriedade na biblioteca atual; depois definir os objetivos iniciais e as regras de desempate antes da interface.

## Verificação esperada

```text
npm.cmd test
npm.cmd run typecheck
npx.cmd eslint <arquivos alterados>
npm.cmd run build
git diff --check
```

## Git

- Preferir commits pequenos por responsabilidade e não incluir `.claude/` sem uma decisão explícita de compartilhamento.
- Publicar somente commits verificados e reportar separadamente alterações locais não rastreadas.
