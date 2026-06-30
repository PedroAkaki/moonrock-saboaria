# MoonRock Saboaria — Prompt para Council: Calculadora Explicativa

## Contexto

Leia `CONTEXTO_IA.md`, `data/learning-modules.json` e `lib/soap/calculator.ts` antes de responder.

O app vive em: https://moonrock-saboaria.vercel.app
Repositório: github.com/PedroAkaki/moonrock-saboaria

## Problema

A calculadora atual entrega resultados úteis, mas ainda funciona como uma "caixa preta":
- mostra números sem explicar como foram calculados
- inputs/selects ainda têm fundo claro quebram o dark theme lunar
- campos importantes não explicam seus conceitos
- Ana (Química UFMG, iniciante em saboaria) quer entender a matemática e os limites dos cálculos

## Objetivo

Transformar a calculadora em uma **Calculadora Explicativa**:
- útil na bancada
- clara no mobile
- tecnicamente honesta
- educativa sem ser infantilizada
- consistente com a identidade MoonRock

## Escopo obrigatório

### 1. Exibir fórmulas no resultado

Após calcular, mostrar abaixo dos resultados principais:

```
NaOH = massa do óleo × SAP NaOH × (1 - superfat)
Água = NaOH total × razão água:soda
```

Mostrar também os valores substituídos.

Exemplo com um óleo:
```
NaOH = 500g × 0,135 × (1 - 0,05) = 64,1g
Água = 64,1g × 2,2 = 141,0g
```

Com múltiplos óleos, detalhar por óleo:
```
Azeite: 500g × 0,135 × 0,95 = 64,1g
Coco: 200g × 0,183 × 0,95 = 34,8g

NaOH total = 98,9g
Água = 98,9g × 2,2 = 217,6g
```

### 2. Tooltips educativos nos campos

Adicionar um ícone `?` ou equivalente ao lado dos campos principais.

**Peso do óleo:**
"A pesagem precisa é essencial. Erros de massa alteram diretamente o cálculo de soda."

**Superfat:**
"Percentual de óleo planejado para permanecer não saponificado. Aumenta margem contra excesso de soda e pode deixar o sensorial mais suave, mas em excesso pode reduzir espuma, dureza e estabilidade."

**Razão água:soda:**
"Define a concentração da solução alcalina. Faixas comuns: 2:1 a 2,7:1. Menos água acelera endurecimento/trace; mais água aumenta fluidez e tempo de cura."

**SAP:**
"Valor médio usado para estimar quanto NaOH/KOH um óleo exige para saponificação. Pode variar por lote, origem e fornecedor."

**INS:**
"Índice empírico usado por calculadoras de sabão para comparar fórmulas. Faixas de referência ajudam, mas não são medição laboratorial nem garantia de qualidade."

**DOS:**
"Risco de oxidação/rancidez, especialmente com óleos muito insaturados, superfat alto, matéria-prima velha ou armazenamento ruim."

**Tamanho da forma:**
"Volume estimado da forma. A calculadora converte cm³ em massa aproximada de sabão, mas o rendimento real varia com fórmula, água e perdas."

### 3. Correção de dark theme

Todos os inputs, selects e seus containers devem respeitar o tema escuro:
- background escuro (ex: `bg-moon-800`)
- borda coerente (ex: `border-moon-500`)
- texto claro (`text-white`)
- placeholder discreto (`placeholder-moon-400`)
- foco visível e acessível
- consistente no mobile

### 4. Disclaimer heurístico

Adicionar abaixo das propriedades estimadas:

"Propriedades calculadas são estimativas heurísticas baseadas no perfil de ácidos graxos. Elas ajudam na formulação, mas não substituem teste prático, cura adequada e avaliação do lote."

Esse aviso deve aparecer perto de INS, dureza, limpeza, espuma, condicionamento, cremosidade e DOS.

### 5. Segurança

Manter ou reforçar o alerta de segurança:
"NaOH/KOH são bases cáusticas. Use EPIs, trabalhe em local ventilado e sempre adicione a soda à água, nunca água sobre a soda."

## Restrições

- Não alterar `data/oils.json`
- Não alterar `data/recipes.json`
- Não alterar `data/learning-modules.json`
- Não criar backend, login ou banco de dados
- Não adicionar dependências pesadas
- Não refatorar a arquitetura geral
- **Não alterar a lógica matemática dos cálculos**
- Se for necessário alterar `lib/soap/calculator.ts`, apenas expor breakdown/metadata dos cálculos mantendo os resultados numéricos idênticos
- Manter dark theme lunar, hexágonos e mobile-first
- Build precisa passar com `npm run build`

## Antes de implementar (análise prévia)

1. Onde a calculadora calcula NaOH, água, INS e DOS?
2. A UI já tem dados suficientes para montar o breakdown?
3. É melhor calcular o breakdown na página ou expor isso pelo helper do calculator.ts sem mudar a matemática?
4. Há componente de tooltip existente (ex: GlossaryTerm.tsx) que pode ser reaproveitado?
5. Quais inputs/selects ainda quebram o dark theme?

## Definition of Done

1. Resultado mostra fórmula com valores substituídos
2. Fórmula de NaOH aparece por óleo quando houver múltiplos
3. Água aparece com fórmula e valores substituídos
4. Tooltips explicativos nos campos principais
5. Inputs/selects seguem o dark theme
6. Disclaimer heurístico perto das propriedades estimadas
7. Alerta de segurança continua visível
8. Calculadora continua funcionando (nenhum resultado numérico muda)
9. Mobile responsivo
10. `npm run build` passa

## Entregável esperado

Se for resposta de council/revisão:
1. Avalie o plano
2. Aponte riscos técnicos e pedagógicos
3. Sugira a implementação mais simples
4. Diga quais arquivos provavelmente serão alterados
5. Dê critérios de aceite

Se for execução via agente de código:
1. Liste arquivos alterados
2. Faça mudanças pequenas e focadas
3. Rode `npm run build`
4. Reporte se algum cálculo mudou
