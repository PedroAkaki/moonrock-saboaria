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

## Inventário observado

- 39 óleos e manteigas, sem IDs duplicados;
- todos têm valores numéricos para SAP NaOH, iodo, INS e as cinco propriedades
  usadas pelo simulador atual;
- todos têm `maxPercent`, estabilidade, risco de DOS e nível de confiança;
- a escala de `hardness`, `cleansing`, `conditioning`, `bubbly` e `creamy` é
  uma escala editorial ordinal de 0 a 5 por ingrediente. Ela não deve ser
  apresentada como os números calculados de uma fórmula por SoapCalc;
- não há metadados de fonte por óleo ou por campo. A descrição da coleção cita
  fontes múltiplas, mas não permite conferir a origem de um SAP, de um máximo
  recomendado ou de uma observação individual.

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
