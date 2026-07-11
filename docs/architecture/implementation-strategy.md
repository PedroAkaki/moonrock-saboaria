# Estratégia de Implementação MoonRock

## Objetivo

Materializar a arquitetura-alvo em entregas pequenas e utilizáveis, sem construir antecipadamente recursos previstos apenas para o futuro.

Cada marco deve:

- proteger dados existentes;
- entregar valor verificável;
- possuir critérios de entrada e saída;
- evitar dependências da etapa seguinte;
- manter backup e uso mobile funcionando.

## Sequência aprovada

```text
Marco 0 — Contratos e proteção
Batch v2
Formula compartilhada
Recipe
Raw Materials
Learning integrado
Recommendations
```

## Marco 0 — Contratos e proteção

Objetivo: proteger o comportamento atual antes de alterar o modelo central.

Entregas:

- documentação dos contratos persistidos atuais;
- fixtures representativas do formato v1;
- validação explícita nas fronteiras de localStorage e backup;
- rejeição atômica de backups inválidos;
- contrato de mutação que não aceite invariantes imutáveis;
- testes de domínio e persistência;
- smoke tests documentados para os fluxos de interface.

Critério de saída:

- lotes v1 válidos continuam carregando;
- registros inválidos são rejeitados sem regravação;
- importação valida todos os lotes antes de escrever;
- edição preserva identidade e campos não modificados;
- duplicação cria novo ID e código;
- lint, typecheck, testes e build passam;
- nenhum elemento de Batch v2 foi introduzido.

## Batch v2

Introduzir processos discriminados, comportamento específico por método, prontidão adequada e componentes de formulário menores. O método passa a ser apresentado como imutável durante edição; correções usam duplicação para outro método.

Não iniciar até o Marco 0 estar concluído.

## Formula compartilhada

Extrair uma representação comum baseada nos casos reais de Batch v2. Integrar gradualmente a Calculadora e preservar snapshots nos lotes. Não criar catálogo universal de ingredientes.

## Recipe

Criar receita simples com fórmula e instruções. Um lote originado de receita mantém referência de origem e snapshot próprio. `RecipeRevision` somente será avaliado quando houver demanda real por histórico editorial.

## Raw Materials

Centralizar propriedades que já estejam duplicadas entre Receita e Calculadora. Começar com categorias tipadas. Entrada manual continua permitida. Inventário, preço e fornecedor permanecem fora do escopo.

## Learning integrado

Adicionar ligações leves entre conteúdo e IDs ou tópicos estáveis. O progresso educacional continua separado dos dados operacionais.

## Recommendations

Introduzir regras determinísticas e explicáveis somente quando os lotes tiverem dados consistentes. Cada recomendação apresenta regra e evidência, não altera dados e distingue fato, heurística e hipótese.

## Controle de escopo

Antes de incluir trabalho em um marco, responder:

1. É necessário para o critério de saída atual?
2. Existe caso de uso concreto?
3. Adiar criaria incompatibilidade irreversível?

Se as três respostas forem negativas, o item deve ser adiado.

## Contratos persistidos atuais — Marco 0

### Lotes

- Chave: `moonrock:diario:batches:v1`.
- Valor: JSON contendo um array de `Batch` versão 1.
- A versão do lote é o campo literal `version: 1` em cada registro.
- A leitura não deve alterar ou regravar o conteúdo armazenado.

Estrutura obrigatória atual:

- identidade: `id`, `batchCode`, `name`, `method`;
- datas: `createdAt`, `updatedAt`, `batchDate`;
- origem: `source`;
- fórmula: `formula` com peso de óleos, álcali, água, superfat e óleos;
- cura: `cure`;
- estado: `status`;
- versão: `version: 1`.

Campos opcionais atuais: `process`, `yield`, `result`, `tags`, `photoIds` e propriedades adicionais tipadas dentro da fórmula, origem e cura.

### Backup

- Formato: `{ version, exportedAt, app, progress, batches }`.
- `app` deve ser `moonrock-saboaria`.
- `version` é a versão do envelope de backup, atualmente `1`.
- `batches` contém registros Batch v1.
- `progress` contém o valor de `moonrock:progress:v1` ou um objeto vazio quando não há progresso.
- Backups legados sem progresso continuam aceitos.

`backupVersion` e a versão do lote são independentes. Um backup versão 1 pode conter lotes cujo schema seja validado separadamente.

### Calculadora → Diário

- Chave temporária: `moonrock:calculator:lastFormula:v1`.
- A Calculadora grava uma fórmula JSON e navega para `/diario`.
- Payload atual: `totalOilWeight`, `alkaliType: "naoh"`, `naohGrams`, `waterGrams`, `superfatPercent` e `oils`.
- Cada óleo contém `oilId`, `name`, `grams`, `percentage` e, quando disponível, `sapNaoh`.
- O Diário lê o payload para preencher o formulário.
- A chave somente é removida depois que um lote com origem `calculator` é criado.
- Cancelar ou apenas abrir o Diário não deve consumir a fórmula.

### Imutabilidade e mutações atuais

- Imutáveis: `id`, `batchCode`, `createdAt`, método e versão do lote.
- `updatedAt` é controlado internamente pela mutação.
- Edição atual substitui somente os campos enviados e preserva os demais campos de topo.
- A página recompõe explicitamente `formula` e `result` para preservar propriedades aninhadas não exibidas.
- Duplicação cria novo ID, novo código, nova data, status `draft` e origem `duplicate_batch`.
- Exclusão remove definitivamente o lote após confirmação da interface.
- Arquivamento é uma atualização de status e preserva os dados.

## Smoke tests que permanecem manuais no Marco 0

- abrir `/diario` em viewport mobile;
- criar, editar, cancelar e duplicar um lote;
- arquivar e filtrar;
- enviar fórmula da Calculadora ao Diário;
- exportar e reimportar backup pela seleção de arquivo;
- confirmar mensagens de erro e sucesso da importação.
