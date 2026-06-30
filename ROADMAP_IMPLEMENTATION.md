# MoonRock Saboaria — Implementação do Roadmap Interativo (Z.ai GLM)

> Código completo para Fase 1, gerado por Z.ai GLM-5.2 em 29/06/2026
> Baseado em: ROADMAP_SPEC.md, data/curriculo.md, HANDFOFF.md

## Arquivos a criar/alterar

| Arquivo | Ação |
|---------|------|
| `data/learning-modules.json` | Criar — 8 níveis (3 completos, 5 esqueleto) |
| `components/LevelProgress.tsx` | Criar — checklist localStorage |
| `app/roadmap/page.tsx` | Substituir — grid de cards dos 8 níveis |
| `app/roadmap/[slug]/page.tsx` | Criar — página dinâmica de módulo |

Nenhum outro arquivo existente será alterado.

## Estrutura do JSON

```json
{
  "id": 1,
  "slug": "base-glicerinada",
  "level": 1,
  "title": "Base Glicerinada (Melt and Pour)",
  "status": "available",
  "summary": "Introdução à manipulação de sabão pré-saponificado...",
  "objective": "Aprender a fundir, colorir, aromatizar e moldar bases prontas...",
  "scope_warning": "Produto para uso pessoal e cosmético...",
  "prerequisites": ["Nenhum. Módulo inicial absoluto."],
  "chemical_fundamentals": ["A base glicerinada já passou pelo processo de saponificação..."],
  "materials": ["Base glicerinada", "Essência/fragrância", "Corante líquido ou mica", "Álcool"],
  "equipment": ["Micro-ondas", "Jarra de vidro", "Espátula", "Formas", "Borrifador"],
  "safety": ["Risco térmico", "Ventilação"],
  "process": ["Pese e corte", "Derreta", "Adicione corante", "Adicione fragrância", "Borrife álcool", "Despeje", "Desenforme"],
  "critical_parameters": ["Temperatura: não exceder 70°C", "Limite aditivos: 5-10%"],
  "visual_criteria": ["Superfície lisa e brilhante", "Ausência de camada esbranquiçada"],
  "common_errors": ["Bolhas: álcool resolve", "Suor: embalar em filme PVC"],
  "troubleshooting": "Se não endurecer, excesso de aditivo líquido.",
  "practical_exercise": "Faça um sabão de 100g com base transparente...",
  "conclusion_criteria": ["Compreender por que a base não deve ferver.", "Identificar suor de glicerina.", "Diferenciar base pronta de CP."],
  "related_recipes": [],
  "related_glossary": ["Glicerol", "Higroscópico", "Saponificação"],
  "references": ["Scientific Soapmaking (Kevin Dunn)"]
}
```

## Componentes

### LevelProgress.tsx
Client component com:
- Barra de progresso (checklist count / total)
- Checkboxes interativos salvos em localStorage (`moonrock-progress-{slug}`)
- Ícone check SVG branco no quadrado preto
- Texto riscado quando marcado

### app/roadmap/page.tsx (substituir)
- Grid 2 colunas mobile-first
- Cards com hexágono minimalista (quadrado rotacionado 45°)
- Badge "Acessar Módulo" / "Em Breve"
- Dark theme puro (bg-black, text-white)
- Importa `@/data/learning-modules.json`

### app/roadmap/[slug]/page.tsx
- `generateStaticParams` para PWA offline
- Navegação "Voltar para Trilha"
- Seções: objetivo, fundamentos químicos (com border-left), segurança (vermelho), matérias-primas, equipamentos, processo (numerado), parâmetros críticos, critérios visuais, erros/diagnóstico, exercício prático
- `scope_warning` em destaque amarelo
- LevelProgress no final

## Análise Crítica (checklist)

1. ✅ **Ajuda Ana a estudar?** Conteúdo denso: triglicerídeos, higroscopia, variação SAP, diagnóstico
2. ✅ **Ajuda a tirar dúvida na prática?** Parâmetros visuais + erros comuns = manual de bancada
3. ✅ **Age com segurança?** Segurança em vermelho, scope_warning em amarelo, EPI destacado
4. ✅ **Evita confusão cosmético vs saneante?** Nível 2 tem alerta explícito
5. ✅ **Preserva calculadora/dados?** Nenhum outro arquivo tocado
6. ✅ **Estética MoonRock?** Dark theme, bordas sutis, hexágono discreto

## Dependências
- `date-fns` (opcional, só pra formatar data se necessário)
- Nenhuma dependência nova obrigatória

## Próximo passo
Após implementar e validar build, próximo é **Calculadora Explicativa** — mostrar fórmulas químicas no resultado.
