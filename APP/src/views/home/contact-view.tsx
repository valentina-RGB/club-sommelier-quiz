import type React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/common/atoms/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/ui/card";
import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { Textarea } from "@/common/ui/textarea";
import { Mail, Phone, MapPin, Clock, User } from "lucide-react";
import { NavbarLandind } from "@/common/molecules/nav/nav-landing.molecule";
import { Footer } from "@/common/molecules/footer.molecule";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí integrarías con tu lógica de envío de formulario
    console.log("Formulario de contacto enviado");
  };

  return (
    <div className="max-h-[100vh] flex flex-col overflow-y-auto bg-slate-50">
      {/* Navbar */}
      <NavbarLandind currentPage="contact" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Contáctanos</h1>
            <p className="text-sm md:text-base opacity-90">
              ¿Tienes alguna pregunta o quieres organizar un evento? Estamos
              aquí para ayudarte.
            </p>
          </div>
        </div>
      </section>
      {/* Contact Content */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Primera fila: Formulario e Información de contacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
            {/* Formulario de Contacto */}
            <div className="flex flex-col h-full">
              <Card className="shadow-lg border-slate-200 h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-slate-800">
                    Envíanos un mensaje
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-xs">
                    Completa el formulario y nos pondremos en contacto contigo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-3 flex-1 flex flex-col"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label
                          htmlFor="nombre"
                          className="text-slate-700 text-xs"
                        >
                          Nombre
                        </Label>
                        <Input
                          id="nombre"
                          placeholder="Tu nombre"
                          required
                          className="border-slate-300 focus:border-emerald-500 h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="apellido"
                          className="text-slate-700 text-xs"
                        >
                          Apellido
                        </Label>
                        <Input
                          id="apellido"
                          placeholder="Tu apellido"
                          required
                          className="border-slate-300 focus:border-emerald-500 h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-slate-700 text-xs">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="border-slate-300 focus:border-emerald-500 h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="telefono"
                        className="text-slate-700 text-xs"
                      >
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="border-slate-300 focus:border-emerald-500 h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="asunto"
                        className="text-slate-700 text-xs"
                      >
                        Asunto
                      </Label>
                      <Input
                        id="asunto"
                        placeholder="¿En qué podemos ayudarte?"
                        required
                        className="border-slate-300 focus:border-emerald-500 h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1 flex-1 flex flex-col">
                      <Label
                        htmlFor="mensaje"
                        className="text-slate-700 text-xs"
                      >
                        Mensaje
                      </Label>
                      <Textarea
                        id="mensaje"
                        placeholder="Cuéntanos más detalles..."
                        className="min-h-[60px] border-slate-300 focus:border-emerald-500 text-xs flex-1"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 h-8 text-sm"
                    >
                      Enviar mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Información de Contacto */}
            <div className="flex flex-col h-full">
              <Card className="border-slate-200 h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-800">
                    Información de contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 flex-1 flex flex-col">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-xs">
                        Email
                      </h3>
                      <p className="text-slate-600 text-xs">
                        info@foodevents.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-xs">
                        Teléfono
                      </h3>
                      <p className="text-slate-600 text-xs">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-xs">
                        Dirección
                      </h3>
                      <p className="text-slate-600 text-xs">
                        Calle Principal 123, Ciudad
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-xs">
                        Horarios
                      </h3>
                      <p className="text-slate-600 text-xs">
                        Lun-Vie: 9AM-6PM | Sáb: 10AM-4PM
                      </p>
                    </div>
                  </div>
                  <div className="flex-1" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
