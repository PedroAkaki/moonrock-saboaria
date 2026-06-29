import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold tracking-tight">MoonRock Saboaria 🌙</h1>
          <p className="text-purple-200 mt-2 text-lg">
            Sua jornada na saboaria artesanal — do básico ao cold process
          </p>
        </div>
      </header>

      {/* Navigation Grid */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/calculadora"
            className="group bg-white rounded-xl shadow-sm border-2 border-purple-100 hover:border-purple-400 p-6 transition-all hover:shadow-md"
          >
            <div className="text-3xl mb-2">🧮</div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-purple-700">
              Calculadora
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Calcule soda cáustica, água e superfat para qualquer receita
            </p>
          </Link>

          <Link
            href="/receitas"
            className="group bg-white rounded-xl shadow-sm border-2 border-amber-100 hover:border-amber-400 p-6 transition-all hover:shadow-md"
          >
            <div className="text-3xl mb-2">📖</div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-amber-700">
              Receitas
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Catálogo de receitas testadas, do iniciante ao avançado
            </p>
          </Link>

          <Link
            href="/oleos"
            className="group bg-white rounded-xl shadow-sm border-2 border-green-100 hover:border-green-400 p-6 transition-all hover:shadow-md"
          >
            <div className="text-3xl mb-2">🫒</div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-green-700">
              Óleos
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Biblioteca de óleos com SAP values e propriedades
            </p>
          </Link>

          <Link
            href="/roadmap"
            className="group bg-white rounded-xl shadow-sm border-2 border-blue-100 hover:border-blue-400 p-6 transition-all hover:shadow-md"
          >
            <div className="text-3xl mb-2">🗺️</div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700">
              Roadmap
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Sua jornada de aprendizado, passo a passo
            </p>
          </Link>
        </div>

        {/* Safety Banner */}
        <div className="mt-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Segurança em Primeiro Lugar</h3>
              <p className="text-red-700 text-sm mt-1">
                Soda cáustica é perigosa. Sempre use EPIs completos (óculos, luvas de nitrila, 
                avental) e trabalhe em local ventilado. Nunca jogue água na soda — sempre soda na água.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-700">14</div>
            <div className="text-gray-500">Óleos na biblioteca</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-amber-700">3</div>
            <div className="text-gray-500">Receitas guiadas</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-700">5</div>
            <div className="text-gray-500">Níveis de aprendizado</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>MoonRock Saboaria — feito com ❤️ para Ana</p>
      </footer>
    </div>
  );
}
