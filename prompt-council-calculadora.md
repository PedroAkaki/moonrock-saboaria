# MoonRock Saboaria — Prompt para Council: Calculadora Explicativa

## Contexto

Leia `CONTEXTO_IA.md` e `data/learning-modules.json` antes de responder.
O app vive em https://moonrock-saboaria.vercel.app
Repositório: github.com/PedroAkaki/moonrock-saboaria

## Problema

A calculadora atual entrega resultados corretos, mas é uma "caixa preta":
- Mostra números sem explicar como foram calculados
- Inputs/selects ainda têm fundo claro (quebram o dark theme lunar)
- Nenhum campo explica o que significa (superfat, SAP, INS, DOS)
- Ana (química UFMG) quer entender a matemática por trás

## Tarefa

Transformar a calculadora em uma **Calculadora Explicativa** que ensina enquanto calcula.

### Escopo obrigatório

**1. Exibir fórmulas no resultado**
Após calcular, mostrar abaixo dos números:
```
NaOH = 500g × 0,135 × (1 - 0,05) = 64,1g
Água = 64,1g × 2,2 = 141,0g
```
Detalhar por óleo quando houver múltiplos:
```
Azeite: 500g × 0,135 × 0,95 = 64,1g
Coco: 200g × 0,183 × 0,95 = 34,8g
NaOH total: 98,9g
```

**2. Tooltips educativos nos campos**
Adicionar um ícone `?` ao lado destes campos com tooltip explicativo:
- **Peso do óleo:** "A pesagem precisa é essencial. Erros alteram todo o cálculo de soda."
- **Superfat:** "Percentual de óleo não saponificado. Aumenta hidratação mas reduz dureza. Faixa típica: 3-8%."
- **Razão água:soda:** "Define a concentração da solução alcalina. 2:1 é padrão. Mais água = mais tempo de cura."
- **SAP (índice de saponificação):** "Valor médio para estimar NaOH necessário. Varia por lote e fornecedor."
- **INS:** "Índice empírico de qualidade do sabão. Ideal 136-170. Valores fora disso podem indicar barra muito mole ou muito dura."
- **DOS (Dreaded Orange Spots):** "Risco de rancificação por oxidação de óleos insaturados. Alerta quando superfat > 8% com óleos instáveis."

**3. Correção de dark theme**
Todos os inputs (`<input>`, `<select>`) e seus containers devem usar o tema escuro:
- Background: `bg-moon-800` ou similar escuro
- Borda: `border-moon-500`
- Texto: `text-white`
- Placeholder: `placeholder-moon-400`
- Manter consistência com o resto do app

**4. Disclaimer heurístico**
Adicionar frase abaixo de todas as propriedades estimadas (INS, dureza, espuma, etc):
"Propriedades calculadas são estimativas heurísticas baseadas no perfil de ácidos graxos. Não substituem teste prático e cura adequada."

### Restrições

- ❌ Não alterar `lib/soap/calculator.ts` (engine matemática)
- ❌ Não alterar `data/oils.json` (banco de óleos)
- ❌ Não alterar `data/learning-modules.json` (módulos de estudo)
- ❌ Não criar backend, login, banco de dados
- ❌ Não adicionar dependências pesadas
- ✅ Manter dark theme lunar, hexágonos, mobile-first
- ✅ Build precisa passar (`npm run build`)

### Definition of Done

1. Resultado mostra fórmula com valores substituídos
2. Tooltips explicativos nos campos principais
3. Inputs/selects no dark theme (sem fundo branco)
4. Disclaimer heurístico visível nas propriedades
5. Calculadora continua funcionando (nenhum resultado quebrado)
6. Build passa (`npm run build`)
7. Mobile responsivo

## Entregável esperado

- Código completo para implementar (ou diff claro)
- Quais arquivos criar/alterar
- Análise de riscos
- Estimativa de tempo/esforço

---

## Informações extras

### Arquivo principal
`app/calculadora/page.tsx` (~5KB, 200+ linhas) — a página inteira da calculadora.

### Engine matemática (NÃO ALTERAR)
`lib/soap/calculator.ts` — exporta `calculateSoap()`, `calculateMold()`, `validateInput()`.

### Estrutura do resultado
```typescript
interface CalculatorResult {
  oils: { oilId: string; name: string; grams: number; percentage: number }[];
  totalOilsGrams: number;
  naoh: number;
  naohWithSuperfat: number;
  waterGrams: number;
  waterRatio: number;
  superfatPercent: number;
  ins: number;
  insStatus: "low" | "ideal" | "high";
}
```

### Estrutura do input
```typescript
interface CalculatorInput {
  oils: { oilId: string; grams: number }[];
  superfat: number;
  waterRatio: number;
}
```

### Componentes existentes (consultar antes de recriar)
- `components/GlossaryTerm.tsx` — tooltip de glossário (hover reveal)
- `components/SafetyChecklist.tsx` — modal de segurança EPI
- Ambos em `components/` — podem servir de referência para o TooltipInfo

### Estilo
Usar classes Tailwind do tema lunar:
- `bg-moon-800` / `bg-moon-700/50 backdrop-blur` para containers
- `border-moon-600` / `border-moon-500` para bordas
- `text-moon-100` / `text-moon-300` / `text-moon-400` para textos
- `text-white` para títulos
- Inputs escuros: `bg-moon-800 border-moon-500 text-white placeholder-moon-400`
