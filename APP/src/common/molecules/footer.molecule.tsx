

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#44270c] via-[#4e3424] to-[#1e120a] text-slate-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-md flex items-center justify-center">
                <span className="font-bold text-white">C</span>
              </div>
              <span className="font-bold text-xl text-white">lub Sommelier</span>
            </div>
            <p className="text-sm text-slate-300">
              Descubre los mejores eventos gastronómicos y experiencias culinarias en tu ciudad.
            </p>
          </div>

      
          <div>
            <h3 className="font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>info@foodevents.com</li>
              <li>+57 312 871 68 75</li>
              <li>Por definir</li>
            </ul>
          </div>

         
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-sm text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Club Sommelier. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}