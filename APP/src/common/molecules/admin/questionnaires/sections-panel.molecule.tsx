"use client"

import React from "react"
import { Search, Filter, X, Plus} from "lucide-react"

// Form and UI components
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Badge } from "@/common/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/common/ui/accordion"
import { Getcategories } from "@/api/types/categories.type"
import { question } from "@/api/types/questions.type"
import { Nivel } from "@/api/types/nivel.type"
import { Skeleton } from "@/common/ui/skeleton"



interface SectionPanelProps {
    isLoaded: boolean;
    activeTab: string;
    searchTerm: string;
    categoryFilter: number | null;
    categories: Getcategories[];
    levelFilter: string | null;
    niveles: Nivel[];
    allQuestions: question[];
    selectedQuestions: question[];

    // State setters
    setCategoryFilter: (value: React.SetStateAction<number | null>) => void;
    setSearchTerm: (data: string) => void;
    setActiveTab: (data: string) => void;
    setLevelFilter: (value: React.SetStateAction<string | null>) => void;

    // Loading states
    isLoadingQuestions: boolean;

    // Filter related
    hasActiveFilters: string | boolean;
    clearFilters: () => void;

    // Question management
    handleAddQuestion: (question: question) => void;

    // Accordion state (for categorized view)
    accordionValue: string[];
    setAccordionValue: React.Dispatch<React.SetStateAction<string[]>>;

    // For the filtered tab
    selectedCategories: number[];
    filteredQuestions: question[];
}


