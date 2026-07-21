# Auditoria inicial da biblioteca de óleos

Data da auditoria: 2026-07-21.

## Decisão

O Simulador de Mistura de Óleos permanece uma ferramenta educacional de
exploração. Não alterar sua pontuação, nem derivar novas qualidades a partir de
ácidos graxos, antes de haver dados numéricos e rastreáveis suficientes.

Esta é uma linha de base do conteúdo atual de `data/oils.json`, não uma
validação química independente de cada valor.

## Primeira curadoria aplicada

Em 2026-07-21, azeite, coco, palma, mamona e karité receberam evidência parcial
no próprio arquivo de dados. Para esses cinco itens, foram conferidos somente
`sapNaOH` e `sapKOH` contra a [tabela de óleos do SoapCalc](https://soapcalc.net/oil-list).
Cada item aponta para a fonte, a data e os campos efetivamente revisados.

Os valores existentes de SAP desses itens coincidiram com a fonte, portanto a
curadoria não alterou o cálculo. A evidência não se estende a iodo, INS, perfil
de ácidos graxos, `maxPercent`, estabilidade, DOS, notas ou recomendações.

A Biblioteca de Óleos mostra “SAP conferido” somente nesses itens, junto da
fonte e da data. O selo descreve os dois campos revisados; ele não representa
aprovação geral do ingrediente ou da formulação.

## Modelo de evidência por afirmação

Atualizado em 2026-07-21, depois da primeira curadoria.

O formato inicial (`verifiedFields` + `sourceIds` em paralelo) responde "quais
fontes sustentam estes campos", mas não "qual valor cada fonte informou e por
que adotamos o nosso". Com uma única fonte isso passa; com duas, a informação
se perde exatamente quando a pesquisa fica mais rica. A evidência passou então
a ser uma lista de afirmações, cada uma com:

- `fields` — os campos que a afirmação cobre;
- `observations` — o que **cada** fonte publicou, com `locator` apontando a
  linha ou tabela exata, e valores em texto quando a fonte publica faixas;
- `status` — `supported` (a fonte confirma o valor adotado), `conflicting`
  (diverge, e mantivemos o nosso) ou `estimated` (derivamos das observações);
- `decision` e `rationale` — como e por que o valor atual foi escolhido.

Duas decisões deliberadas:

**O valor canônico não é duplicado dentro da evidência.** A fonte da verdade
continua sendo o campo do próprio óleo (`oil.iodine`). Repetir o número em um
`acceptedValues` criaria justamente a divergência silenciosa que o modelo
existe para evitar; a coerência é garantida por teste, não por convenção.

**O catálogo de fontes segue dentro de `oils.json`.** Extrair um
`data/sources.json` compartilhado só se paga quando um segundo módulo precisar
citar as mesmas fontes — hoje as referências dos módulos de Aprendizado são
texto livre. A forma do registro já está preparada (`sourceType`, `publisher`,
`publicationDate`), então mover o arquivo depois é barato.

Os testes em `tests/oil-library.test.ts` impedem referência a fonte
inexistente, afirmação sem observação que a cubra, `supported` cujo valor não
bate com o publicado e `conflicting` sem divergência real ou sem justificativa.

## Divergências registradas, ainda não aplicadas

A mesma fonte possui um conjunto estruturado de iodo, INS e oito ácidos graxos.
A comparação encontrou diferenças pequenas nos dados consumidos atualmente:

| Óleo | MoonRock: iodo / INS | SoapCalc: iodo / INS |
| --- | --- | --- |
| Azeite | 80 / 105 | 85 / 105 |
| Coco 76° | 10 / 258 | 10 / 258 |
| Palma | 52 / 145 | 53 / 145 |
| Mamona | 85 / 95 | 86 / 95 |
| Karité | 60 / 115 | 59 / 116 |

Essas diferenças não foram aplicadas porque iodo e INS participam do score do
simulador. Alterar apenas os cinco itens mudaria sugestões enquanto os outros
34 continuariam sem revisão equivalente. O próximo passo deve ser uma decisão
de migração comparável e testada, não correções avulsas.

Desde a evolução do modelo, essa tabela deixou de viver só aqui: cada
divergência está registrada em `data/oils.json` como afirmação `conflicting`
com `decision: "editorial_default"`, e a Biblioteca de Óleos avisa, no card do
óleo, que a fonte publica valor diferente do adotado. O selo "SAP conferido"
continua restrito às afirmações `supported`.

## Inventário observado

- 39 óleos e manteigas, sem IDs duplicados;
- todos têm valores numéricos para SAP NaOH, iodo, INS e as cinco propriedades
  usadas pelo simulador atual;
- todos têm `maxPercent`, estabilidade, risco de DOS e nível de confiança;
- a escala de `hardness`, `cleansing`, `conditioning`, `bubbly` e `creamy` é
  uma escala editorial ordinal de 0 a 5 por ingrediente. Ela não deve ser
  apresentada como os números calculados de uma fórmula por SoapCalc;
- na data da auditoria não havia metadados de fonte por óleo ou por campo. A
  descrição da coleção citava fontes múltiplas, mas não permitia conferir a
  origem de um SAP, de um máximo recomendado ou de uma observação individual.
  Isso foi resolvido para os cinco óleos-base CP — ver "Modelo de evidência por
  afirmação". Os outros 34 seguem sem proveniência.

## Perfis de ácidos graxos

Os dados atuais não sustentam o cálculo de eixos novos a partir de ácidos
graxos:

- quatro itens não possuem perfil: jojoba, copaíba, neem e palmiste;
- os valores existentes são textos de faixa ou porcentagem, não números
  normalizados;
- a cobertura é parcial: há laúrico em 3 itens, ricinoleico em 1, oleico em
  18 e linoleico em 12; mirístico, palmítico, esteárico e linolênico não estão
  modelados de forma consistente;
- nenhum item contém o conjunto necessário para recompor, de forma comparável,
  os perfis usuais de dureza, limpeza, condicionamento, espuma rápida e espuma
  cremosa.

Portanto, converter agora esses textos em médias arbitrárias daria uma falsa
precisão. Também não é adequado combinar a escala editorial atual com um eixo
de ácidos graxos incompleto e chamá-lo de melhoria do score.

## Dados por finalidade

| Finalidade | Estado atual | Regra até revisão |
| --- | --- | --- |
| Cálculo de NaOH (`sapNaOH`) | valor numérico, porém sem fonte por campo | manter o cálculo atual; verificar os valores usados antes de qualquer expansão da biblioteca |
| Perfil educativo do simulador | escala ordinal por ingrediente | manter como estimativa explicável, sem promessa de resultado de bancada |
| Iodo e INS | valores numéricos, sem proveniência individual | exibir como indicadores herdados; não criar limiares novos com eles |
| `maxPercent`, estabilidade e `dosRisk` | orientação editorial | limitar apenas a busca do simulador e manter avisos, sem tratá-los como limite químico ou selo de segurança |
| `confidenceLevel` | classificação editorial (`liberado`, `alerta`, `bloqueado`) | manter a interface atual; documentar o critério antes de usar a classificação para bloquear novos fluxos |
| Notas de uso | texto editorial, com alegações diversas | não usar como fundamento de recomendação terapêutica, dermatológica ou de segurança |

## Conteúdo que requer revisão de evidência

Algumas notas associam ingredientes a efeitos como anti-inflamatório,
antifúngico, antibacteriano, cicatrizante, regenerador ou adequação a condições
de pele. Sem referência rastreável e sem considerar a saponificação, essas
frases não devem orientar uma decisão de uso corporal, diagnóstico ou
tratamento. Esta auditoria não remove o conteúdo; ela impede que esse conteúdo
seja ampliado ou empregado como regra do produto antes de revisão editorial
com fontes adequadas.

Também há orientações de DOS e antioxidantes. Elas podem permanecer como aviso
didático enquanto forem claramente apresentadas como orientação, não como
garantia de estabilidade ou recuperação de um lote.

## Próxima evolução mínima segura

Quando houver autorização para melhorar a base, fazer em uma etapa própria:

1. escolher primeiro um conjunto pequeno de óleos-base de Cold Process usados
   pela Ana;
2. registrar, para cada campo que participa de cálculo ou aviso, a fonte, data
   de consulta, unidade, faixa e confiança do dado;
3. decidir separadamente se os perfis graxos passam a ter valores numéricos e
   quais ácidos são obrigatórios;
4. adicionar validação de schema e testes de completude antes de trocar qualquer
   score;
5. recalibrar a heurística somente depois de comparar a saída antiga e a nova
   em exemplos definidos.

Não criar agora uma entidade universal de matérias-primas, um banco de fontes,
um otimizador químico ou recomendações automáticas baseadas nas notas. O
contrato local-first e a biblioteca existente continuam intactos.
