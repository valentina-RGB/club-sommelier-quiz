import { Link } from "react-router-dom"
import { Button } from "@/common/atoms/Button"

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-md flex items-center justify-center">
                <span className="font-bold text-white">F</span>
              </div>
              <span className="font-bold text-xl text-white">FoodEvents</span>
            </div>
            <p className="text-sm text-slate-400">
              Descubre los mejores eventos gastronómicos y experiencias culinarias en tu ciudad.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/landing" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>info@foodevents.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Calle Principal 123, Ciudad</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Suscríbete</h3>
            <p className="text-sm mb-4 text-slate-400">Recibe las últimas novedades sobre eventos y promociones.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu email"
                className="px-4 py-2 text-sm rounded-l-md w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Button className="rounded-l-none bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                Enviar
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-sm text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} FoodEvents. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}