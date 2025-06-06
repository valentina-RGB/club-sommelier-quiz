import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/common/ui/card"
import { Calendar, Clock, AlertCircle, Loader2 } from "lucide-react"
import { NavbarLandind } from "@/common/molecules/nav/nav-landing.molecule"
import { Footer } from "@/common/molecules/footer.molecule"
import { useEventsByStatusQuery} from "@/api/query/events.queries"
import { Button } from "@/common/ui/button"
import imageSommelier from "@/assets/cubSommelierFont.png" 


export default function LandingPage() {
  // Use the real API query instead of mock data
  const { data: events, isLoading, error,refetch } = useEventsByStatusQuery()

 

  return (
    <div className="max-h-[100vh] flex flex-col overflow-y-auto bg-slate-50">
      {/* Navbar */}
      <NavbarLandind currentPage="landing" />

      {/* Hero Section - Improved with better styling */}
      <section className="relative min-h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${imageSommelier})`,
            backgroundPosition: "center 40%",
          }}
        ></div>
        <div className="container mx-auto px-8 relative z-20 h-full flex flex-col justify-center items-start text-white">
          <div className="max-w-3xl pt-10">
            <div className="inline-block mb-3 px-4 py-1 bg-emerald-600/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-medium tracking-wide text-emerald-300">EXPERIENCIA PREMIUM</span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight tracking-tight">
              <span className="text-white block">CLUB</span>
              <span className="text-amber-200 font-medium">SOMMELIER</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-10 text-slate-200 font-light leading-relaxed">
              Descubre nuestra exclusiva selección de eventos, talleres y experiencias únicas
              para los verdaderos conocedores de la alta cocina y los mejores cortes.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-6 py-2">
              Explorar Experiencias
            </Button>
          </div>
        </div>

        {/* Social links and status */}
        <div className="absolute bottom-16 left-0 right-0 z-20 py-6 px-8">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex gap-4 relative items-center text-center w-full">
              <span className="w-3 h-3 absolute top-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <p className="px-6 text-white/80 text-sm">Reservaciones abiertas</p>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Instagram</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Facebook</a>
              <a href="#" className="text-white/80  hover:text-white transition-colors text-sm">Twitter</a>
            </div>
          </div>
        </div>

        {/* Scroll indicator arrow */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <a
            href="#events"
            className="flex flex-col items-center text-white/80 hover:text-white transition-all hover:translate-y-1"
          >
            <span className="text-sm mb-2">Próximos Eventos</span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* Events Section - Enhanced with loading, error, and empty states */}
      <section id="events" className="py-16 min-h-[80vh] bg-gradient-to-b from-[#d3b89d] via-[#f5e8d6] to-[#fdf9f4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Próximos Eventos</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Descubre nuestros eventos en preparación
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-slate-600">Cargando eventos...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-slate-800 font-medium mb-2">Error al cargar los eventos</p>
              <p className="text-slate-600">Por favor, intenta de nuevo más tarde</p>
              <Button variant="outline" className="mt-4">
                Reintentar
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && events?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <Calendar className="h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-800 font-medium mb-2">No hay eventos próximos</p>
              <p className="text-slate-600">Estamos preparando nuevas experiencias culinarias</p>
              <Button variant="outline" className="mt-4">
                Suscríbete para notificaciones
              </Button>
            </div>
          )}

          {/* Events Grid */}

          {!isLoading && !error && (events?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(events ?? []).map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow bg-white border-slate-200 overflow-hidden">
                  {/* Using a default meat image since events don't have images */}

                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">{event.name}</CardTitle>
                    <CardDescription className="text-slate-600">{event.questionnaire?.description || 'Sin descripción'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-emerald-600" />
                        <span className="text-slate-700">
                          {new Date(event.start_time).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-emerald-600" />
                        <span className="text-slate-700">
                          {new Date(event.start_time).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} -
                          {new Date(event.end_time).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                          {event.status === 'draft' ? 'creado' : 'en proceso'}
                        </span>
                       
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}