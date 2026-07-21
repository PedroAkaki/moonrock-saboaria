# MoonRock — Handoff de Engenharia

Atualizado em 2026-07-21.

## Estado atual

- O app permanece **local-first**: `localStorage` e backup JSON, sem backend, banco ou autenticação.
- Marco 0 está concluído e protege o contrato persistido de Batch v1.
- Batch v2 — Etapa 2 está concluída para Cold Process: novos lotes CP são v2; editar um CP v1 promove somente esse registro, no clique de salvar. A leitura não persiste migrações.
- A chave `moonrock:diario:batches:v1` continua sendo a chave de armazenamento por compatibilidade, mas agora aceita uma lista validada de Batch v1 e Batch v2. Backups v1 continuam importáveis e novos backups podem conter ambos os formatos.
- O conteúdo `cold-process-avancado` está disponível, possui receita de prática e registra os conceitos que serão persistíveis quando a UI do Diário v2 for autorizada.
- O pré-requisito de cinco lotes CP aparece como indicador no Aprendizado. Ele não bloqueia módulos e não altera o progresso educacional.
- O Diário CP v2 possui uma conferência opcional de 24–48 h: data, situação de desmolde, toque da superfície e sinais visuais iniciais. É um único registro de processo, não uma linha do tempo genérica. Depois da cura, um lote pronto pode registrar nota de 1–5, se Ana o faria novamente, motivo opcional e observações em `result`.
- A Calculadora possui o Simulador de Mistura de Óleos v1: perfis ponderados, objetivos educativo de equilíbrio/firmeza/cremosidade, sugestão determinística em incrementos de 5% e revisão consciente na Calculadora. Ele não cria Receita ou Lote.
- A integridade do simulador foi reforçada: a pontuação usa valores antes da apresentação arredondada, a busca canoniza a ordem dos óleos e os empates são estáveis. Quando a meta não é atingida, a UI declara que se trata da melhor aproximação e mostra os critérios fora da faixa.
- A auditoria de `data/oils.json` foi registrada em [docs/architecture/oil-library-audit.md](docs/architecture/oil-library-audit.md): a escala de propriedades é editorial, não há fonte por campo e os perfis de ácidos graxos são parciais e textuais. Não mudar o score nem derivar novos eixos até uma curadoria de dados rastreável.
- A primeira curadoria de dados é deliberadamente pequena: azeite, coco, palma, mamona e karité trazem uma referência parcial para `sapNaOH` e `sapKOH`. O cálculo não mudou e nenhum outro campo desses itens foi implicitamente validado.
- A página Biblioteca de Óleos identifica esses cinco itens com “SAP conferido”, fonte e data. A comparação de iodo/INS encontrou pequenas divergências registradas na auditoria, ainda não aplicadas para evitar mudança parcial do score.

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

1. O módulo `cold-process-praticas-progressivas` está disponível: quatro práticas (controle, temperatura/trace, uma variável e design simples), sem criar registros automaticamente.
2. A prática progressiva abre o Diário com intenção e campos de estudo editáveis por URL; não escreve dados nem cria lote até o botão salvar. Ainda falta avaliar se outras práticas merecem contextos próprios.
3. A avaliação pós-cura de CP reutiliza `result`; não cria linha do tempo, novas métricas sensoriais, regra de segurança ou recomendação automática.
4. Revisar instruções de segurança e recuperação de lote com fontes rastreáveis antes de ampliar o conteúdo prático.

## Simulador de mistura de óleos — v1 concluída

Objetivo: uma ferramenta da Calculadora para Cold Process que permita tanto ajustar percentuais livremente e ver propriedades estimadas em tempo real quanto pedir uma sugestão para um objetivo explícito.

- Usará somente os atributos já existentes em `data/oils.json` (`hardness`, `cleansing`, `conditioning`, `bubbly`, `creamy`, `iodine`, `ins`, `maxPercent`, estabilidade e risco de DOS).
- Possui os dois modos pequenos: **explorar** (a usuária altera a mistura) e **sugerir** (objetivo + óleos já escolhidos). A sugestão expõe percentuais, propriedades estimadas e limites; se não houver combinação viável, informa isso em vez de inventar uma fórmula.
- A regra será determinística e testada fora da UI. Valores são heurísticas educacionais, não garantia de qualidade, segurança cosmética ou resultado de bancada.
- `maxPercent` permanece como limite da sugestão, não como limite químico ou selo de segurança. A Calculadora continua exibindo aviso ao revisar uma fórmula fora desse intervalo.
- A saída poderá preencher a Calculadora para revisão consciente; não criará automaticamente Receita ou Lote, não alterará o cálculo de NaOH e não introduzirá catálogo, banco ou otimizador genérico.
- O próximo aprimoramento, quando autorizado, é curar dados rastreáveis por campo para um pequeno conjunto de óleos-base CP; a linha de base está em [docs/architecture/oil-library-audit.md](docs/architecture/oil-library-audit.md). Não transformar essa calibração em alegação de desempenho ou segurança.

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
