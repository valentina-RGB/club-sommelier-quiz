import { useCategoriesQuery } from "@/api/query/category.queries"
import { useDeleteCategorieMutation } from "@/api/mutations/categorie.mutation"
import { Button } from "@/common/ui/button"
import { Trash2, Plus, Edit2 } from "lucide-react"
import { useState } from "react"

import { Getcategories } from "@/api/types/categories.type"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/common/ui/alert-dialog"
import CategoryFormDialog from "../categories/form-categories.widget"


export const CategoriesWidget = () => {
    const { data, isLoading } = useCategoriesQuery()
    const { mutate: deleteCategory } = useDeleteCategorieMutation()
    
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Getcategories | undefined>(undefined)

    const handleOpenCreate = () => {
        setIsEditing(false)
        setSelectedCategory(undefined)
        setIsFormOpen(true)
    }

    const handleOpenEdit = (category: Getcategories) => {
        setIsEditing(true)
        setSelectedCategory(category)
        setIsFormOpen(true)
    }

    const handleDelete = (id: number) => {
        deleteCategory(id)
    }

    const handleClose = () => {
        setIsFormOpen(false)
    }

    return (
        <>
            <div className="bg-white/10 rounded-xl h-[45vh] overflow-y-auto p-4 border border-white/20">
                <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium mb-3">Categorías</h4>
                    <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white h-7 rounded-full"
                        onClick={handleOpenCreate}
                    >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Crear</span>
                    </Button>
                </div>
                
                <div className="space-y-2 text-sm mt-4">
                    {isLoading && (
                        <div className="text-white/70">Cargando...</div>
                    )}
                    
                    {data && data.length === 0 && (
                        <div className="text-white/70 text-center py-4">
                            No hay categorías disponibles
                        </div>
                    )}
                    
                    {data && data.map(category => (
                        <div 
                            key={category.id} 
                            className="flex justify-between items-center  text-white/80 p-2 hover:bg-white/5 rounded-md"
                        >
                            <div>
                                <span className="capitalize font-medium">{category.name}</span>
                                {category.description && (
                                    <p className="text-xs text-white/50 mt-0.5">{category.description}</p>
                                )}
                            </div>
                            <div className="flex space-x-1">
                                <Button
                                    size="icon"
                                    className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20"
                                    onClick={() => handleOpenEdit(category)}
                                    title="Editar categoría"
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="h-6 w-6 rounded-full bg-white/10 hover:bg-red-500"
                                            title="Eliminar categoría"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-slate-800 border-slate-700">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-white">¿Eliminar categoría?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-white/70">
                                                Esta acción no se puede deshacer. Se eliminará permanentemente
                                                la categoría "{category.name}".
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
                                                Cancelar
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(category.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Eliminar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <CategoryFormDialog
                isOpen={isFormOpen}
                onClose={handleClose}
                initialData={selectedCategory}
                isEditing={isEditing}
            />
        </>
    )
}