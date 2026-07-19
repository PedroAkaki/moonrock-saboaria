# MoonRock — Handoff de Engenharia

Atualizado em 2026-07-19.

## Estado atual

- O app permanece **local-first**: `localStorage` e backup JSON, sem backend, banco ou autenticação.
- Marco 0 está concluído e protege o contrato persistido de Batch v1.
- Batch v2 — Etapa 1 está implementada apenas no domínio: tipos discriminados, decoder explícito e normalização v1 → v2 em memória. Não há migração persistida nem alteração do formulário do Diário.
- O conteúdo `cold-process-avancado` está disponível, possui receita de prática e registra os conceitos que serão persistíveis quando a UI do Diário v2 for autorizada.
- O pré-requisito de cinco lotes CP aparece como indicador no Aprendizado. Ele não bloqueia módulos e não altera o progresso educacional.

## Contratos que não podem regredir

- Chave atual de Diário: `moonrock:diario:batches:v1`; Batch persistido continua com `version: 1`.
- `id`, `batchCode`, `createdAt`, `method` e `version` são imutáveis em lotes v1.
- Leitura e normalização não regravam `localStorage`.
- Backup deve validar integralmente antes de persistir.
- A ponte Calculadora → Diário continua usando `moonrock:calculator:lastFormula:v1`.

## Limites da próxima etapa

Antes de iniciar Batch v2 — Etapa 2, obter autorização explícita para UI e persistência. A etapa deve começar por Cold Process e incluir somente:

1. leitura normalizada de Batch v1/v2;
2. criação/edição de campos CP relevantes;
3. persistência explícita e compatível com backup;
4. testes de troca, cancelamento, duplicação e recarga.

Não antecipar fórmula discriminada, Calculadora, catálogo de matérias-primas ou um motor genérico de formulários.

## Próximas melhorias de Aprendizado CP

1. Revisar instruções de segurança e recuperação de lote com fontes rastreáveis.
2. Estruturar práticas progressivas: controle, cor, fragrância e design.
3. Quando a Etapa 2 existir, ligar cada prática aos campos de observação do Diário em vez de exigir texto livre adicional.

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
