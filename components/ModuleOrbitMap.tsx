"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Circle,
  FlaskConical,
  ShieldCheck,
  Thermometer,
  Droplets,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  Beaker,
  Clock,
  Flame,
} from "lucide-react";
import { getProgress } from "@/lib/progress";

type OrbitStatus = "completed" | "in-progress" | "not-started";

type OrbitSubNode = {
  id: string;
  label: string;
};

type OrbitNode = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  status: OrbitStatus;
  children?: OrbitSubNode[];
};

type ModuleOrbitMapProps = {
  slug: string;
  module: {
    quiz?: unknown[];
    beforePracticeChecklist?: string[];
    conclusion_criteria?: string[];
  };
};

const MODULE_NODE_LABELS: Record<string, Omit<OrbitNode, "status">[]> = {
  "base-glicerinada": [
    { id: "seguranca", label: "Segurança", icon: <ShieldCheck className="h-5 w-5" />, description: "Cuidados com calor, utensílios e essências.", children: [{ id: "b-calor", label: "Calor" }, { id: "b-utensilios", label: "Utensílios" }, { id: "b-essencias", label: "Essências" }] },
    { id: "temperatura", label: "Temperatura", icon: <Thermometer className="h-5 w-5" />, description: "Controle de fusão sem superaquecer a base.", children: [{ id: "b-50c", label: "50°C" }, { id: "b-70c", label: "70°C" }, { id: "b-nao-ferver", label: "Não ferver" }] },
    { id: "higroscopia", label: "Higroscopia", icon: <Droplets className="h-5 w-5" />, description: "Entender o suor da glicerina e armazenamento.", children: [{ id: "b-umidade", label: "Umidade" }, { id: "b-suor", label: "Suor" }, { id: "b-pvc", label: "Filme PVC" }] },
    { id: "bolhas", label: "Bolhas", icon: <Circle className="h-5 w-5" />, description: "Acabamento com álcool e despejo cuidadoso.", children: [{ id: "b-alcool", label: "Álcool" }, { id: "b-mexer", label: "Mexer pouco" }, { id: "b-despejo", label: "Despejo" }] },
    { id: "aditivos", label: "Aditivos", icon: <FlaskConical className="h-5 w-5" />, description: "Corantes, fragrâncias e limites de uso.", children: [{ id: "b-corante", label: "Corante" }, { id: "b-fragrancia", label: "Fragrância" }, { id: "b-limite", label: "Limite líquido" }] },
    { id: "receita", label: "Receita", icon: <BookOpen className="h-5 w-5" />, description: "Aplicar o módulo em uma receita simples.", children: [{ id: "b-pesar", label: "Pesar" }, { id: "b-derreter", label: "Derreter" }, { id: "b-moldar", label: "Moldar" }] },
    { id: "quiz", label: "Quiz", icon: <HelpCircle className="h-5 w-5" />, description: "Fixar conceitos antes da prática.", children: [{ id: "b-q1", label: "Pergunta 1" }, { id: "b-q2", label: "Pergunta 2" }, { id: "b-q3", label: "Pergunta 3" }] },
    { id: "checklist", label: "Checklist", icon: <ClipboardCheck className="h-5 w-5" />, description: "Confirmar critérios antes de avançar.", children: [{ id: "b-c1", label: "Item 1" }, { id: "b-c2", label: "Item 2" }, { id: "b-c3", label: "Item 3" }] },
  ],
  "sabao-de-oleo-usado": [
    { id: "seguranca", label: "Segurança", icon: <ShieldCheck className="h-5 w-5" />, description: "EPI completo e cuidado com soda cáustica." },
    { id: "filtragem", label: "Filtragem", icon: <Droplets className="h-5 w-5" />, description: "Remover resíduos sólidos do óleo usado." },
    { id: "sap-incerto", label: "SAP Incerto", icon: <Beaker className="h-5 w-5" />, description: "Óleo degradado tem cálculo menos previsível." },
    { id: "superfat", label: "Superfat", icon: <FlaskConical className="h-5 w-5" />, description: "Margem contra excesso alcalino e variação da matéria-prima." },
    { id: "limpeza", label: "Limpeza", icon: <ShieldCheck className="h-5 w-5" />, description: "Produto doméstico, não cosmético." },
    { id: "nao-corpo", label: "Não usar no corpo", icon: <ShieldCheck className="h-5 w-5" />, description: "Separar sabão de limpeza de sabonete corporal." },
    { id: "receita", label: "Receita", icon: <BookOpen className="h-5 w-5" />, description: "Executar receita de sabão de óleo usado." },
    { id: "quiz", label: "Quiz", icon: <HelpCircle className="h-5 w-5" />, description: "Validar entendimento de segurança e SAP." },
    { id: "checklist", label: "Checklist", icon: <ClipboardCheck className="h-5 w-5" />, description: "Confirmar critérios de conclusão." },
  ],
  "cold-process-basico": [
    { id: "seguranca", label: "Segurança", icon: <ShieldCheck className="h-5 w-5" />, description: "EPI, ventilação e ordem correta da soda." },
    { id: "naoh-agua", label: "NaOH + Água", icon: <Beaker className="h-5 w-5" />, description: "Sempre soda na água, nunca o contrário." },
    { id: "sap", label: "SAP", icon: <FlaskConical className="h-5 w-5" />, description: "Valor usado para calcular a soda." },
    { id: "superfat", label: "Superfat", icon: <Droplets className="h-5 w-5" />, description: "Óleo não saponificado planejado." },
    { id: "trace", label: "Trace", icon: <Circle className="h-5 w-5" />, description: "Ponto em que a emulsão deixa rastro." },
    { id: "temperatura", label: "Temperatura", icon: <Thermometer className="h-5 w-5" />, description: "Controle térmico dos óleos e da lixívia." },
    { id: "gel-phase", label: "Gel Phase", icon: <Flame className="h-5 w-5" />, description: "Fase quente/translúcida da saponificação." },
    { id: "cura", label: "Cura", icon: <Clock className="h-5 w-5" />, description: "Tempo de secagem e maturação da barra." },
    { id: "receita", label: "Receita", icon: <BookOpen className="h-5 w-5" />, description: "Aplicar na receita CP Azeite & Coco." },
    { id: "quiz", label: "Quiz", icon: <HelpCircle className="h-5 w-5" />, description: "Fixar os fundamentos do Cold Process." },
    { id: "checklist", label: "Checklist", icon: <ClipboardCheck className="h-5 w-5" />, description: "Critérios para concluir o módulo." },
  ],
};

