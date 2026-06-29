import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-moon-900 via-moon-800 to-moon-900" />
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url(/texture-veil.png)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-moon-700 border border-moon-500 mb-6 shadow-lg">
            <span className="text-4xl">🌙</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white">
            MoonRock
          </h1>
          <p className="text-moon-300 mt-3 text-lg sm:text-xl max-w-lg mx-auto">
            Sua jornada na saboaria artesanal — do básico ao cold process, com segurança e precisão
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/calculadora"
              className="bg-white text-moon-900 font-semibold px-6 py-3 rounded-xl hover:bg-moon-100 transition-colors shadow-lg"
            >
              🧮 Começar a Calcular
            </Link>
            <Link
              href="/roadmap"
              className="border border-moon-500 text-moon-200 font-semibold px-6 py-3 rounded-xl hover:bg-moon-700 transition-colors"
            >
              🗺️ Ver Roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Grid */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/calculadora"
            className="group bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 hover:border-moon-400 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="text-3xl mb-2">🧮</div>
            <h2 className="text-xl font-semibold text-white group-hover:text-moon-200">
              Calculadora
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Calcule soda cáustica, água e superfat para qualquer receita
            </p>
          </Link>

          <Link
            href="/receitas"
            className="group bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 hover:border-moon-400 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="text-3xl mb-2">📖</div>
            <h2 className="text-xl font-semibold text-white group-hover:text-moon-200">
              Receitas
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Catálogo de receitas testadas, do iniciante ao avançado
            </p>
          </Link>

          <Link
            href="/oleos"
            className="group bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 hover:border-moon-400 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="text-3xl mb-2">🫒</div>
            <h2 className="text-xl font-semibold text-white group-hover:text-moon-200">
              Óleos
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Biblioteca de 37 óleos com SAP values e propriedades
            </p>
          </Link>

          <Link
            href="/roadmap"
            className="group bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 hover:border-moon-400 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="text-3xl mb-2">🗺️</div>
            <h2 className="text-xl font-semibold text-white group-hover:text-moon-200">
              Roadmap
            </h2>
            <p className="text-moon-400 text-sm mt-1">
              Sua jornada de aprendizado, passo a passo
            </p>
          </Link>
        </div>

        {/* Safety Banner */}
        <div className="mt-8 bg-moon-700/50 border-l-4 border-moon-400 rounded-lg p-4 backdrop-blur">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-moon-100">Segurança em Primeiro Lugar</h3>
              <p className="text-moon-300 text-sm mt-1">
                Soda cáustica é perigosa. Sempre use EPIs completos e trabalhe em local ventilado.
                Nunca jogue água na soda — sempre soda na água.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-moon-700/50 backdrop-blur rounded-lg p-3 border border-moon-600">
            <div className="text-2xl font-bold text-moon-100">37</div>
            <div className="text-moon-400">Óleos na biblioteca</div>
          </div>
          <div className="bg-moon-700/50 backdrop-blur rounded-lg p-3 border border-moon-600">
            <div className="text-2xl font-bold text-moon-100">3</div>
            <div className="text-moon-400">Receitas guiadas</div>
          </div>
          <div className="bg-moon-700/50 backdrop-blur rounded-lg p-3 border border-moon-600">
            <div className="text-2xl font-bold text-moon-100">5</div>
            <div className="text-moon-400">Níveis de aprendizado</div>
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
