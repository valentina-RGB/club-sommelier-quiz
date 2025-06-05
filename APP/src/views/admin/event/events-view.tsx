"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Settings, Menu, Calendar, Filter, X, Eye, QrCode, Clock, Link, Copy, Play } from "lucide-react"

import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { useEventsQuery, useEventByIDQuery } from "@/api/query/events.queries"

import { Badge } from "@/common/ui/badge"
import { Skeleton } from "@/common/ui/skeleton"
import { Card } from "@/common/ui/card"
import toast from "react-hot-toast"
import { QRCode } from "@/common/atoms/QRCode"

import { useNavigate } from "react-router-dom"
import EventFormModal from "@/common/widgets/admin/events/events-form.widget"
import AnimatedBackground from "@/common/atoms/animated-background"
import clubSomelier from "@/assets/clubSomelier.png"


export default function EventsView() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [IsCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)
  
  const navigate = useNavigate()
  // Fetch all events
  const { data: events = [], isLoading, isError } = useEventsQuery()

  // Fetch selected event details
  const {
    data: selectedEvent,
    isLoading: isLoadingDetails,
    isError: isErrorDetails
  } = useEventByIDQuery(selectedEventId)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filter events by name
  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [events, searchTerm])

  const clearFilters = () => {
    setSearchTerm("")
  }

  const hasActiveFilters = searchTerm

  const copyAccessCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("El código de acceso ha sido copiado al portapapeles")
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const redirect = (code: string) => {
    navigate(`/admin/control?accessCode=${code}`)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      {/* <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        className="object-cover absolute h-full w-full"
      /> */}
      <AnimatedBackground />
      
      

      {/* Main Content */}
      <main className="relative h-screen w-full pt-5 flex">
        {/* Sidebar */}
        <div
          className={`w-80 h-full bg-white/10 backdrop-blur-lg p-6 shadow-xl border-r border-white/20 rounded-tr-3xl opacity-100 ${isLoaded ? "animate-fade-in" : ""} flex flex-col`}
          style={{ animationDelay: "0.4s" }}
        >
          <div className="mb-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </h3>

            {/* Search Filter */}
            <div className="mb-4">
              <label className="block text-white/80 text-sm font-medium mb-2">Buscar eventos</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/20 text-gray-600 placeholder:text-gray-400 pl-10"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>

          <div className="space-y-5 overflow-y-auto">
            {/* Stats */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 mb-6">
              <h4 className="text-white font-medium mb-3">Estadísticas</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Total eventos:</span>
                  <span className="font-medium text-white">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Eventos filtrados:</span>
                  <span className="font-medium text-white">{filteredEvents.length}</span>
                </div>
                {selectedEvent && (
                  <div className="flex justify-between">
                    <span>Evento seleccionado:</span>
                    <span className="font-medium text-white">{selectedEvent.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <h4 className="text-white font-medium mb-3">Estados</h4>
              <div className="space-y-2 text-sm">
                {['active', 'pending', 'completed', 'cancelled'].map((status) => (
                  <div key={status} className="flex justify-between text-white/80">
                    <span className="capitalize">{status}</span>
                    <span>{events.filter(e => e.status?.toLowerCase() === status).length}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div
          className={`w-1/3 flex-1 flex flex-col opacity-100 ${isLoaded ? "animate-fade-in" : ""} border-r border-white/20`}
          style={{ animationDelay: "0.6s" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Calendar className="h-6 w-6 mr-3" />
                Eventos Disponibles
                {hasActiveFilters && (
                  <span className="ml-3 text-sm bg-blue-500 px-2 py-1 rounded-full">
                    {filteredEvents.length} resultados
                  </span>
                )}
              </h2>
            </div>

            {/* Events List */}
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {isLoading ? (
                // Loading skeletons
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-200">
                    <Skeleton className="h-6 w-3/4 bg-white/20 mb-2" />
                    <Skeleton className="h-4 w-1/4 bg-white/20 mb-3" />
                    <Skeleton className="h-4 w-full bg-white/20 mb-2" />
                    <Skeleton className="h-4 w-2/3 bg-white/20" />
                  </div>
                ))
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`bg-white/50 backdrop-blur-lg rounded-xl border cursor-pointer 
                      ${selectedEventId === event.id ? 'border-blue-400 bg-white/20' : 'border-white/20'} 
                      p-4 hover:bg-white/20 transition-all duration-200`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium text-lg">{event.name}</h3>
                      <Badge className={`${getStatusColor(event.status)} text-white`}>
                        {event.status || 'Sin estado'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-white/70 text-sm mb-3">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.start_time
                        ? (() => {
                          const date = new Date(event.start_time)
                          return (
                            <>
                              {date.toLocaleDateString()}&nbsp;
                              <span className="mx-1">|</span>
                              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </>
                          )
                        })()
                        : 'Hora no especificada'}
                    </div>
                    <div className="flex items-center text-white/70 text-sm mb-3">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.end_time
                        ? (() => {
                          const date = new Date(event.end_time)
                          return (
                            <>
                              {date.toLocaleDateString()}&nbsp;
                              <span className="mx-1">|</span>
                              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </>
                          )
                        })()
                        : 'Hora no especificada'}
                    </div>
                    <div className="flex mt-3 justify-between">
                      <Button
                        onClick={() => setIsCreateEventModalOpen(true)}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Editar
                      </Button>

                      <Button
                        onClick={() => redirect(event.access_code)}
                        size="sm"
                        variant="outline"
                        className="bg-green-400/50 hover:bg-green-400/70 border-white/20 text-white"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Iniciar Evento
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-white/30 mb-4" />
                  <p className="text-white/60 text-lg mb-2">
                    {hasActiveFilters ? "No se encontraron eventos" : "No hay eventos disponibles"}
                  </p>
                  <p className="text-white/40 text-sm mb-6 text-center px-4">
                    {hasActiveFilters
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Los eventos aparecerán aquí cuando estén disponibles"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div
          className={`w-1/3 flex flex-col opacity-100 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.8s" }}
        >
          <div className="p-6 h-full">
            {selectedEventId ? (
              isLoadingDetails ? (
                <div className="h-full flex flex-col gap-4">
                  <Skeleton className="h-8 w-3/4 bg-white/20" />
                  <Skeleton className="h-6 w-1/3 bg-white/20" />
                  <Skeleton className="h-40 w-40 mx-auto bg-white/20 my-4" />
                  <Skeleton className="h-6 w-full bg-white/20" />
                  <Skeleton className="h-6 w-full bg-white/20" />
                  <Skeleton className="h-6 w-2/3 bg-white/20" />
                </div>
              ) : isErrorDetails ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-6 text-center">
                    <h3 className="text-white text-lg font-medium mb-2">Error al cargar los detalles</h3>
                    <p className="text-white/80">
                      No se pudo cargar la información del evento. Intente nuevamente.
                    </p>
                    <Button
                      onClick={() => setSelectedEventId(null)}
                      className="mt-4 bg-white/10 hover:bg-white/20 text-white"
                    >
                      Volver a la lista
                    </Button>
                  </div>
                </div>
              ) : selectedEvent ? (
                <div className="h-full flex flex-col max-h-[85vh] overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-lg font-bold text-white">
                      {selectedEvent.name}
                    </h4>
                    <Badge className={`${getStatusColor(selectedEvent.status)} text-white px-3 py-1`}>
                      {selectedEvent.status || 'Sin estado'}
                    </Badge>
                  </div>


                  {/* QR Code */}
                  <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 mb-4 flex flex-col items-center">
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <QrCode className="h-5 w-5 mr-2" />
                      Código QR del Evento
                    </h3>
                    <p className="text-white/70 text-sm text-center mb-3">
                      Escanea el código QR para acceder al evento o comparte el enlace:
                    </p>
                    <div className="bg-white p-3 rounded-lg w-full mb-3">
                      <QRCode
                        width={500}
                        url={`/client?code=${selectedEvent.access_code}`}

                      />
                    </div>
                    <div className="flex items-center w-full bg-white/10 rounded-lg p-2 mb-2">
                      <Link className="h-4 w-4 text-white/70 mr-2" />
                      <input
                        type="text"
                        value={`${window.location.origin}/client?code=${selectedEvent.access_code}`}
                        className="bg-transparent text-white text-sm flex-1 outline-none"
                        readOnly
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => copyAccessCode(`${window.location.origin}/client?code=${selectedEvent.access_code}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center w-full">
                      <div className="flex items-center bg-white/10 rounded-lg p-2 flex-1">
                        <span className="text-white/70 text-sm mr-2">Código de acceso:</span>
                        <span className="text-white font-medium">{selectedEvent.access_code}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2 h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => copyAccessCode(selectedEvent.access_code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>

                  {/* Questionnaire Information */}
                  {selectedEvent.questionnaire && (
                    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 flex flex-col flex-1">
                      <h3 className="text-white font-medium mb-3">Cuestionario vinculado</h3>
                      <div className="bg-white/10 rounded-lg p-3 mb-2">
                        <h4 className="text-white font-medium">{selectedEvent.questionnaire.title}</h4>
                        <p className="text-white/70 text-sm mt-1">
                          {selectedEvent.questionnaire.description}
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <p className="text-white/60">No se encontró información del evento</p>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <Calendar className="h-16 w-16 text-white/30 mb-4" />
                <h3 className="text-white text-xl font-medium mb-2">Selecciona un evento</h3>
                <p className="text-white/60 text-center">
                  Haz clic en un evento de la lista para ver sus detalles y código QR
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <EventFormModal
        isOpen={IsCreateEventModalOpen}
        onClose={() => {
          setIsCreateEventModalOpen(false)
        }}
        initialData={selectedEvent}
        isEditing={true}
        selectedCuestion={selectedEvent?.questionnaire}
      />
    </div>
  )
}