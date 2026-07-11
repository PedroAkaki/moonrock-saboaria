# Decisões de Arquitetura

## ADR-001 — batchCode é imutável

**Status:** Aceita.

**Contexto:** O código identifica o lote para a pessoa usuária e pode aparecer em anotações externas.

**Decisão:** `batchCode` é definido na criação e não pode ser alterado por atualizações.

**Consequência:** Correções não reutilizam nem renumeram códigos existentes.

## ADR-002 — Método é imutável após criação

**Status:** Aceita.

**Contexto:** O método define o significado da fórmula, do processo e do prefixo do código.

**Decisão:** O método não pode ser alterado em lote persistido; correções usam “Duplicar como outro método”.

**Consequência:** A identidade histórica permanece coerente, ao custo de criar um novo lote para corrigir o método.

## ADR-003 — Lotes preservam snapshots históricos

**Status:** Aceita.

**Contexto:** Receitas, cálculos e matérias-primas podem mudar depois da produção.

**Decisão:** O lote preserva os dados efetivamente usados, mesmo quando mantém referência à origem.

**Consequência:** Alterações futuras no catálogo ou na receita não modificam lotes anteriores.

## ADR-004 — Atualizações não usam Partial<Entity>

**Status:** Aceita.

**Contexto:** Um patch irrestrito permite alterar invariantes e substituir objetos aninhados acidentalmente.

**Decisão:** APIs públicas de mutação usam inputs explícitos e omitem campos imutáveis.

**Consequência:** Novos campos mutáveis precisam ser adicionados deliberadamente aos contratos.

## ADR-005 — Leitura não persiste migrações

**Status:** Aceita.

**Contexto:** Abrir o aplicativo não deve modificar dados nem tornar um backup antigo irreversível.

**Decisão:** Validação e normalização ocorrem em memória; persistência só acontece após ação explícita.

**Consequência:** O armazenamento pode conter versões antigas até que cada registro seja alterado ou migrado conscientemente.

## ADR-006 — Backup é validado integralmente

**Status:** Aceita.

**Contexto:** A importação substitui dados locais e um único registro inválido pode comprometer o conjunto.

**Decisão:** Envelope, progresso e todos os lotes são validados antes de confirmação e gravação.

**Consequência:** A importação é rejeitada integralmente e informa o registro inválido sem sobrescrever dados atuais.

## ADR-007 — Não usar deep merge genérico

**Status:** Aceita.

**Contexto:** Objetos, arrays, valores ausentes e remoções possuem semânticas diferentes em cada parte do domínio.

**Decisão:** Merges são explícitos por campo ou seção.

**Consequência:** Há mais código específico, mas as alterações ficam previsíveis e testáveis.

## ADR-008 — Arquitetura local-first

**Status:** Aceita.

**Contexto:** O MoonRock é usado localmente e não necessita de infraestrutura remota nesta fase.

**Decisão:** Dados permanecem no navegador com backup JSON; nenhum backend será introduzido no Marco 0.

**Consequência:** Autenticação, sincronização e colaboração permanecem adiadas, enquanto contratos versionados preservam uma evolução futura.
