"use client"


import { UseFormReturn } from "react-hook-form"
import {Calendar, Clock, AlarmClock, User } from "lucide-react"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/common/ui/form"


interface FormEventProps {
    form: UseFormReturn<any>
    isEditing: boolean
    handleFormSubmit: (data:any)=>void
    onClose: ()=>void
}



export default function FormEvent ({form, handleFormSubmit, isEditing, onClose}:FormEventProps)  {
    return (
           <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 text-sm font-medium">
                    <User className="inline h-4 w-4 mr-2" />
                    Nombre del Evento
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white/90 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Ingresa el nombre del evento"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 text-sm font-medium">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Fecha de inicio
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="bg-white/90 border-white/20  text-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-white/80 text-sm font-medium">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Hora de inicio
                    </FormLabel>
                    <FormControl className="w-full">
                      <Input
                        {...field}
                        type="time"
                        className="bg-white/90 border-white/20  w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 text-sm font-medium">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Fecha de fin
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="bg-white/90 border-white/20 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 text-sm font-medium">
                      <AlarmClock className="inline h-4 w-4 mr-2" />
                      Hora de fin
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="time"
                        className="bg-white/90 border-white/20 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={()=>{
                    onClose();
                    form.reset();
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isEditing ? "Guardar Cambios" : "Crear Evento"}
              </Button>
            </div>
          </form>
        </Form>
    )
}