#!/bin/bash
# build-project-doc.sh — Gera .md completo do projeto + contexto focado por tarefa.
# Uso: bash scripts/build-project-doc.sh [caminho/output]
# Exemplo: bash scripts/build-project-doc.sh ~/Desktop/meu-projeto.md

set -euo pipefail

PROJ_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:-$PROJ_DIR/projeto-completo.md}"

# Todos os arquivos de código do projeto (para garantir que nenhum fique de fora)
INCLUDE_PATTERNS=(
  "package.json"
  "tsconfig.json"
  "next.config.ts"
  "postcss.config.mjs"
  "eslint.config.mjs"
  "AGENTS.md"
  "app/globals.css"
  "app/layout.tsx"
  "app/page.tsx"
  "app/aprendizado/page.tsx"
  "app/aprendizado/[slug]/page.tsx"
  "app/calculadora/page.tsx"
  "app/diario/page.tsx"
  "app/oleos/page.tsx"
  "app/receitas/page.tsx"
  "app/roadmap/page.tsx"
  "components/*.tsx"
  "lib/progress.ts"
  "lib/learning.ts"
  "lib/diario.ts"
  "lib/soap/calculator.ts"
  "lib/soap/oils.ts"
  "data/learning-modules.json"
  "data/recipes.json"
  "data/glossary.json"
  "data/curriculo.md"
  "data/oils.json"
  "data/roadmap.json"
  "public/manifest.json"
  "public/sw.js"
  "CONTEXTO_IA.md"
  "HANDFOFF.md"
  "PENDENCIAS.md"
  "PROJECT_PLAN.md"
)

{
  echo "# MoonRock Saboaria — Projeto Completo"
  echo "> Gerado por: scripts/build-project-doc.sh"
  echo "> Data: $(date '+%d/%m/%Y %H:%M')"
  echo "> Repositório: github.com/PedroAkaki/moonrock-saboaria"
  echo "> Deploy: https://moonrock-saboaria.vercel.app"
  echo ""

  echo "## Estrutura de Diretórios"
  echo "\`\`\`"
  find "$PROJ_DIR" -maxdepth 1 -type f \
    -not -name "package-lock.json" \
    -not -name "next-env.d.ts" \
    -not -name ".gitignore" \
    -not -name "README.md" \
  | sort | while read -r f; do
    echo "$(basename "$f")"
  done
  find "$PROJ_DIR/app" -type f | sed "s|$PROJ_DIR/||" | sort | while read -r f; do echo "$f"; done
  find "$PROJ_DIR/components" -type f | sed "s|$PROJ_DIR/||" | sort | while read -r f; do echo "$f"; done
  find "$PROJ_DIR/lib" -type f | sed "s|$PROJ_DIR/||" | sort | while read -r f; do echo "$f"; done
  find "$PROJ_DIR/data" -type f \( -name "*.json" -o -name "*.md" \) | sed "s|$PROJ_DIR/||" | sort | while read -r f; do echo "$f"; done
  find "$PROJ_DIR/public" -type f \( -name "*.json" -o -name "*.js" \) | sed "s|$PROJ_DIR/||" | sort | while read -r f; do echo "$f"; done
  echo "\`\`\`"
  echo ""
  echo "---"
  echo ""

  for pattern in "${INCLUDE_PATTERNS[@]}"; do
    for filepath in "$PROJ_DIR"/$pattern; do
      [ -f "$filepath" ] || continue
      relpath="${filepath#$PROJ_DIR/}"
      [ -s "$filepath" ] || continue

      case "$relpath" in
        *.tsx)   lang="tsx" ;;
        *.ts)    lang="typescript" ;;
        *.json)  lang="json" ;;
        *.css)   lang="css" ;;
        *.js)    lang="javascript" ;;
        *.mjs)   lang="javascript" ;;
        *.md)    lang="markdown" ;;
        *)       lang="" ;;
      esac

      echo "### $relpath"
      echo ""
      echo '```'"$lang"
      cat "$filepath"
      echo '```'
      echo ""
    done
  done

} > "$OUTPUT"

LINE_COUNT=$(wc -l < "$OUTPUT")
BYTE_COUNT=$(wc -c < "$OUTPUT")
echo "✅ Projeto completo em: $(cygpath -w "$OUTPUT")"
echo "   $LINE_COUNT linhas · $((BYTE_COUNT / 1024))KB"

