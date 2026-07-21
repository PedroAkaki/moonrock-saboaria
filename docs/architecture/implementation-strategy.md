# Estratégia de Implementação MoonRock

## Objetivo

Materializar a arquitetura-alvo em entregas pequenas e utilizáveis, sem construir antecipadamente recursos previstos apenas para o futuro.

Cada marco deve:

- proteger dados existentes;
- entregar valor verificável;
- possuir critérios de entrada e saída;
- evitar dependências da etapa seguinte;
- manter backup e uso mobile funcionando.

## Status de execução — 2026-07-21

- **Marco 0:** concluído. Os contratos de Batch v1, backup e ponte Calculadora → Diário possuem validação e testes de proteção.
- **Batch v2 — Etapa 1 e Etapa 2 (Cold Process):** concluídas. `BatchV2`, regras por método, decoder explícito e normalização v1 → v2 existem; novos CP são persistidos como v2 e editar um CP v1 faz a migração daquele registro de forma explícita. A chave de armazenamento e o envelope de backup permanecem compatíveis com v1 e aceitam listas mistas validadas.
- **Aprendizado Cold Process:** o módulo avançado está disponível, possui receita de prática e pré-requisito apenas informativo. O conteúdo não altera dados operacionais nem desbloqueia o currículo automaticamente.
- **Acompanhamento Cold Process:** o Diário v2 registra uma conferência opcional de 24–48 h (desmolde e sinais visuais iniciais) dentro de `processData`. A avaliação posterior continua em `result`; não foi criada uma linha do tempo ou entidade de observações.
- **Progresso de Aprendizado:** todos os consumidores usam o store externo compartilhado com snapshot estável para SSR/hidratação e atualizações entre componentes ou abas. Não há mais leitores de progresso que inicializem estado diretamente de `localStorage`.

O foco aprovado para o próximo mês é aprofundar Cold Process. Não iniciar outro método, fórmula discriminada, catálogo de matérias-primas ou motor genérico de formulários nesse intervalo.

O estado operacional e os comandos de verificação também são mantidos em [HANDOFF.md](../../HANDOFF.md).

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

### Próxima trilha Cold Process

1. O módulo `cold-process-praticas-progressivas` cobre controle da fórmula, temperatura/trace, uma variável por vez e design simples. Ele é um roteiro educacional e não cria lotes automaticamente.
2. A prática progressiva já possui ligação leve com o Diário: a URL abre o formulário com contexto editável, sem persistência ou criação automática. Avaliar outros contextos somente quando houver prática concreta para eles.
3. Conferência de 24–48 h e avaliação após a cura como dois momentos de aprendizagem distintos; a avaliação reutiliza `result` para nota, repetição, motivo opcional e observações, sem criar histórico.
4. Revisão de segurança baseada em fontes antes de ampliar instruções de diagnóstico ou recuperação de lote.

## Simulador de mistura de óleos (v1 concluída)

Objetivo: apoiar a formulação de Cold Process na Calculadora sem substituir o teste prático. A pessoa pode montar percentuais livremente e ver as propriedades estimadas, ou informar um objetivo e receber uma sugestão explicável.

Escopo inicial:

- motor puro e determinístico que recebe óleos permitidos e uma meta de propriedades;
- cálculo ponderado das propriedades já presentes na biblioteca (`hardness`, `cleansing`, `conditioning`, `bubbly`, `creamy`, `iodine` e `ins`), com respeito a `maxPercent`, estabilidade e risco de DOS;
- modo explorar e modo sugerir, com busca em incrementos de 5%; uma combinação inviável é comunicada claramente;
- testes de propriedades, limites e casos inviáveis antes da UI;
- a sugestão preenche a Calculadora para conferência e recálculo, mas não cria Receita, Lote ou dados persistidos automaticamente.

Fora do escopo inicial:

- algoritmo genérico de otimização, IA, catálogo novo de ingredientes, inventário, custo, recomendação de segurança cosmética ou alteração automática da receita;
- afirmações de que a heurística garante qualidade, estabilidade ou segurança.

Próximo aprimoramento:

1. a linha de base de proveniência, escala e completude de `data/oils.json` foi registrada em [oil-library-audit.md](./oil-library-audit.md); ela impede, por enquanto, alterar a pontuação ou derivar eixos de ácidos graxos;
2. a primeira curadoria já registra fonte e revisão de SAP NaOH/KOH para azeite, coco, palma, mamona e karité; o próximo recorte deve escolher um único conjunto adicional de campos ou óleos, antes de avaliar se a pontuação deve reduzir métricas correlacionadas ou se a biblioteca precisa de perfis numéricos de ácidos graxos;
3. manter a busca estável: pontuar antes da apresentação arredondada, canonizar a ordem dos óleos e expor quando houver apenas uma melhor aproximação;
4. continuar separando fato de heurística e não usar o resultado como recomendação de segurança.

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
