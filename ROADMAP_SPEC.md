# MoonRock Saboaria — Especificação Técnica do Roadmap Interativo

> Gerado por DeepSeek Expert em 29/06/2026
> Baseado em: HANDFOFF.md, PENDENCIAS.md, data/curriculo.md

## Plano de Implementação

### Fase 1: Estrutura de dados
Criar `data/learning-modules.json` com os 8 níveis. Níveis 1-3 completos; 4-8 como `"status": "coming-soon"`.

### Fase 2: Rotas e páginas
- Atualizar `/roadmap` para consumir `learning-modules.json`
- Criar rota dinâmica `/roadmap/[slug]`
- Criar componente `<ModuleContent />`

### Fase 3: Progresso
- Hook `useModuleProgress(slug)` com localStorage
- Componente `<Checklist />`

### Fase 4: Conteúdo denso
Escrever conteúdo real dos módulos 1, 2 e 3 no JSON

## Arquivos a criar/alterar

| Arquivo | Ação |
|---------|------|
| `data/learning-modules.json` | **Criar** — 8 módulos completos |
| `types/learning.ts` | **Criar** — tipos TypeScript |
| `hooks/useModuleProgress.ts` | **Criar** — hook de progresso |
| `components/Checklist.tsx` | **Criar** — checklist interativo |
| `components/ModuleContent.tsx` | **Criar** — renderizador de seções |
| `app/roadmap/page.tsx` | **Alterar** — cards dos 8 níveis |
| `app/roadmap/[slug]/page.tsx` | **Criar** — página dinâmica |

Nenhum outro arquivo existente será alterado.

## Estrutura do JSON

```typescript
interface LearningModule {
  slug: string;
  level: number;
  title: string;
  subtitle: string;
  status: "complete" | "coming-soon";
  objective: string;
  purpose: string;
  prerequisites: string[];
  chemicalFundamentals: string;
  rawMaterials: string[];
  equipment: string[];
  safety: string;
  stepByStep: { step: number; title: string; description: string; warning?: string }[];
  criticalParameters: string;
  temperatures?: string;
  approximateTime: string;
  visualCriteria: string;
  commonMistakes: string[];
  troubleshooting: { problem: string; cause: string; solution: string }[];
  practicalExercise: string;
  completionCriteria: string[];
  relatedRecipes: string[];
  relatedGlossaryTerms: string[];
  references: string[];
  scopeNotice: string;
  checklist: { id: string; label: string }[];
}
```

## Componentes

### types/learning.ts
```typescript
export interface ChecklistItem { id: string; label: string; }
export interface Step { step: number; title: string; description: string; warning?: string; }
export interface TroubleshootingItem { problem: string; cause: string; solution: string; }
export interface LearningModule { /* campos acima */ }
```

### hooks/useModuleProgress.ts
Hook client-side que lê/escreve `moonrock-progress-{slug}` no localStorage.
Expõe: `checkedItems`, `toggle(id)`, `isComplete(checklist)`.

### components/Checklist.tsx
Client component. Recebe `moduleSlug` + `items[]`. Renderiza:
- Barra de progresso (checklist count / total)
- Checkboxes com toggle
- Mensagem "Módulo concluído!" quando todos marcados

### components/ModuleContent.tsx
Renderiza cada seção do módulo a partir do JSON. Seções:
- Header (nível, título, subtítulo, status)
- Objetivo, propósito, pré-requisitos
- Fundamentos químicos (com quebras de linha)
- Matérias-primas, equipamentos
- Segurança (com destaque vermelho)
- Passo a passo numerado
- Parâmetros críticos, temperaturas, tempo
- Critérios visuais
- Erros comuns
- Diagnóstico de problemas (cards)
- Exercício prático
- Critérios de conclusão
- Receitas relacionadas, glossário, referências
- Aviso de escopo (destaque)
- Checklist interativo

### app/roadmap/page.tsx
```tsx
import modules from "@/data/learning-modules.json";
// Renderizar cards clicáveis para cada módulo
// Níveis 4-8 com badge "Em breve"
```

### app/roadmap/[slug]/page.tsx
```tsx
import { notFound } from "next/navigation";
import modules from "@/data/learning-modules.json";
import { ModuleContent } from "@/components/ModuleContent";
// generateStaticParams para build estático
```

## Conteúdo: Nível 3 — Cold Process Básico (modelo)

[JSON completo no PENDENCIAS.md ou data/curriculo.md]

## Riscos

### Técnicos
- localStorage pode ser limpo pelo usuário ou indisponível em alguns PWAs. Não crítico — progresso é auxílio, não dado vital.
- JSON pode crescer muito. Para MVP, estático é aceitável. Futuro: MDX ou CMS.

### Pedagógicos
- Conteúdo denso pode intimidar. Barra de progresso alivia a carga.
- Calibrado para Ana (química). Intencionalmente técnico.

### Regulatórios
- App deve sempre diferenciar sabão de limpeza (nível 2) de sabonete cosmético (nível 3+).
- `scopeNotice` cobre aviso ANVISA.

## Próximo passo (codar)
1. Criar `data/learning-modules.json` (3 completos + 5 esqueletos)
2. Criar `types/learning.ts`
3. Criar `hooks/useModuleProgress.ts`
4. Criar `components/Checklist.tsx` + `ModuleContent.tsx`
5. Atualizar `app/roadmap/page.tsx`
6. Criar `app/roadmap/[slug]/page.tsx`
7. Build e testar mobile