# -- Gera contexto focado para tarefa específica (segundo argumento) --
# Uso: bash scripts/build-project-doc.sh saida.md "diario"
# Isso gera um arquivo adicional saida-contexto-diario.md
TASK_FOCUS="${2:-}"
if [ -n "$TASK_FOCUS" ]; then
  FOCUS_FILE="${OUTPUT%.md}-contexto-${TASK_FOCUS}.md"
  {
    echo "# MoonRock Saboaria — Contexto: $TASK_FOCUS"
    echo "> Gerado em: $(date '+%d/%m/%Y %H:%M')"
    echo ""
    echo "## Stack"
    echo "- Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4"
    echo "- localStorage · PWA · Sem banco · Sem login"
    echo ""
    echo "## Regras obrigatórias"
    echo "- Não trocar stack · Não criar backend · Não criar login"
    echo "- Rodar \`npm run build\` · Manter PT-BR"
    echo "- Segurança com soda sempre explícita"
    echo "- Mobile-first · Dark theme lunar"
    echo ""

    # Arquivos mais recentes primeiro (git diff)
    echo "## Arquivos alterados recentemente"
    echo "\`\`\`"
    cd "$PROJ_DIR" && git log --oneline -5 --name-only 2>/dev/null | head -30 || echo "(sem git)"
    echo "\`\`\`"
    echo ""

    # Include relevant patterns based on task name
    case "$TASK_FOCUS" in
      diario)
        echo "## Objetivo"
        echo "Auditar ou evoluir o Diário de Lote (rota /diario)."
        echo ""
        echo "## Arquivos críticos"
        for f in "lib/diario.ts" "app/diario/page.tsx" "app/calculadora/page.tsx" "app/page.tsx" "public/sw.js"; do
          echo "- $f"
        done
        echo ""
        echo "## Código completo"
        echo ""
        for pattern in "lib/diario.ts" "app/diario/page.tsx" "public/sw.js"; do
          for filepath in "$PROJ_DIR"/$pattern; do
            [ -f "$filepath" ] || continue
            relpath="${filepath#$PROJ_DIR/}"
            lang="typescript"
            case "$relpath" in *.js) lang="javascript" ;; *.tsx) lang="tsx" ;; esac
            echo "### $relpath"
            echo '```'"$lang"
            cat "$filepath"
            echo '```'
            echo ""
          done
        done
        ;;
      oleos)
        echo "## Objetivo"
        echo "Auditar ou evoluir a Biblioteca de Óleos (rota /oleos)."
        echo ""
        echo "## Arquivos críticos"
        for f in "data/oils.json" "app/oleos/page.tsx" "lib/soap/oils.ts"; do echo "- $f"; done
        echo ""
        echo "## Código completo"
        for pattern in "app/oleos/page.tsx" "lib/soap/oils.ts"; do
          for filepath in "$PROJ_DIR"/$pattern; do
            [ -f "$filepath" ] || continue
            relpath="${filepath#$PROJ_DIR/}"
            echo "### $relpath"
            echo '```tsx'
            cat "$filepath"
            echo '```'
            echo ""
          done
        done
        ;;
      estudo)
        echo "## Objetivo"
        echo "Auditar ou evoluir o Motor de Estudo (rotas /aprendizado e /aprendizado/[slug])."
        echo ""
        echo "## Arquivos críticos"
        for f in "app/aprendizado/page.tsx" "app/aprendizado/[slug]/page.tsx" "components/VisualRoadmap.tsx" "components/ModuleOrbitMap.tsx" "lib/learning.ts" "lib/progress.ts"; do echo "- $f"; done
        echo ""
        echo "## Código completo"
        for pattern in "app/aprendizado/page.tsx" "app/aprendizado/[slug]/page.tsx" "lib/learning.ts" "lib/progress.ts"; do
          for filepath in "$PROJ_DIR"/$pattern; do
            [ -f "$filepath" ] || continue
            relpath="${filepath#$PROJ_DIR/}"
            echo "### $relpath"
            echo '```tsx'
            cat "$filepath"
            echo '```'
            echo ""
          done
        done
        ;;
      roadmap)
        echo "## Objetivo"
        echo "Auditar ou evoluir o Mapa Visual (rota /roadmap)."
        echo ""
        echo "## Arquivos críticos"
        for f in "app/roadmap/page.tsx" "components/RoadmapMap.tsx" "data/learning-modules.json" "data/recipes.json"; do echo "- $f"; done
        echo ""
        echo "## Código completo"
        for pattern in "app/roadmap/page.tsx" "components/RoadmapMap.tsx"; do
          for filepath in "$PROJ_DIR"/$pattern; do
            [ -f "$filepath" ] || continue
            relpath="${filepath#$PROJ_DIR/}"
            echo "### $relpath"
            echo '```tsx'
            cat "$filepath"
            echo '```'
            echo ""
          done
        done
        ;;
    esac

    echo "## Comandos"
    echo "\`\`\`bash"
    echo "npm run dev     # desenvolvimento"
    echo "npm run build   # build de produção"
    echo "npm run lint    # lint"
    echo "\`\`\`"
    echo ""
    echo "## Não fazer"
    echo "- Backend · Login · Fotos · PDF · Custo · Estoque"
    echo "- Refatorar stack · Adicionar dependências pesadas"
    echo ""

  } > "$FOCUS_FILE"

  echo "✅ Contexto focado em: $(cygpath -w "$FOCUS_FILE")"
fi

# Copia pra relatorios-AI se for raiz
if [ "$OUTPUT" = "$PROJ_DIR/projeto-completo.md" ]; then
  REL_DIR="$HOME/Desktop/MoonRock/relatorios-AI"
  mkdir -p "$REL_DIR"
  TIMESTAMP=$(date '+%Y%m%d_%H%M')
  cp "$OUTPUT" "$REL_DIR/projeto-completo-$TIMESTAMP.md"
  echo "   Cópia salva em: relatorios-AI/projeto-completo-$TIMESTAMP.md"
fi
