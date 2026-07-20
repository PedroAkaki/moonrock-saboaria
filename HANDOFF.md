# MoonRock — Handoff de Engenharia

Atualizado em 2026-07-19.

## Estado atual

- O app permanece **local-first**: `localStorage` e backup JSON, sem backend, banco ou autenticação.
- Marco 0 está concluído e protege o contrato persistido de Batch v1.
- Batch v2 — Etapa 2 está concluída para Cold Process: novos lotes CP são v2; editar um CP v1 promove somente esse registro, no clique de salvar. A leitura não persiste migrações.
- A chave `moonrock:diario:batches:v1` continua sendo a chave de armazenamento por compatibilidade, mas agora aceita uma lista validada de Batch v1 e Batch v2. Backups v1 continuam importáveis e novos backups podem conter ambos os formatos.
- O conteúdo `cold-process-avancado` está disponível, possui receita de prática e registra os conceitos que serão persistíveis quando a UI do Diário v2 for autorizada.
- O pré-requisito de cinco lotes CP aparece como indicador no Aprendizado. Ele não bloqueia módulos e não altera o progresso educacional.

## Contratos que não podem regredir

- Chave atual de Diário: `moonrock:diario:batches:v1`; Batch persistido continua com `version: 1`.
- `id`, `batchCode`, `createdAt`, `method` e `version` são imutáveis em lotes v1.
- Leitura e normalização não regravam `localStorage`.
- Backup deve validar integralmente antes de persistir.
- A ponte Calculadora → Diário continua usando `moonrock:calculator:lastFormula:v1`.

## Limites da próxima etapa

Antes de expandir Batch v2 para Hot Process, Melt & Pour ou Óleo Usado, obter autorização explícita para cada formulário e seus campos. A expansão deve reutilizar o repositório de lotes existente e manter os dados ocultos preservados.

Não antecipar fórmula discriminada, alterações na Calculadora, catálogo de matérias-primas ou um motor genérico de formulários.

## Próximas melhorias de Aprendizado CP

1. Revisar instruções de segurança e recuperação de lote com fontes rastreáveis.
2. Estruturar práticas progressivas: controle, cor, fragrância e design.
3. Ligar cada prática aos campos CP agora disponíveis no Diário, sem criar registros automáticos a partir do módulo.

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
