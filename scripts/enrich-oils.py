#!/usr/bin/env python3
"""Enriquece oils.json com campos da Biblioteca de Óleos Avançada v1.

Regras:
- dosRisk: iodine > 100 ou stability baixa/muito-baixa → alto
           iodine 75-100 ou stability media → medio
           stability alta e iodine baixo → baixo
- formulaRole: derivada de hardness/cleansing/conditioning/bubbly + notes
- substitutionNotes: quando aplicável
- beginnerNote: dica curta para iniciantes
- recommendedUse: 1 linha de uso recomendado
"""

import json, re, os

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(PROJ, "data", "oils.json")

with open(JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

def derive_dos_risk(oil):
    iodine = oil.get("iodine", 0)
    stab = oil.get("stability", "media")
    if iodine > 100 or stab in ("baixa", "muito-baixa"):
        return "alto"
    if iodine > 75 or stab == "media":
        return "medio"
    return "baixo"

def derive_formula_role(oil):
    """Gera função prática baseada no perfil de propriedades."""
    parts = []
    h, cl, co, b, cr = oil["hardness"], oil["cleansing"], oil["conditioning"], oil["bubbly"], oil["creamy"]
    if h >= 4: parts.append("dá dureza à barra")
    elif h <= 1: parts.append("deixa o sabão macio")
    if cl >= 4: parts.append("aumenta o poder de limpeza")
    if co >= 4: parts.append("condiciona a pele")
    if b >= 4: parts.append("gera espuma abundante")
    elif b <= 1 and h <= 2: parts.append("espuma baixa")
    if cr >= 4: parts.append("dá cremosidade à espuma")
    if not parts:
        if oil["type"] in ("manteiga", "gordura-solida"):
            parts.append("contribui com corpo e textura")
        else:
            parts.append("complementa a fórmula")
    return ", ".join(parts) + "."

# Dicionário de substituições manuais para óleos conhecidos
SUBSTITUTIONS = {
    "azeite": "Girassol alto oleico, abacate ou canola (perfil oleico similar)",
    "coco": "Babacu, palmiste (palm kernel) — perfil láurico similar",
    "palma": "Sebo, banha, babacu ou murumuru (perfil palmítico/esteárico)",
    "karite": "Cacau ou cupuaçu (manteigas emolientes com perfil esteárico/oleico)",
    "cacau": "Karité ou cupuaçu",
    "mamona": "Não há substituto direto — único óleo com ácido ricinoleico",
    "soja": "Canola, girassol regular ou milho (perfil linoleico, mesmo cuidado com DOS)",
    "girassol-regular": "Soja ou milho — todos têm risco de DOS",
    "girassol-alto-oleico": "Azeite ou canola",
    "milho": "Soja ou girassol regular",
    "canola": "Girassol alto oleico ou azeite",
    "linhaca": "Não há substituto — usar no máximo 5% com antioxidantes",
    "gergelim": "Amêndoas doces ou abacate",
    "amendoas": "Gergelim ou abacate",
    "abacate": "Amêndoas doces ou azeite",
    "jojoba": "Não há substituto direto — usar como aditivo, não óleo base",
}

BEGINNER_NOTES = {
    "azeite": "Ótimo para começar. Cura mais longa (6-8 semanas).",
    "coco": "Essencial para espuma, mas resseca acima de 25%.",
    "palma": "Polêmica ambiental — preferir certificada RSPO.",
    "mamona": "Acelera o traço. Adicionar por último na receita.",
    "soja": "Barato, mas risco alto de DOS. Usar com antioxidante.",
    "linhaca": "Muito instável. Nunca usar acima de 5%.",
    "jojoba": "Não saponifica de fato (é cera). Usar como aditivo pós-traço.",
    "karite": "Emoliente excelente. Derreter antes de misturar.",
    "cacau": "Dá dureza. Não passar de 15% ou deixa o sabão quebradiço.",
}

RECOMMENDED_USES = {
    "azeite": "Base para sabonetes hidratantes e Castela",
    "coco": "Espuma e limpeza em sabonetes corporais",
    "palma": "Dureza e cremosidade em barras",
    "karite": "Peles sensíveis e receitas superhidratantes",
    "cacau": "Barras duras com toque de chocolate",
    "mamona": "Espuma cremosa e condicionamento",
}

for oil in data["oils"]:
    oil["dosRisk"] = derive_dos_risk(oil)
    oil["formulaRole"] = derive_formula_role(oil)
    oil["substitutionNotes"] = SUBSTITUTIONS.get(oil["id"], "Consultar biblioteca para alternativas")
    oil["beginnerNote"] = BEGINNER_NOTES.get(oil["id"], "")
    oil["recommendedUse"] = RECOMMENDED_USES.get(oil["id"], "Formulação geral em saboaria")

data["lastUpdated"] = "2026-07-01"

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ oils.json enriquecido — {len(data['oils'])} óleos atualizados")
