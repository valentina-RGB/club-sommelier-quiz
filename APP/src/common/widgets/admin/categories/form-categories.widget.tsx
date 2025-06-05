"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"

import { useCreateCategorieMutation, useUpdateCategorieMutation } from "@/api/mutations/categorie.mutation"
import { Getcategories } from "@/api/types/categories.type"
import { Form } from "@/common/ui/form"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Textarea } from "@/common/ui/textarea"
import { Label } from "@/common/ui/label"
import { CategoryFormData, categoryFormSchema } from "@/api/schemas/categorie.schema"

interface CategoryFormDialogProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Getcategories
    isEditing?: boolean
}

export default function CategoryFormDialog({
    isOpen,
    onClose,
    initialData,
    isEditing = false
}: CategoryFormDialogProps) {
    const { mutateAsync: createCategory } = useCreateCategorieMutation()
    const { mutateAsync: updateCategory } = useUpdateCategorieMutation()

    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            description: initialData.description || "",
        } : {
            name: "",
            description: "",
        }
    });

    // Reset form when initialData changes
    useEffect(() => {
        if (isEditing && initialData) {
            form.reset({
                name: initialData.name,
                description: initialData.description || "",
            });
        } else {
            form.reset({
                name: "",
                description: "",
            });
        }
    }, [form, initialData, isEditing]);

    const handleFormSubmit = async (data: CategoryFormData) => {
        try {
            if (isEditing && initialData?.id) {
                await updateCategory({
                    id: initialData.id,
                    data: data
                });
            } else {
                await createCategory(data);
            }
            form.reset();
            onClose();
        } catch (error) {
            console.error("Error al guardar categoría:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 relative  backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-semibold text-white">
                        {isEditing ? "Editar Categoría" : "Crear Nueva Categoría"}
                    </p>
                    <button
                        onClick={onClose}
                        className="text-white/70 absolute right-0 top-1 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Nombre de la categoría"
                                    className="bg-white/10 border-white/20 text-gray-400 placeholder:text-black/50"
                                    {...form.register("name")}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-red-400 text-sm">{form.formState.errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-white">Descripción (opcional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Descripción de la categoría"
                                    className="bg-white/10 border-white/20 text-gray-400 placeholder:text-black/50"
                                    {...form.register("description")}
                                />
                                {form.formState.errors.description && (
                                    <p className="text-red-400 text-sm">{form.formState.errors.description.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={onClose}
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                    {isEditing ? "Actualizar" : "Crear"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}