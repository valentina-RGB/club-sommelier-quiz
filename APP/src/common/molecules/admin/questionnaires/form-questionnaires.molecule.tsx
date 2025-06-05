import { Getcategories } from "@/api/types/categories.type";
import { question } from "@/api/types/questions.type";
import { Badge } from "@/common/ui/badge";
import { Button } from "@/common/ui/button";
import { Checkbox } from "@/common/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/common/ui/form";
import { Input } from "@/common/ui/input";
import { Skeleton } from "@/common/ui/skeleton";
import { Textarea } from "@/common/ui/textarea";
import { DndContext, SensorDescriptor, SensorOptions, CollisionDetection, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SortableQuestionItem } from "./sortable-question-item.molecule";
import { UseMutationResult } from "@tanstack/react-query";
import { GetQuestionnaire, PostQuestionnaire } from "@/api/types/quetionnaire.type";
import { useUpdateQuestionnaireMutation } from "@/api/mutations/quetionnaire.mutation";


interface FormQuestionsProps {
    form: UseFormReturn<any>
    isLoadingCategories: boolean
    categories: Getcategories[]
    selectedQuestions: question[]
    sensors: SensorDescriptor<SensorOptions>[]
    closestCenter: CollisionDetection
    onSubmit: (data: any) => void
    handleDragEnd: (event: DragEndEvent) => void
    handleRemoveQuestion: (data: number) => void
    createQuestionnaireMutation: UseMutationResult<GetQuestionnaire, Error, any, unknown>
    updateQuestionnaireMutation: UseMutationResult<GetQuestionnaire, Error, any, unknown>
    isEditing:boolean


}


export default function FormQuestionnaires ({form, isEditing, onSubmit, isLoadingCategories, categories,sensors, selectedQuestions, handleDragEnd, handleRemoveQuestion, createQuestionnaireMutation, updateQuestionnaireMutation}:FormQuestionsProps){
    return (
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col  max-h-[70vh]">
              <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">Título</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ingresa un título para el cuestionario" 
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe el propósito de este cuestionario" 
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Categories Field */}
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">Categorías</FormLabel>
                      <div className="bg-white/10 border-white/20 border rounded-md p-4">
                        <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
                          {isLoadingCategories ? (
                            Array(6).fill(0).map((_, i) => (
                              <Skeleton key={i} className="h-8 bg-white/10" />
                            ))
                          ) : (
                            categories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`category-${category.id}`}
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    let updated = [...(field.value || [])];
                                    if (checked) {
                                      updated.push(category.id);
                                    } else {
                                      updated = updated.filter(id => id !== category.id);
                                    }
                                    field.onChange(updated);
                                  }}
                                  className="data-[state=checked]:bg-blue-500"
                                />
                                <label 
                                  htmlFor={`category-${category.id}`}
                                  className="text-white cursor-pointer"
                                >
                                  {category.name}
                                </label>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Selected Questions Field - Modified to use DnD-Kit */}
                <FormField
                  control={form.control}
                  name="questions"
                  render={() => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-white font-medium">Preguntas Seleccionadas</FormLabel>
                        <Badge className="bg-blue-500 text-white">
                          {selectedQuestions.length} preguntas
                        </Badge>
                      </div>
                      
                      {selectedQuestions.length > 0 ? (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext 
                            items={selectedQuestions.map(q => q.id.toString())} 
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                              {selectedQuestions.map((question, index) => (
                                <SortableQuestionItem
                                  key={question.id}
                                  question={question}
                                  index={index}
                                  onRemove={handleRemoveQuestion}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      ) : (
                        <div className="text-center py-8 bg-white/10 border border-white/20 rounded-lg">
                          <p className="text-white/70">
                            No hay preguntas seleccionadas.
                          </p>
                          <p className="text-white/50 text-sm mt-1">
                            Añade preguntas desde el panel de la derecha.
                          </p>
                        </div>
                      )}
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={createQuestionnaireMutation.isPending || updateQuestionnaireMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Guardar Cambios' : 'Crear Cuestionario'}
                </Button>
              </div>
            </form>
          </Form>
    )
}