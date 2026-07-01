import { Moon, Calculator, BookOpen, Droplets, Map, TriangleAlert, BookMarked, Milestone, ArrowRight, Play, Database } from "lucide-react";
import Link from "next/link";
import ResumeStudy from "@/components/ResumeStudy";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-moon-900/90 via-moon-800/80 to-moon-900" />
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/splash-crescent.png)" }}
        />
        <div className="absolute inset-0 hex-bg opacity-20" />

        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center w-full">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-moon-700/80 border border-moon-500 mb-6 shadow-lg backdrop-blur">
            <Moon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white">
            MoonRock
          </h1>
          <p className="text-moon-300 mt-4 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
            Sua jornada na saboaria artesanal — do básico ao cold process, com segurança e precisão
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/aprendizado"
              className="group inline-flex items-center justify-center gap-2 bg-white text-moon-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-moon-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              Começar Estudo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/roadmap"
              className="group inline-flex items-center justify-center gap-2 border border-moon-500 text-moon-200 font-semibold px-6 py-3.5 rounded-xl hover:bg-moon-700 transition-all hover:-translate-y-0.5"
            >
              <Map className="w-5 h-5" />
              Ver Mapa Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Resume Study Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        <ResumeStudy />
      </div>

      {/* Navigation Grid */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/calculadora"
            className="group relative bg-moon-700/40 backdrop-blur rounded-xl border border-moon-600 hover:border-white/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Calculator className="w-8 h-8 text-moon-200 mb-3" />
            <h2 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
              Calculadora
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Calcule soda cáustica, água e superfat para qualquer receita
            </p>
            <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-moon-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/receitas"
            className="group relative bg-moon-700/40 backdrop-blur rounded-xl border border-moon-600 hover:border-white/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <BookOpen className="w-8 h-8 text-moon-200 mb-3" />
            <h2 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
              Receitas
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Catálogo de receitas testadas, do iniciante ao avançado
            </p>
            <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-moon-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/oleos"
            className="group relative bg-moon-700/40 backdrop-blur rounded-xl border border-moon-600 hover:border-white/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Droplets className="w-8 h-8 text-moon-200 mb-3" />
            <h2 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
              Óleos
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Biblioteca de 39 óleos com SAP values e propriedades
            </p>
            <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-moon-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/aprendizado"
            className="group relative bg-moon-700/40 backdrop-blur rounded-xl border border-moon-600 hover:border-white/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Map className="w-8 h-8 text-moon-200 mb-3" />
            <h2 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
              Estudo
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Trilha completa de aprendizado, do básico ao avançado
            </p>
            <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-moon-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/diario"
            className="group relative bg-moon-700/40 backdrop-blur rounded-xl border border-moon-600 hover:border-white/30 p-6 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl mb-3 block">📓</span>
            <h2 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
              Diário de Lote
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Registre produções, cura, pH e observações
            </p>
            <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-moon-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Safety Banner */}
        <div className="mt-8 bg-moon-700/40 backdrop-blur border-l-4 border-moon-400 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <TriangleAlert className="w-6 h-6 text-moon-200 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-white">Segurança em Primeiro Lugar</h3>
              <p className="text-moon-300 text-sm mt-1 leading-relaxed">
                Soda cáustica é corrosiva. Use óculos, luvas nitrílicas, mangas compridas e
                local ventilado. Sempre adicione a soda lentamente à água, nunca água sobre a soda.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="group bg-moon-700/30 backdrop-blur rounded-xl p-4 border border-moon-600 hover:border-white/20 transition-all">
            <Database className="w-5 h-5 text-moon-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">39</div>
            <div className="text-moon-400 text-xs mt-0.5">Óleos na biblioteca</div>
          </div>
          <div className="group bg-moon-700/30 backdrop-blur rounded-xl p-4 border border-moon-600 hover:border-white/20 transition-all">
            <BookMarked className="w-5 h-5 text-moon-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-moon-400 text-xs mt-0.5">Receitas guiadas</div>
          </div>
          <div className="group bg-moon-700/30 backdrop-blur rounded-xl p-4 border border-moon-600 hover:border-white/20 transition-all">
            <Milestone className="w-5 h-5 text-moon-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-moon-400 text-xs mt-0.5">Níveis de estudo</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-moon-700 py-6 text-center text-sm text-moon-500">
        <p>MoonRock Saboaria — feito com ❤️ para Ana</p>
      </footer>
    </div>
  );
}