export default function SectionPanel(
    { isLoaded,
        activeTab,
        searchTerm,
        categoryFilter,
        categories,
        levelFilter,
        niveles,
        allQuestions,
        selectedQuestions,
        setCategoryFilter,
        setSearchTerm,
        setActiveTab,
        setLevelFilter,
        isLoadingQuestions,
        hasActiveFilters,
        clearFilters,
        handleAddQuestion,
        accordionValue,
        setAccordionValue,
        selectedCategories,
        filteredQuestions,
    }: SectionPanelProps) {
    return (
        <div
            className={`w-1/2 max-h-[82vh] overflow-y-auto flex flex-col opacity-100 ${isLoaded ? "animate-fade-in" : ""
                }`}
            style={{ animationDelay: "0.6s" }}
        >
            <div className="p-6 h-full flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4">
                    Preguntas Disponibles
                </h2>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <TabsList className="bg-white/10 border-white/20 border">
                        <TabsTrigger value="questions" className="text-white data-[state=active]:bg-white/20">
                            Todas las Preguntas
                        </TabsTrigger>

                    </TabsList>

                    <TabsContent value="questions" className="flex-1 flex flex-col mt-4">
                        {/* Filters */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4 mb-4">
                            <h3 className="text-white font-medium mb-3 flex items-center">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtrar Preguntas
                            </h3>

                            <div className="space-y-3">
                                {/* Search Filter */}
                                <div>
                                    <label className="block text-white/80 text-sm mb-1">Buscar</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                                        <Input
                                            type="text"
                                            placeholder="Buscar por texto..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">Categoría</label>
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
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">Nivel</label>
                                        <Select
                                            value={levelFilter === null ? "all" : levelFilter}
                                            onValueChange={(value) => setLevelFilter(value === "all" ? null : value)}
                                        >
                                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                                <SelectValue placeholder="Todos los niveles" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos los niveles</SelectItem>
                                                {niveles.map((nivel) => (
                                                    <SelectItem key={nivel.id} value={nivel.name}>
                                                        {nivel.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                        </div>

                        {/* Questions List */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                            {isLoadingQuestions ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4">
                                        <Skeleton className="h-6 w-3/4 bg-white/20 mb-2" />
                                        <div className="flex space-x-2 mt-3">
                                            <Skeleton className="h-5 w-20 bg-white/20" />
                                            <Skeleton className="h-5 w-20 bg-white/20" />
                                        </div>
                                    </div>
                                ))
                            ) : filteredQuestions.length > 0 ? (
                                filteredQuestions.map((question) => (
                                    <div
                                        key={question.id}
                                        className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4 hover:bg-white/20 transition-colors"
                                    >
                                        <div className="flex justify-between">
                                            <p className="text-white">{question.question}</p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleAddQuestion(question)}
                                                className="h-8 w-8 p-0 bg-blue-500/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/40 border-blue-500/40"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center mt-3 space-x-2">
                                            <Badge className={`${question.response ? 'bg-green-500/60' : 'bg-red-500/60'} text-white`}>
                                                {question.response ? 'Verdadero' : 'Falso'}
                                            </Badge>
                                            <Badge className="bg-blue-500/30 text-blue-100">
                                                {question.level}
                                            </Badge>
                                            {question.categories.map((category) => (
                                                <Badge
                                                    key={category.id}
                                                    className="bg-purple-500/30 text-purple-100"
                                                >
                                                    {category.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white/10 border border-white/20 rounded-lg">
                                    <p className="text-white/70">
                                        {hasActiveFilters ? "No se encontraron preguntas con los filtros aplicados." : "No hay preguntas disponibles."}
                                    </p>
                                    {hasActiveFilters && (
                                        <Button
                                            onClick={clearFilters}
                                            variant="link"
                                            className="text-blue-400 hover:text-blue-300 mt-2"
                                        >
                                            Limpiar filtros
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="filtered" className="flex-1 flex flex-col mt-4 overflow-y-auto">
                        {selectedCategories.length === 0 ? (
                            <div className="text-center py-12 bg-white/10 border border-white/20 rounded-lg">
                                <p className="text-white/70">Selecciona categorías para ver las preguntas relacionadas.</p>
                            </div>
                        ) : (
                            <Accordion
                                type="multiple"
                                value={accordionValue}
                                onValueChange={setAccordionValue}
                                className="space-y-3 pr-2"
                            >
                                {selectedCategories.map((categoryId: any) => {
                                    const category = categories.find(c => c.id === categoryId);
                                    if (!category) return null;

                                    const categoryQuestions = allQuestions.filter(q =>
                                        q.categories.some(qc => qc.id === categoryId) &&
                                        !selectedQuestions.some(sq => sq.id === q.id)
                                    );

                                    return (
                                        <AccordionItem
                                            key={categoryId}
                                            value={`category-${categoryId}`}
                                            className="border-white/20 bg-white/10 rounded-lg overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-4 py-3 hover:bg-white/10 text-white">
                                                <div className="flex items-center">
                                                    {category.name}
                                                    <Badge className="ml-3 bg-white/20 text-white">
                                                        {categoryQuestions.length} preguntas
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-3 pt-1">
                                                <div className="space-y-3">
                                                    {categoryQuestions.length > 0 ? (
                                                        categoryQuestions.map((question) => (
                                                            <div
                                                                key={question.id}
                                                                className="bg-white/10 rounded-lg border border-white/20 p-3 hover:bg-white/15 transition-colors"
                                                            >
                                                                <div className="flex justify-between">
                                                                    <p className="text-white">{question.question}</p>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => handleAddQuestion(question)}
                                                                        className="h-7 w-7 p-0 bg-blue-500/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/40 border-blue-500/40"
                                                                    >
                                                                        <Plus className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </div>
                                                                <div className="flex items-center mt-2 space-x-2">
                                                                    <Badge className={`${question.response ? 'bg-green-500/60' : 'bg-red-500/60'} text-white text-xs`}>
                                                                        {question.response ? 'Verdadero' : 'Falso'}
                                                                    </Badge>
                                                                    <Badge className="bg-blue-500/30 text-blue-100 text-xs">
                                                                        {question.level}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-white/60 text-center py-3">No hay preguntas disponibles para esta categoría.</p>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}