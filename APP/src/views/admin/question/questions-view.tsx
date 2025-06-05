"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Trash2, Filter, X, Edit, Plus, FileText, Tag } from "lucide-react"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { useQuestionsQuery, useQuestionByIDQuery } from "@/api/query/questions.queries"
import { useCategoriesQuery } from "@/api/query/category.queries"
import { useCreateQuestionMutation, useDeleteQuestionMutation, useUpdateQuestionMutation } from "@/api/mutations/questions.mutation"
import { Badge } from "@/common/ui/badge"
import { Skeleton } from "@/common/ui/skeleton"
import { Card } from "@/common/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { Postquestion } from "@/api/types/questions.type"
import { QuestionForm } from "@/common/widgets/admin/questions/questions-form.widget"
import { QuestionFormData } from "@/api/schemas/questions.schema"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/common/ui/alert-dialog"
import { CheckCircle, XCircle } from "lucide-react"
import { useNivelesQuery } from "@/api/query/level.queries"
import AnimatedBackground from "@/common/atoms/animated-background"

export default function QuestionsView() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null)
    const [levelFilter, setLevelFilter] = useState<string | null>(null)
    const [responseFilter, setResponseFilter] = useState<boolean | null>(null)

    // Fetch questions, categories, and selected question
    const { data: questions = [], isLoading, isError } = useQuestionsQuery()
    const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery()
    const { data: nivels= [] } = useNivelesQuery();

    const {
        data: selectedQuestion,
        isLoading: isLoadingDetails,
        isError: isErrorDetails
    } = useQuestionByIDQuery(selectedQuestionId)

    // Mutations
    const createQuestionMutation = useCreateQuestionMutation()
    const updateQuestionMutation = useUpdateQuestionMutation()
    const deleteQuestionMutation = useDeleteQuestionMutation()

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    // Filter questions based on search term and filters
    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            // Text search
            const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase())

            // Category filter
            const matchesCategory = categoryFilter === null ||
                q.categories.some(cat => cat.id === categoryFilter)

            // Level filter
            const matchesLevel = levelFilter === null ||
                q.level === levelFilter

            // Response filter (true/false)
            const matchesResponse = responseFilter === null ||
                q.response === responseFilter

            return matchesSearch && matchesCategory && matchesLevel && matchesResponse
        })
    }, [questions, searchTerm, categoryFilter, levelFilter, responseFilter])

    const clearFilters = () => {
        setSearchTerm("")
        setCategoryFilter(null)
        setLevelFilter(null)
        setResponseFilter(null)
    }

    const hasActiveFilters = searchTerm || categoryFilter !== null || levelFilter !== null || responseFilter !== null

    const startCreating = () => {
        setSelectedQuestionId(null)
        setIsEditing(true)
        setIsCreating(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setIsCreating(false)
    }

    const handleFormSubmit = (data: QuestionFormData) => {
        if (isCreating) {
            createQuestionMutation.mutate(data as Postquestion, {
                onSuccess: () => {
                    setIsEditing(false)
                    setIsCreating(false)
                }
            })
        } else if (selectedQuestionId) {
            updateQuestionMutation.mutate({
                id: selectedQuestionId,
                data
            }, {
                onSuccess: () => {
                    setIsEditing(false)
                }
            })
        }
    }

    const handleDelete = () => {
        if (selectedQuestionId) {
            deleteQuestionMutation.mutate(selectedQuestionId, {
                onSuccess: () => {
                    setSelectedQuestionId(null)
                    setDeleteDialogOpen(false)
                }
            })
        }
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
            <main className="relative h-[92vh] w-full pt-5 flex">
                {/* Sidebar - Filters */}
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
                            <label className="block text-white/80 text-sm font-medium mb-2">Buscar preguntas</label>
                            <div className="relative">
                                <Search className="absolute left-1 top-1/2 h-4 w-4 z-30 -translate-y-1/2 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por texto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-6 "
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-4">
                            <label className="block text-white/80 text-sm font-medium mb-2">Filtrar por categoría</label>
                            <Select
                                value={categoryFilter === null ? "all" : categoryFilter.toString()}
                                onValueChange={(value) => setCategoryFilter(value === "all" ? null : parseInt(value))}
                            >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Todas las categorías" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Level Filter */}
                        <div className="mb-4">
                            <label className="block text-white/80 text-sm font-medium mb-2">Filtrar por nivel</label>
                            <Select
                                value={levelFilter === null ? "all" : levelFilter}
                                onValueChange={(value) => setLevelFilter(value === "all" ? null : value)}
                            >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Todos los niveles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los niveles</SelectItem>
                                    {nivels.map((nivel) => (
                                        <SelectItem key={nivel.id} value={nivel.name}>
                                            {nivel.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Response Filter */}
                        <div className="mb-4">
                            <label className="block text-white/80 text-sm font-medium mb-2">Filtrar por respuesta</label>
                            <Select
                                value={responseFilter === null ? "all" : responseFilter ? "true" : "false"}
                                onValueChange={(value) => {
                                    if (value === "all") setResponseFilter(null)
                                    else setResponseFilter(value === "true")
                                }}
                            >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Cualquier respuesta" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Cualquier respuesta</SelectItem>
                                    <SelectItem value="true">Realidad</SelectItem>
                                    <SelectItem value="false">Mito</SelectItem>
                                </SelectContent>
                            </Select>
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
                                    <span>Total preguntas:</span>
                                    <span className="font-medium text-white">{questions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Preguntas filtradas:</span>
                                    <span className="font-medium text-white">{filteredQuestions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Verdaderas:</span>
                                    <span className="font-medium text-white">{questions.filter(q => q.response).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Falsas:</span>
                                    <span className="font-medium text-white">{questions.filter(q => !q.response).length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                            <h4 className="text-white font-medium mb-3">Categorías</h4>
                            <div className="space-y-2 text-sm">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex justify-between text-white/80">
                                        <span>{category.name}</span>
                                        <span>{questions.filter(q => q.categories.some(c => c.id === category.id)).length}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div
                    className={`w-1/3 flex-1 flex flex-col opacity-100 ${isLoaded ? "animate-fade-in" : ""} border-r border-white/20`}
                    style={{ animationDelay: "0.6s" }}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <FileText className="h-6 w-6 mr-3" />
                                Preguntas
                                {hasActiveFilters && (
                                    <span className="ml-3 text-sm bg-blue-500 px-2 py-1 rounded-full">
                                        {filteredQuestions.length} resultados
                                    </span>
                                )}
                            </h2>
                            <Button
                                onClick={startCreating}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Pregunta
                            </Button>
                        </div>

                        {/* Questions List */}
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
                            ) : filteredQuestions.length > 0 ? (
                                filteredQuestions.map((question) => (
                                    <div
                                        key={question.id}
                                        onClick={() => {
                                            setSelectedQuestionId(question.id)
                                            setIsEditing(false)
                                            setIsCreating(false)
                                        }}
                                        className={`bg-white/20 backdrop-blur-lg rounded-xl border cursor-pointer 
                      ${selectedQuestionId === question.id ? 'border-blue-400 bg-white/20' : 'border-white/20'} 
                      p-4 hover:bg-white/20 transition-all duration-200`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-white font-medium text-lg line-clamp-2">{question.question}</h3>
                                            <Badge className={`${question.response ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                                {question.response ? 'Realidad' : 'Mito'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center text-white/70 text-sm mb-3">
                                            <Tag className="h-4 w-4 mr-2" />
                                            <span>{question.level}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {question.categories.map((category) => (
                                                <Badge key={category.id} className="bg-blue-500/30 text-blue-100 border-blue-500/50">
                                                    {category.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <FileText className="h-16 w-16 text-white/30 mb-4" />
                                    <p className="text-white/60 text-lg mb-2">
                                        {hasActiveFilters ? "No se encontraron preguntas" : "No hay preguntas disponibles"}
                                    </p>
                                    <p className="text-white/40 text-sm mb-6 text-center px-4">
                                        {hasActiveFilters
                                            ? "Intenta ajustar los filtros de búsqueda"
                                            : "Las preguntas aparecerán aquí cuando estén disponibles"}
                                    </p>
                                    <Button onClick={startCreating} className="bg-blue-500 hover:bg-blue-600 text-white">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Crear Nueva Pregunta
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Question Details / Edit */}
                <div
                    className={`w-1/3 flex flex-col opacity-100  ${isLoaded ? "animate-fade-in" : ""}`}
                    style={{ animationDelay: "0.8s" }}
                >
                    <div className="p-6 h-full">
                        {isCreating || (selectedQuestionId && isEditing) ? (
                            // Edit/Create Mode
                            <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xl font-bold text-white">
                                        {isCreating ? "Crear Nueva Pregunta" : "Editar Pregunta"}
                                    </p>
                                </div>

                                <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 p-4 overflow-y-auto flex-1">
                                    <QuestionForm
                                        initialData={isCreating ? null : selectedQuestion}
                                        isEditing={!isCreating}
                                        onSubmit={handleFormSubmit}
                                        onCancel={handleCancel}
                                        isSubmitting={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                                    />
                                </div>
                            </div>
                        ) : selectedQuestionId ? (
                            isLoadingDetails ? (
                                <div className="h-full flex flex-col gap-4">
                                    <Skeleton className="h-8 w-3/4 bg-white/20" />
                                    <Skeleton className="h-6 w-1/3 bg-white/20" />
                                    <Skeleton className="h-40 w-full bg-white/20 my-4" />
                                    <Skeleton className="h-6 w-full bg-white/20" />
                                    <Skeleton className="h-6 w-2/3 bg-white/20" />
                                </div>
                            ) : isErrorDetails ? (
                                <div className="h-full flex flex-col items-center justify-center">
                                    <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-6 text-center">
                                        <h3 className="text-white text-lg font-medium mb-2">Error al cargar los detalles</h3>
                                        <p className="text-white/80">
                                            No se pudo cargar la información de la pregunta. Intente nuevamente.
                                        </p>
                                        <Button
                                            onClick={() => setSelectedQuestionId(null)}
                                            className="mt-4 bg-white/10 hover:bg-white/20 text-white"
                                        >
                                            Volver a la lista
                                        </Button>
                                    </div>
                                </div>
                            ) : selectedQuestion ? (
                                <div className="h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-xl font-bold text-white">
                                            Detalles
                                        </h3>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => setDeleteDialogOpen(true)}
                                                variant="outline"
                                                className="bg-red-500/50 hover:bg-red-500/30 text-white border-red-500/30"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Eliminar
                                            </Button>
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                        </div>
                                    </div>

                                    <Card className="bg-white/20 backdrop-blur-lg border border-white/20 p-4 mb-4">
                                        <h3 className="text-white font-medium mb-2">Pregunta</h3>
                                        <p className="text-white/90">{selectedQuestion.question}</p>
                                    </Card>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <Card className="bg-white/20 backdrop-blur-lg border border-white/20 p-4">
                                            <h3 className="text-white font-medium mb-2">Respuesta</h3>
                                            <div className="flex items-center space-x-2">
                                                {selectedQuestion.response ? (
                                                    <>
                                                        <CheckCircle className="h-10 w-10 text-green-400" />
                                                        <span className="text-white">Realidad</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-10 w-10 text-red-400" />
                                                        <span className="text-white">Mito</span>
                                                    </>
                                                )}
                                            </div>
                                        </Card>

                                        <Card className="bg-white/20 backdrop-blur-lg border border-white/20 p-4">
                                            <h3 className="text-white font-medium mb-2">Nivel</h3>
                                            <p className="text-white">{selectedQuestion.level}</p>
                                        </Card>
                                    </div>

                                    <Card className="bg-white/20 backdrop-blur-lg border border-white/20 p-4 flex-1">
                                        <h3 className="text-white font-medium mb-3">Categorías</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedQuestion.categories.map((category) => (
                                                <Badge
                                                    key={category.id}
                                                    className="bg-blue-500/30 text-blue-100 border-blue-500/50 px-3 py-1"
                                                >
                                                    {category.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center">
                                    <p className="text-white/60">No se encontró información de la pregunta</p>
                                </div>
                            )
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center">
                                <FileText className="h-16 w-16 text-white/30 mb-4" />
                                <h3 className="text-white text-xl font-medium mb-2">Selecciona una pregunta</h3>
                                <p className="text-white/60 text-center mb-6">
                                    Haz clic en una pregunta de la lista para ver sus detalles
                                </p>
                                <Button
                                    onClick={startCreating}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Nueva Pregunta
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/70">
                            Esta acción eliminará permanentemente esta pregunta y no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}