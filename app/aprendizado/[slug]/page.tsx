import { notFound } from "next/navigation";
import Link from "next/link";
import learningModules from "@/data/learning-modules.json";
import { ArrowLeft } from "lucide-react";
import LevelProgress from "@/components/LevelProgress";
import StudyCard from "@/components/StudyCard";
import QuickReviewBox from "@/components/QuickReviewBox";
import ModuleQuiz from "@/components/ModuleQuiz";
import BeforePracticeChecklist from "@/components/BeforePracticeChecklist";
import ModuleTracker from "@/components/ModuleTracker";
import RelatedRecipes from "@/components/RelatedRecipes";
import ModuleOrbitMap from "@/components/ModuleOrbitMap";

interface Module {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
  summary: string;
  objective?: string;
  scope_warning?: string;
  prerequisites?: string[];
  chemical_fundamentals?: string[];
  materials?: string[];
  equipment?: string[];
  safety?: string[];
  process?: string[];
  critical_parameters?: string[];
  visual_criteria?: string[];
  common_errors?: string[];
  troubleshooting?: string;
  practical_exercise?: string;
  conclusion_criteria?: string[];
  related_glossary?: string[];
  references?: string[];
  studyCards?: { title: string; definition: string; whyItMatters: string; commonMistake: string; practicalSignal: string }[];
  quickReview?: string[];
  quiz?: { id: string; type: string; question: string; options?: string[]; correctAnswer: string | boolean; explanation: string }[];
  beforePracticeChecklist?: string[];
  trace_diagnosis?: Record<string, string>;
}

const TRACE_LABELS: Record<string, { label: string; color: string }> = {
  trace_leve: { label: "Trace Leve", color: "border-green-600 bg-green-900/15" },
  trace_medio: { label: "Trace Médio", color: "border-amber-600 bg-amber-900/15" },
  trace_pesado: { label: "Trace Pesado", color: "border-orange-600 bg-orange-900/15" },
  falso_trace: { label: "Falso Trace", color: "border-red-600 bg-red-900/15" },
};

const NAV_ITEMS = [
  { id: "entender", label: "Entender" },
  { id: "seguranca", label: "Segurança" },
  { id: "processo", label: "Processo" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "revisao", label: "Revisão" },
  { id: "pratica", label: "Prática" },
];

