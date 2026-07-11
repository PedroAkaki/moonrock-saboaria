# Modelo de Domínio MoonRock

## Status

Arquitetura-alvo aprovada para orientar a evolução do produto nos próximos três a cinco anos. Este documento define direção e fronteiras; não autoriza implementar antecipadamente todos os elementos descritos.

## Princípios

1. O lote é um registro histórico e preserva snapshots dos dados usados na produção.
2. Receita representa intenção reutilizável; lote representa uma execução concreta.
3. A Calculadora é um serviço de domínio, não uma fonte autônoma de verdade.
4. Matérias-primas podem evoluir sem alterar lotes anteriores.
5. Aprendizado permanece independente dos dados operacionais.
6. Dados persistidos entram no domínio como `unknown` e somente são aceitos após validação.
7. Leitura e normalização não persistem migrações automaticamente.
8. Contratos de mutação são explícitos e não usam `Partial<Entity>` como API pública.
9. Objetos aninhados são atualizados por regras específicas; não existe deep merge genérico.
10. A arquitetura permanece local-first nesta fase.

## Domínios

```text
Matérias-primas → Receitas → Calculadora → Diário de Lote
       └──────────── referências educativas ───────────→ Aprendizado
```

### Diário de Lote

`Batch` é a entidade central de produção. Mantém identidade, código humano, método, origem, fórmula usada, dados de processo, rendimento, cura ou estabilização, avaliação final e status.

Invariantes permanentes:

- `id`, `batchCode`, `createdAt` e método são imutáveis após a criação;
- atualizações ocorrem por ID;
- duplicação cria nova identidade e novo código;
- referências externas nunca substituem o snapshot histórico;
- arquivamento preserva o registro;
- correção de método ocorre por “Duplicar como outro método”.

No modelo futuro, dados específicos de processo serão representados por união discriminada. Essa alteração pertence ao Batch v2 e não faz parte do Marco 0.

### Fórmula

A fórmula será compartilhada por Diário, Receitas e Calculadora. A direção aprovada prevê famílias discriminadas para saponificação, Melt and Pour e fórmulas genéricas. Não será criada uma entidade universal de ingredientes nesta etapa.

### Calculadora

A Calculadora recebe entradas, aplica regras determinísticas e produz um resultado. Um cálculo só se torna histórico quando é usado para criar uma receita ou lote; nesse momento, as entradas relevantes e o resultado passam a compor um snapshot.

### Receitas

Receita é uma entidade reutilizável que pode alimentar a Calculadora ou originar um lote. O lote sempre preserva a fórmula efetivamente usada. `RecipeRevision` permanece adiado até existir necessidade concreta de histórico editorial.

### Matérias-primas

Matérias-primas fornecerão propriedades reutilizáveis para receitas e cálculos. A implementação inicial futura deve usar categorias tipadas — como óleo, álcali, base, essência, aditivo e corante — sem inventário, custo ou rastreabilidade de fornecedor.

### Aprendizado

Conteúdo e progresso educacional são independentes dos registros operacionais. O Aprendizado pode apontar para matérias-primas, receitas e tópicos das ferramentas, mas nenhuma dessas áreas depende do progresso educacional para funcionar.

### Recomendações

Recomendações são uma capacidade futura baseada em heurísticas determinísticas, explicáveis e testáveis. Não usarão IA nesta fase e não modificarão dados automaticamente.

## Snapshots históricos

Um snapshot é necessário quando uma alteração futura em catálogo, receita ou cálculo puder mudar o significado de um lote anterior. O snapshot deve conter apenas os dados necessários para compreender e reproduzir aquela execução.

Não transformar todo objeto do sistema em snapshot. Dados puramente operacionais ou efêmeros permanecem referências ou estado de interface.

## Versionamento

- `schemaVersion` identifica o formato persistido de uma entidade.
- `backupVersion` identifica o formato do envelope de backup.
- `engineVersion` será introduzido quando resultados reproduzíveis da Calculadora forem persistidos.

Essas versões têm responsabilidades independentes. Revisão concorrente, histórico completo e versionamento editorial de receitas permanecem adiados.

## Persistência

A persistência é uma fronteira externa ao domínio. O formato local atual pode evoluir para banco ou sincronização futura sem alterar as invariantes centrais, desde que sejam mantidos IDs estáveis, snapshots e formatos versionados.

Fluxo obrigatório de entrada:

```text
unknown → validação estrutural → identificação da versão → normalização em memória → domínio
```

## Decisões deliberadamente adiadas

- Batch v2 e processos discriminados;
- fórmulas discriminadas;
- `RecipeRevision`;
- revisão concorrente;
- inventário, fornecedores e custos;
- backend, autenticação e sincronização;
- histórico completo de alterações;
- motor de regras configurável;
- IA.