const FALLBACK_NODES: Omit<OrbitNode, "status">[] = [
  { id: "fundamentos", label: "Fundamentos", icon: <FlaskConical className="h-5 w-5" />, description: "Conceitos principais do módulo." },
  { id: "seguranca", label: "Segurança", icon: <ShieldCheck className="h-5 w-5" />, description: "Cuidados necessários antes da prática." },
  { id: "processo", label: "Processo", icon: <Beaker className="h-5 w-5" />, description: "Sequência operacional do módulo." },
  { id: "pratica", label: "Prática", icon: <BookOpen className="h-5 w-5" />, description: "Aplicação prática do conhecimento." },
  { id: "quiz", label: "Quiz", icon: <HelpCircle className="h-5 w-5" />, description: "Perguntas de fixação." },
  { id: "checklist", label: "Checklist", icon: <ClipboardCheck className="h-5 w-5" />, description: "Critérios de conclusão." },
];

function hasAnyRecordValue(record?: Record<string, unknown>) {
  return record ? Object.values(record).some(Boolean) : false;
}

function isRecordComplete(record: Record<string, unknown> | undefined, expectedCount = 1) {
  if (!record) return false;
  return Object.values(record).filter(Boolean).length >= expectedCount;
}

function getNodeStatus(
  nodeId: string,
  slug: string,
  module: ModuleOrbitMapProps["module"],
  progress: ReturnType<typeof getProgress>
): OrbitStatus {
  const mp = progress.modules[slug];
  if (mp?.status === "completed") return "completed";
  if (!mp) return "not-started";

  const quizCount = module.quiz?.length ?? 0;
  const beforeCount = module.beforePracticeChecklist?.length ?? 0;
  const checklistCount = module.conclusion_criteria?.length ?? 0;

  if (nodeId === "quiz") {
    if (quizCount === 0) return "not-started";
    if (isRecordComplete(mp.quizAnswers, quizCount)) return "completed";
    if (hasAnyRecordValue(mp.quizAnswers)) return "in-progress";
    return "not-started";
  }

  if (nodeId === "checklist") {
    if (checklistCount === 0) return "not-started";
    if (isRecordComplete(mp.checklist, checklistCount)) return "completed";
    if (hasAnyRecordValue(mp.checklist)) return "in-progress";
    return "not-started";
  }

  if (nodeId === "seguranca") {
    if (beforeCount === 0) return mp.status === "in-progress" ? "in-progress" : "not-started";
    if (isRecordComplete(mp.beforePractice, beforeCount)) return "completed";
    if (hasAnyRecordValue(mp.beforePractice)) return "in-progress";
    return mp.status === "in-progress" ? "in-progress" : "not-started";
  }

  return mp.status === "in-progress" ? "in-progress" : "not-started";
}

function getStatusClass(status: OrbitStatus, small = false) {
  if (status === "completed")
    return small ? "bg-green-400 border-green-400" : "border-green-400/60 bg-green-500/30 text-green-100 shadow-[0_0_24px_rgba(34,197,94,0.30)]";
  if (status === "in-progress")
    return small ? "bg-purple-400 border-purple-400" : "border-purple-400/70 bg-purple-500/30 text-purple-100 shadow-[0_0_24px_rgba(168,85,247,0.30)]";
  return small ? "border-moon-400/50 bg-transparent" : "border-moon-400/50 bg-moon-900/70 text-moon-200";
}