export async function generateStaticParams() {
  const modules = learningModules as Module[];
  return modules.map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const modules = learningModules as Module[];
  const mod = modules.find((m) => m.slug === slug);

  if (!mod || mod.status !== "available") {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ModuleTracker slug={mod.slug} />
      <Link href="/aprendizado" className="inline-flex items-center gap-1.5 text-sm text-moon-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Trilha
      </Link>

      {/* Header */}
      <header className="mb-8 border-b border-moon-700 pb-6">
        <div className="flex items-center gap-2 text-xs text-moon-500 font-mono mb-2">
          <span>NÍVEL {mod.level}</span><span>•</span><span>MÓDULO TÉCNICO</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{mod.title}</h1>
        <p className="text-moon-400 leading-relaxed">{mod.summary}</p>
      </header>

      <ModuleOrbitMap slug={mod.slug} module={mod} />
      <div id="conteudo-modulo" />

      {/* Internal navigation */}
      <nav className="mb-8 flex flex-wrap gap-2 border-b border-moon-700 pb-4">
        {NAV_ITEMS.map((item) => (
          <a key={item.id} href={`#${item.id}`}
            className="text-xs px-3 py-1.5 rounded-full bg-moon-800 text-moon-300 hover:bg-moon-700 hover:text-white transition-colors border border-moon-600">
            {item.label}
          </a>
        ))}
      </nav>

      {/* Scope warning */}
      {mod.scope_warning && (
        <div className="mb-8 p-4 border-l-2 border-amber-500 bg-amber-900/20 rounded-r-xl">
          <h3 className="font-bold text-amber-400 text-sm mb-1">⚠️ AVISO DE ESCOPO</h3>
          <p className="text-sm text-amber-200/80">{mod.scope_warning}</p>
        </div>
      )}

      {/* ── ENTENDER ── */}
      <section id="entender" className="mb-8 space-y-8">
        {mod.objective && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">🎯 Objetivo</h2>
            <p className="text-moon-300 text-sm leading-relaxed">{mod.objective}</p>
            {mod.prerequisites && mod.prerequisites.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {mod.prerequisites.map((pre, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-moon-700 text-moon-400 rounded-full border border-moon-600">{pre}</span>
                ))}
              </div>
            )}
          </section>
        )}

        {mod.chemical_fundamentals && mod.chemical_fundamentals.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-white rounded-full" /> Fundamentos Químicos
            </h2>
            <div className="space-y-3">
              {mod.chemical_fundamentals.map((f, i) => (
                <p key={i} className="text-sm text-moon-300 pl-4 border-l border-moon-600 leading-relaxed">{f}</p>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* ── SEGURANÇA ── */}
      <section id="seguranca" className="mb-8 space-y-8">
        {mod.safety && mod.safety.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-500 rounded-full" /> Segurança Específica
            </h2>
            <div className="space-y-2">
              {mod.safety.map((s, i) => (
                <p key={i} className="text-sm text-red-200/80 bg-red-900/20 p-3 rounded-lg border border-red-800/50">⚠️ {s}</p>
              ))}
            </div>
          </section>
        )}

        {/* Materials + Equipment grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {mod.materials && mod.materials.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-moon-200 mb-2 uppercase tracking-wider">🧪 Matérias-Primas</h3>
              <ul className="space-y-1">
                {mod.materials.map((m, i) => (
                  <li key={i} className="text-sm text-moon-400 flex items-center gap-2">
                    <span className="w-1 h-1 bg-moon-500 rounded-full shrink-0" /> {m}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {mod.equipment && mod.equipment.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-moon-200 mb-2 uppercase tracking-wider">🛠️ Equipamentos</h3>
              <ul className="space-y-1">
                {mod.equipment.map((e, i) => (
                  <li key={i} className="text-sm text-moon-400 flex items-center gap-2">
                    <span className="w-1 h-1 bg-moon-500 rounded-full shrink-0" /> {e}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>

      {/* ── PROCESSO ── */}
      <section id="processo" className="mb-8 space-y-8">
        {mod.process && mod.process.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-green-500 rounded-full" /> Processo Operacional
            </h2>
            <ol className="space-y-4">
              {mod.process.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-7 h-7 bg-moon-700 text-moon-300 text-xs rounded-full flex items-center justify-center font-mono border border-moon-500">{i + 1}</span>
                  <p className="text-sm text-moon-300 pt-0.5 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {(mod.critical_parameters?.length ?? 0) > 0 || (mod.visual_criteria?.length ?? 0) > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {mod.critical_parameters && mod.critical_parameters.length > 0 && (
              <section className="p-4 bg-moon-700/30 rounded-xl border border-moon-600">
                <h3 className="text-sm font-semibold text-moon-200 mb-2 uppercase tracking-wider">📏 Parâmetros Críticos</h3>
                <ul className="space-y-1">
                  {mod.critical_parameters.map((p, i) => (<li key={i} className="text-sm text-moon-400">• {p}</li>))}
                </ul>
              </section>
            )}
            {mod.visual_criteria && mod.visual_criteria.length > 0 && (
              <section className="p-4 bg-moon-700/30 rounded-xl border border-moon-600">
                <h3 className="text-sm font-semibold text-moon-200 mb-2 uppercase tracking-wider">👁️ Critérios Visuais</h3>
                <ul className="space-y-1">
                  {mod.visual_criteria.map((v, i) => (<li key={i} className="text-sm text-moon-400">• {v}</li>))}
                </ul>
              </section>
            )}
          </div>
        ) : null}
      </section>

      {/* ── DIAGNÓSTICO ── */}
      <section id="diagnostico" className="mb-8 space-y-8">
        {(mod.common_errors?.length ?? 0) > 0 || mod.troubleshooting ? (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">🔍 Diagnóstico de Problemas</h2>
            <div className="bg-moon-700/30 border border-moon-600 rounded-xl p-4">
              {mod.common_errors && mod.common_errors.length > 0 && (
                <>
                  <h4 className="text-sm font-bold text-moon-200 mb-2 uppercase tracking-wider">Erros Comuns</h4>
                  <ul className="space-y-1 mb-4">{mod.common_errors.map((e, i) => (<li key={i} className="text-sm text-moon-400">• {e}</li>))}</ul>
                </>
              )}
              {mod.troubleshooting && (
                <>
                  <h4 className="text-sm font-bold text-moon-200 mb-2 uppercase tracking-wider">Como Resolver</h4>
                  <p className="text-sm text-moon-300">{mod.troubleshooting}</p>
                </>
              )}
            </div>
          </section>
        ) : null}

        {/* Trace Diagnosis */}
        {mod.trace_diagnosis && Object.keys(mod.trace_diagnosis).length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">🔬 Diagnóstico Visual do Trace</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(mod.trace_diagnosis).map(([key, desc]) => {
                const info = TRACE_LABELS[key] ?? { label: key, color: "border-moon-600 bg-moon-800/50" };
                return (
                  <div key={key} className={`rounded-xl border ${info.color} p-3`}>
                    <p className="text-xs font-bold text-white mb-1">{info.label}</p>
                    <p className="text-xs text-moon-300 leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </section>

      {/* ── REVISÃO ── */}
      <section id="revisao" className="mb-8 space-y-8">
        {mod.studyCards && mod.studyCards.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-white rounded-full" /> Conceitos Deste Módulo
            </h2>
            <div className="grid gap-4">{mod.studyCards.map((card, i) => (<StudyCard key={i} {...card} />))}</div>
          </section>
        )}

        {mod.quickReview && mod.quickReview.length > 0 && (
          <section><QuickReviewBox points={mod.quickReview} /></section>
        )}

        {mod.quiz && mod.quiz.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-white rounded-full" /> Perguntas de Fixação
            </h2>
            <ModuleQuiz slug={mod.slug} questions={mod.quiz} />
          </section>
        )}
      </section>

      {/* ── PRÁTICA ── */}
      <section id="pratica" className="mb-8 space-y-8">
        <RelatedRecipes moduleSlug={mod.slug} />

        {mod.beforePracticeChecklist && mod.beforePracticeChecklist.length > 0 && (
          <BeforePracticeChecklist items={mod.beforePracticeChecklist} slug={mod.slug} />
        )}

        {mod.practical_exercise && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">🏋️ Exercício Prático</h2>
            <p className="text-sm text-moon-300 italic leading-relaxed">{mod.practical_exercise}</p>
          </section>
        )}

        {mod.conclusion_criteria && mod.conclusion_criteria.length > 0 && (
          <LevelProgress slug={mod.slug} checklist={mod.conclusion_criteria} />
        )}
      </section>

      {/* Footer */}
      <footer className="mt-10 pt-6 border-t border-moon-700 text-xs text-moon-500 space-y-1.5">
        {mod.related_glossary && mod.related_glossary.length > 0 && (
          <p><span className="text-moon-400 font-medium">Termos do glossário:</span> {mod.related_glossary.join(", ")}</p>
        )}
        {mod.references && mod.references.length > 0 && (
          <p><span className="text-moon-400 font-medium">Referências:</span> {mod.references.join(", ")}</p>
        )}
      </footer>
    </div>
  );
}
