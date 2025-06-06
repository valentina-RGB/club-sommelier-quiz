import { Link } from "react-router-dom"
import { Button } from "@/common/atoms/Button"
import { User } from "lucide-react"

interface NavbarProps {
  currentPage?: 'landing' | 'contact' | 'login'
}

export function NavbarLandind({ currentPage = 'landing' }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-950/10 bg-[#1e120a] opacity-100 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-end">
        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              currentPage === 'landing' 
                ? 'text-emerald-600' 
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Inicio
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-medium transition-colors ${
              currentPage === 'contact' 
                ? 'text-emerald-600' 
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Contacto
          </Link>
          <Link to="/login">
            <Button size="sm" className="bg-gradient-to-r text-xs from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
              <User className="mr-2 h-4 w-4" /> Iniciar Sesión
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}