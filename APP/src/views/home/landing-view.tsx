
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/common/ui/card"
import { Calendar, Clock, MapPin} from "lucide-react"
import { NavbarLandind } from "@/common/molecules/nav/nav-landing.molecule"
import { Footer } from "@/common/molecules/footer.molecule"

// Simulación de eventos desde API con estado draft
const eventsFromAPI = [
  {
    id: 1,
    title: "Festival de Carnes Premium",
    description: "Degustación de los mejores cortes de carne preparados por chefs expertos",
    date: "15 de Junio, 2025",
    time: "18:00 - 22:00",
    location: "Centro Gastronómico",
    status: "draft",
  },
  {
    id: 2,
    title: "Taller de Parrilla Argentina",
    description: "Aprende técnicas de asado argentino con los mejores parrilleros",
    date: "22 de Junio, 2025",
    time: "16:00 - 20:00",
    location: "Parque Central",
    status: "draft",
  },
  {
    id: 3,
    title: "Maridaje de Vinos y Carnes",
    description: "Descubre las mejores combinaciones de vinos con diferentes cortes de carne",
    date: "29 de Junio, 2025",
    time: "19:00 - 23:00",
    location: "Vinoteca La Cepa",
    status: "draft",
  },
  {
    id: 4,
    title: "Cena Degustación Gourmet",
    description: "Una experiencia culinaria única con menú de 7 tiempos",
    date: "5 de Julio, 2025",
    time: "20:00 - 23:30",
    location: "Restaurante El Jardín",
    status: "draft",
  },
]

export default function LandingPage() {
  // Filtrar solo eventos con estado draft
  const draftEvents = eventsFromAPI.filter((event) => event.status === "draft")

  return (
    <div className="max-h-[100vh] flex flex-col overflow-y-auto bg-slate-50">
      {/* Navbar Simplificado */}
      
      <NavbarLandind currentPage="landing" />

      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 to-green-900/20 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
            backgroundPosition: "center 40%",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-20 h-[60vh] flex flex-col justify-center items-start text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Descubre los mejores <span className="text-emerald-400">eventos culinarios</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Explora nuestra selección de eventos gastronómicos, talleres y experiencias únicas para los amantes de la
            buena comida.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Próximos Eventos</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Descubre nuestros eventos gastronómicos en preparación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {draftEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">{event.title}</CardTitle>
                  <CardDescription className="text-slate-600">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-emerald-600" />
                      <span className="text-slate-700">{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-emerald-600" />
                      <span className="text-slate-700">{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-emerald-600" />
                      <span className="text-slate-700">{event.location}</span>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                        En preparación
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}