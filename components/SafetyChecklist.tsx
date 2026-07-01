"use client";

import { useState } from "react";

interface SafetyChecklistProps {
  onAcknowledge: () => void;
  children: React.ReactNode;
}

const EPI_ITEMS = [
  { id: "oculos", label: "Óculos de proteção com vedação lateral" },
  { id: "luvas", label: "Luvas nitrílicas (não use luvas de látex)" },
  { id: "avental", label: "Avental ou roupa de mangas longas" },
  { id: "mascara", label: "Máscara PFF2 ou N95 (ao pesar a soda)" },
  { id: "calcados", label: "Calçados fechados" },
  { id: "ventilacao", label: "Ambiente ventilado (janelas abertas ou exaustor)" },
  { id: "ordem", label: "SEMPRE soda na água, NUNCA água na soda" },
  { id: "vinagre", label: "Vinagre apenas para superfícies (nunca pele ou olhos)" },
];

export default function SafetyChecklist({ onAcknowledge, children }: SafetyChecklistProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const allChecked = EPI_ITEMS.every((item) => checkedItems[item.id]);
  const someChecked = Object.keys(checkedItems).length > 0;

  if (acknowledged) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Blur overlay */}
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none">
          {children}
        </div>

        {/* Modal */}
        <div className="absolute inset-0 flex items-start justify-center pt-8 z-40">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-300 p-6 max-w-md w-full mx-4 space-y-4">
            <div className="text-center">
              <span className="text-4xl">⚠️</span>
              <h2 className="text-xl font-bold text-red-800 mt-2">Alerta de Segurança</h2>
              <p className="text-sm text-gray-600 mt-1">
                Antes de ver o resultado, confirme que leu e seguiu todas as regras de segurança abaixo.
                Soda cáustica queima a pele, os olhos e as vias respiratórias.
              </p>
            </div>

            <div className="space-y-2">
              {EPI_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    checkedItems[item.id]
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedItems[item.id]}
                    onChange={(e) =>
                      setCheckedItems((prev) => ({
                        ...prev,
                        [item.id]: e.target.checked,
                      }))
                    }
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className={`text-sm ${checkedItems[item.id] ? "text-green-800 line-through" : "text-gray-700"}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                if (allChecked) {
                  setAcknowledged(true);
                  onAcknowledge();
                }
              }}
              disabled={!allChecked}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all ${
                allChecked
                  ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {someChecked
                ? `${Object.keys(checkedItems).length}/${EPI_ITEMS.length} — Marque todos para continuar`
                : "Marque o checklist de segurança para continuar"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Este checklist é uma medida de segurança. A responsabilidade pela manipulação
              correta da soda cáustica é sua.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