export default function ModuleOrbitMap({ slug, module }: ModuleOrbitMapProps) {
  const [progress, setProgress] = useState(() => getProgress());
  const [activeNode, setActiveNode] = useState<OrbitNode | null>(null);

  useEffect(() => {
    const update = () => setProgress(getProgress());
    update();
    window.addEventListener("moonrock-progress-updated", update);
    return () => window.removeEventListener("moonrock-progress-updated", update);
  }, []);

  const nodes = useMemo<OrbitNode[]>(() => {
    const baseNodes = MODULE_NODE_LABELS[slug] ?? FALLBACK_NODES;
    return baseNodes.map((node) => ({ ...node, status: getNodeStatus(node.id, slug, module, progress) }));
  }, [slug, module, progress]);

  const completedCount = nodes.filter((n) => n.status === "completed").length;
  const progressPercent = nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;

  return (
    <section className="mb-8 rounded-2xl border border-moon-600 bg-moon-900/70 overflow-hidden shadow-2xl shadow-black/20">
      {/* Mini label */}
      <div className="px-4 pt-3 pb-1 text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-amber-400/70">Órbita de aprendizado</p>
      </div>

      {/* Orbit area */}
      <div className="relative mx-auto h-[390px] max-w-[430px] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,149,48,0.14),transparent_34%),radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

        <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-moon-500/30" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-moon-500/25" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-moon-500/20" />

        {/* Central planet */}
        <div className="absolute left-1/2 top-1/2 z-10 flex aspect-square w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-amber-300/60 bg-moon-800 text-center shadow-[0_0_44px_rgba(191,149,48,0.35)]">
          <FlaskConical className="mb-1 h-5 w-5 text-amber-200" />
          <span className="text-[10px] text-moon-400">Módulo Principal</span>
        </div>

        {/* Orbiting nodes */}
        {nodes.map((node, index) => {
          const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 145;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveNode(activeNode?.id === node.id ? null : node)}
              className={`absolute left-1/2 top-1/2 z-20 flex aspect-square w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border text-center transition-transform hover:scale-105 sm:w-20 ${getStatusClass(node.status)}`}
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <span className="mb-0.5">{node.status === "completed" ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : node.icon}</span>
              <span className="max-w-[4.5rem] text-[9px] font-medium leading-tight sm:text-[10px]">{node.label}</span>

              {/* Mini checkpoint dots */}
              {node.children && node.children.length > 0 && (
                <div className="absolute -bottom-2.5 flex gap-[2px]">
                  {node.children.slice(0, 3).map((child, ci) => {
                    const childAngle = ((ci + 1) / (node.children!.length + 1)) * Math.PI * 2;
                    const childR = 16;
                    const childX = Math.cos(childAngle) * childR;
                    const childY = Math.sin(childAngle) * childR;
                    return (
                      <span
                        key={child.id}
                        className={`block h-1.5 w-1.5 rounded-full border ${getStatusClass(node.status === "completed" ? "completed" : node.status === "in-progress" && ci === 0 ? "in-progress" : "not-started", true)}`}
                      />
                    );
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom panel */}
      <div className="border-t border-moon-700 bg-moon-800/60 p-4">
        {/* Active node detail */}
        {activeNode && (
          <div className="mb-4 rounded-xl border border-moon-600 bg-moon-900/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{activeNode.label}</p>
              <span className="text-xs text-moon-400">
                {activeNode.status === "completed" ? "Concluído" : activeNode.status === "in-progress" ? "Em andamento" : "Não feito"}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-moon-400">{activeNode.description}</p>

            {/* Checkpoints */}
            {activeNode.children && activeNode.children.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-moon-500 uppercase tracking-wider">Checkpoints</p>
                {activeNode.children.map((child) => {
                  const childStatus: OrbitStatus = activeNode.status === "completed" ? "completed" : activeNode.status === "in-progress" && child.id.endsWith("1") ? "completed" : activeNode.status === "in-progress" && child.id.endsWith("2") ? "in-progress" : "not-started";
                  return (
                    <div key={child.id} className="flex items-center gap-2 text-xs text-moon-300">
                      <span className={`block h-2 w-2 shrink-0 rounded-full ${getStatusClass(childStatus, true)}`} />
                      {child.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-moon-300">Progresso do módulo</p>
            <div className="mt-2 h-2 rounded-full bg-moon-700">
              <div className="h-2 rounded-full bg-amber-300 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-moon-500">
              <span className="text-green-400">{completedCount}</span> de {nodes.length} submódulos concluídos.
            </p>
          </div>
          <div className="text-4xl font-bold text-white">{progressPercent}%</div>
        </div>

        {/* Continue button */}
        <a href="#conteudo-modulo" className="mt-4 flex w-full items-center justify-center rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-moon-900 transition-colors hover:bg-amber-200">
          Continuar Estudo
        </a>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-moon-400">
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-500" /> Concluído</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-purple-500" /> Em andamento</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-moon-300" /> Não feito</span>
        </div>
      </div>
    </section>
  );
}
