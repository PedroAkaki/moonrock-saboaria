"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export interface RecipeCalculatorPayload {
  source: "recipe";
  recipeId: string;
  recipeName: string;
  totalOilWeight: number;
  superfat: number;
  waterRatio: number;
  oils: { oilId: string; percentage: number }[];
}

interface Props {
  recipeId: string;
  recipeName: string;
  totalOilWeight: number;
  superfat: number;
  waterRatio: number;
  oils: { oilId: string; percentage: number }[];
}

export default function UseRecipeInCalculatorButton({
  recipeId,
  recipeName,
  totalOilWeight,
  superfat,
  waterRatio,
  oils,
}: Props) {
  const router = useRouter();

  const handleClick = () => {
    const payload: RecipeCalculatorPayload = {
      source: "recipe",
      recipeId,
      recipeName,
      totalOilWeight,
      superfat,
      waterRatio,
      oils,
    };
    localStorage.setItem("moonrock:recipe:calculator:v1", JSON.stringify(payload));
    router.push("/calculadora");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-amber-950 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors inline-flex items-center justify-center gap-2"
    >
      Usar esta receita na calculadora
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
