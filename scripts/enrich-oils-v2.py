#!/usr/bin/env python3
"""Adiciona confidenceLevel e substitutions[] ao oils.json.

Regras:
- confidenceLevel: "liberado" para a maioria dos óleos comuns
                   "alerta" para copaíba, pracaxi, patauá, andiroba (dados incertos)
                   "bloqueado" apenas se classificação explícita da Deep Research
- substitutions[]: array de strings com alternativas viáveis
"""

import json, os

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(PROJ, "data", "oils.json")

with open(JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Óleos que merecem "alerta" baseado na Deep Research
ALERTA_IDS = {
    "copaiba", "pracaxi", "pataua", "andiroba",
}

# Substituições em array
SUBST_ARRAY = {
    "azeite": ["Girassol alto oleico", "Abacate", "Canola"],
    "coco": ["Babacu", "Palmiste (palm kernel)"],
    "palma": ["Sebo", "Banha", "Babacu", "Murumuru"],
    "girassol-alto-oleico": ["Azeite", "Canola"],
    "karite": ["Cacau", "Cupuaçu"],
    "cacau": ["Karité", "Cupuaçu"],
    "mamona": [],
    "soja": ["Canola", "Girassol regular", "Milho"],
    "girassol-regular": ["Soja", "Milho"],
    "milho": ["Soja", "Girassol regular"],
    "canola": ["Girassol alto oleico", "Azeite"],
    "linhaca": [],
    "gergelim": ["Amêndoas doces", "Abacate"],
    "amendoas": ["Gergelim", "Abacate"],
    "abacate": ["Amêndoas doces", "Azeite"],
    "jojoba": [],
    "babassu": ["Coco", "Palmiste"],
    "buriti": [],
    "ucuuba": [],
    "andiroba": [],
    "copaiba": [],
    "pracaxi": [],
    "tucuma": ["Murumuru", "Cupuaçu"],
    "murumuru": ["Tucuma", "Cupuaçu"],
    "cupuacu": ["Karité", "Cacau"],
    "manga": ["Karité", "Cupuaçu"],
    "pataua": [],
    "sebo": ["Banha", "Palma"],
    "banha": ["Sebo", "Palma"],
    "dende": ["Palma (perfil similar)"],
    "argan": [],
    "rosa-mosqueta": [],
    "semente-uva": ["Girassol regular", "Soja"],
    "maracuja": [],
    "castanha-para": ["Cacau", "Karité"],
    "neem": [],
    "canhamo": ["Linhaça (perfil similar, mesma instabilidade)"],
    "pequi": [],
    "palmiste": ["Coco", "Babacu"],
}

for oil in data["oils"]:
    oil["confidenceLevel"] = "alerta" if oil["id"] in ALERTA_IDS else "liberado"
    oil["substitutions"] = SUBST_ARRAY.get(oil["id"], [])

data["lastUpdated"] = "2026-07-01"

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Stats
from collections import Counter
conf = Counter(o["confidenceLevel"] for o in data["oils"])
subs = sum(1 for o in data["oils"] if o.get("substitutions"))
print(f"✅ oils.json atualizado — {len(data['oils'])} óleos")
print(f"   confidenceLevel: {dict(conf)}")
print(f"   {subs} óleos com substitutions[]")
