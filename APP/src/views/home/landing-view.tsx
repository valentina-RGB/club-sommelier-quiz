import { Card} from "@/common/ui/card"
import { Calendar, Clock, AlertCircle, Loader2 } from "lucide-react"
import { NavbarLandind } from "@/common/molecules/nav/nav-landing.molecule"
import { Footer } from "@/common/molecules/footer.molecule"
import { useEventsByStatusQuery } from "@/api/query/events.queries"
import { Button } from "@/common/ui/button"
import imageSommelier from "@/assets/cubSommelierFont.png"


export default function LandingPage() {
  // Use the real API query instead of mock data
  const { data: events, isLoading, error, refetch } = useEventsByStatusQuery()



  const contacts = [
    {
      name: "Instagram",
      url: "https://instagram.com/ChefMartinOssa",
      icon: "data:image/svg+xml;utf8,<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='ig-gradient' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23f58529'/><stop offset='50%' stop-color='%23dd2a7b'/><stop offset='100%' stop-color='%23515bd4'/></linearGradient></defs><rect width='24' height='24' rx='6' fill='url(%23ig-gradient)'/><path d='M12 7.2A4.8 4.8 0 1 0 12 16.8A4.8 4.8 0 1 0 12 7.2Z' stroke='white' stroke-width='1.5'/><circle cx='17.2' cy='6.8' r='1' fill='white'/></svg>"
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/3128716875",
      icon: "https://cdn-icons-png.flaticon.com/512/124/124034.png"
    },
    // {
    //   name: "Email",
    //   url: "mailto:"
    // }
  ]

  return (
    <div className="max-h-[100vh] flex flex-col overflow-y-auto scrollbar-thumb bg-slate-50">
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
              <span className="text-sm font-medium tracking-wide text-emerald-300">Explorar Experiencias</span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight tracking-tight">
              <span className="text-white block">CLUB</span>
              <span className="text-amber-200 font-medium">SOMMELIER</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-10 text-slate-200 font-light leading-relaxed">
              Descubre nuestra exclusiva selección de eventos, talleres y experiencias únicas
              para los verdaderos conocedores de la alta cocina y los mejores cortes.
            </p>
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
              {
                contacts.map((contact) => (
                  <a
                    key={contact.name}
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  >
                    <img src={contact.icon} alt={contact.name} className="w-5 h-5 rounded-full" />
                    {contact.name}
                  </a>
                ))
              }
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
      <section id="events" className="py-16 bg-gradient-to-b from-[#d3b89d] via-[#f5e8d6] to-[#e0d6c9]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Próximos Eventos</h2>
            <p className="text-slate-600 max-w-full mx-auto">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3">
              {(events ?? []).map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-shadow bg-[#e2b591] border-none overflow-hidden md:min-w-[50vh] mx-auto transform hover:-translate-y-1"
                >
                  {/* Card inner with business card styling */}
                  <div className="p-4 pb-3 relative">
                    {/* Corner decoration elements */}
                    <div className="absolute top-0 right-0 text-black/30 text-[8px] rotate-90 tracking-widest">RSVP</div>
                    <div className="absolute bottom-0 left-0 text-black/30 text-[8px] -rotate-90 tracking-widest">RSVP</div>

                    {/* Event title with elegant typography */}
                    <div className="text-center mb-2.5">
                      <h4 className="text-black text-lg font-light italic leading-tight">
                        {event.name?.length > 18 ? `${event.name.substring(0, 18)}...` : event.name}
                      </h4>
                      <div className="w-8 h-0.5 bg-black/50 mx-auto my-1.5"></div>
                    </div>

                    {/* Event details with tight spacing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-black/70 mr-1.5" />
                        <span className="text-black/80 text-xs">
                          {new Date(event.start_time).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center justify-center">
                        <Clock className="h-3 w-3 text-black/70 mr-1.5" />
                        <span className="text-black/80 text-xs">
                          {new Date(event.start_time).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Event status with centered text */}
                    <div className="text-center mt-3 pt-2 border-t border-black/20">
                      <div className="text-[10px] tracking-wider uppercase text-black/70 font-medium">
                        {event.status === 'draft' ? 'Próximamente' : 'En proceso'}
                      </div>
                      <div className="text-[8px] tracking-wide text-black/60 mt-1">
                        DESDE {new Date().getFullYear()}
                      </div>
                    </div>

                    {/* Event type indicator with styling from business card */}
                    <div className="absolute top-0 left-0 text-[8px] tracking-widest text-black/30">
                      CLUB SOMMELIER
                    </div>
                  </div>
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